"use client";
import React, { useState, useEffect } from "react";
import { DELIVERY_CONFIG_ENDPOINT, DELIVERY_SLOTS_ENDPOINT } from "@/config/SaleorApi";
import { formatLocalDate, parseLocalDate, startOfLocalDay } from "@/lib/localDate";

const DEFAULT_CUTOFF_HOUR = 19;
const DEFAULT_TIME_SLOTS = [
	{ id: 1, name: "Morning 1", label: "8:30AM - 10:30AM", startTime: 8.5, endTime: 10.5, disabledAt: 0, sortOrder: 5, isActive: true },
	{ id: 2, name: "Morning 2", label: "10:30AM - 12:30PM", startTime: 10.5, endTime: 12.5, disabledAt: 0, sortOrder: 8, isActive: true },
	{ id: 3, name: "Evening 1", label: "5:00PM - 7:00PM", startTime: 17, endTime: 19, disabledAt: 0, sortOrder: 10, isActive: true },
	{ id: 4, name: "Evening 2", label: "7:00PM - 9:00PM", startTime: 19, endTime: 21, disabledAt: 0, sortOrder: 15, isActive: true },
];

const DeliverySlotPicker = ({ selectedSlot, setSelectedSlot }) => {
	const [slots, setSlots] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [timeSlotTemplates, setTimeSlotTemplates] = useState(DEFAULT_TIME_SLOTS);
	const [cutoffHour, setCutoffHour] = useState(DEFAULT_CUTOFF_HOUR);
	const [isLoadingSlots, setIsLoadingSlots] = useState(true);
	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 60000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		const fetchDeliveryData = async () => {
			setIsLoadingSlots(true);
			try {
				const [slotsRes, configRes] = await Promise.all([
					fetch(DELIVERY_SLOTS_ENDPOINT),
					fetch(DELIVERY_CONFIG_ENDPOINT),
				]);

				if (slotsRes.ok) {
					const slotsData = await slotsRes.json();
					const activeSlots = (slotsData?.timeSlots || [])
						.filter((slot) => slot?.isActive)
						.sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));

					if (activeSlots.length > 0) {
						setTimeSlotTemplates(activeSlots);
					}
				}

				if (configRes.ok) {
					const configData = await configRes.json();
					const apiCutoff = configData?.deliveryConfig?.cutoffHour;
					if (apiCutoff != null) {
						setCutoffHour(apiCutoff);
					}
				}
			} catch (error) {
				console.warn("Failed to load delivery slots, using defaults:", error);
			} finally {
				setIsLoadingSlots(false);
			}
		};

		void fetchDeliveryData();
	}, []);

	useEffect(() => {
		if (isLoadingSlots || timeSlotTemplates.length === 0) {
			return;
		}

		const generateSlots = () => {
			const newSlots = [];
			const now = new Date();
			const currentHour = now.getHours() + now.getMinutes() / 60;
			const isBeforeCutoff = currentHour < cutoffHour;
			const eidDates = [
				{ date: "2026-03-19", label: "Eid Special Slots" },
				{ date: "2026-03-20", label: "Eid Special Slots" },
			];

			const addSlotsForDay = (date, dayLabel, onlyCheckAvailability = false) => {
				timeSlotTemplates.forEach((template) => {
					const slot = createSlot(date, dayLabel, template);
					if (!onlyCheckAvailability) {
						newSlots.push(slot);
						return;
					}
					
					const isMorningSlot = template.startTime < cutoffHour;
					const slotCutoff =
						template.disabledAt > 0 ? template.disabledAt : template.startTime - 0.5;
					const isSlotGone = currentHour >= slotCutoff;
					if (isBeforeCutoff) {
						slot.available = !isSlotGone;
					} else if (isMorningSlot) {
						slot.available = false;
					} else {
						slot.available = !isSlotGone;
					}

					newSlots.push(slot);
				});
			};

			const today = startOfLocalDay(now);
			const todayStr = formatLocalDate(today);
			const eidToday = eidDates.find((d) => d.date === todayStr);
			const todayLabel = eidToday ? eidToday.label : "Today";
			addSlotsForDay(today, todayLabel, true);

			for (let i = 1; i <= 2; i++) {
				const nextDay = new Date(today);
				nextDay.setDate(today.getDate() + i);
				const nextDayStr = formatLocalDate(nextDay);
				const eidNextDay = eidDates.find((d) => d.date === nextDayStr);
				const dayName = eidNextDay
					? eidNextDay.label
					: nextDay.toLocaleDateString([], { weekday: "long" });
				addSlotsForDay(nextDay, dayName);
			}

			eidDates.forEach((eid) => {
				const eidDateObj = parseLocalDate(eid.date);
				const horizon = new Date(today);
				horizon.setDate(today.getDate() + 2);

				if (eidDateObj > horizon) {
					addSlotsForDay(eidDateObj, eid.label);
				}
			});

			setSlots(newSlots);
		};

		generateSlots();
	}, [currentTime, cutoffHour, timeSlotTemplates, isLoadingSlots]);

	const createSlot = (date, dayLabel, template) => {
		const localDate = startOfLocalDay(date);
		return {
			id: `${formatLocalDate(localDate)}_${template.startTime}_${template.endTime}`,
			date: localDate,
			day: dayLabel,
			slot: template.label,
			slotId: template.id,
			startTime: template.startTime,
			endTime: template.endTime,
			available: true,
		};
	};

	const handleSelectSlot = (slot) => {
		if (!slot.available) return;
		setSelectedSlot(slot);
		setIsOpen(false);
	};

	return (
		<div className="relative w-full max-w-sm">
			<button
				className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 transition-all hover:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
				onClick={() => setIsOpen(!isOpen)}
				disabled={isLoadingSlots}
			>
				{isLoadingSlots ? (
					<span className="text-gray-500">Loading delivery slots...</span>
				) : selectedSlot ? (
					<span>
						{selectedSlot.day},{" "}
						{selectedSlot.date.toLocaleDateString([], {
							day: "numeric",
							month: "short",
						})}{" "}
						- {selectedSlot.slot}
					</span>
				) : (
					<span className="text-gray-500">Choose Delivery Slot</span>
				)}
				<span className={`ml-2 transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}>▼</span>
			</button>

			{isOpen &&
				!isLoadingSlots &&
				(() => {
					const slotsByDay = slots?.reduce((acc, slot) => {
						const dayKey = formatLocalDate(slot?.date);
						if (!acc[dayKey]) {
							acc[dayKey] = {
								day: slot?.day,
								date: slot?.date,
								slots: [],
							};
						}
						acc[dayKey]?.slots?.push(slot);
						return acc;
					}, {});

					return (
						<div className="animate-fade-in absolute z-20 mt-2 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
							<div className="space-y-4">
								{Object.values(slotsByDay).map((dayGroup) => (
									<div key={formatLocalDate(dayGroup?.date)} className="space-y-2">
										<div
											className={`border-b pb-2 dark:border-gray-700 ${dayGroup.day === "Eid Special Slots" ? "border-[#ed4264]/50 bg-[#ed4264]/5 -mx-3 rounded-t-lg px-3 pt-1" : "border-gray-200"}`}
										>
											<h3
												className={`text-sm font-semibold ${dayGroup.day === "Eid Special Slots" ? "text-[#ed4264]" : "text-gray-900 dark:text-gray-100"}`}
											>
												{dayGroup.day},{" "}
												{dayGroup?.date?.toLocaleDateString([], {
													month: "short",
													day: "numeric",
												})}
											</h3>
										</div>
										<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
											{dayGroup?.slots?.map((slot) => {
												const isEidDay = dayGroup.day === "Eid Special Slots";
												return (
													<button
														key={slot.id}
														onClick={() => handleSelectSlot(slot)}
														disabled={!slot.available}
														className={`rounded-md border px-3 py-2 text-xs shadow-sm transition-all duration-200 sm:text-sm ${
															slot.available
																? isEidDay
																	? "border-green-500 bg-green-50 text-[#47141e] hover:scale-105 hover:border-green-500 hover:shadow-md shadow-green-50"
																	: "border-gray-200 bg-gray-50 text-gray-800 hover:scale-105 hover:border-blue-300 hover:bg-blue-100 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-blue-900"
																: "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500"
														} ${
															selectedSlot?.id === slot.id
																? isEidDay
																	? "border-green-500 bg-green-80 ring-1 ring-green-80"
																	: "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/40"
																: ""
														}`}
													>
														<div className="flex flex-col items-center text-center">
															<span
																className={`font-medium leading-tight ${isEidDay && slot.available ? "text-[#ed4264]" : ""}`}
															>
																{slot.slot}
															</span>
															<span
																className={`mt-1 text-[10px] ${
																	slot.available
																		? isEidDay
																			? "font-bold text-[#ed4264]"
																			: "text-green-600 dark:text-green-400"
																		: "text-red-500"
																}`}
															>
																{slot.available
																	? isEidDay
																		? "Special Slot"
																		: "Available"
																	: "Not Available"}
															</span>
														</div>
													</button>
												);
											})}
										</div>
									</div>
								))}
							</div>
						</div>
					);
				})()}
		</div>
	);
};

export default DeliverySlotPicker;
