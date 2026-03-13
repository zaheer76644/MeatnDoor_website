"use client";
import React, { useState, useEffect } from "react";

const DeliverySlotPicker = ({ selectedSlot, setSelectedSlot }) => {
	const [slots, setSlots] = useState([]);
	// const [selectedSlot, setSelectedSlot] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());

	// const MORNING_SLOT = { start: 8.5, end: 11.5, label: "8:30AM - 11:30AM" };
	// const EVENING_SLOT = { start: 16.5, end: 19.5, label: "4:30PM - 7:30PM" };
	const MORNING_SLOT1 = { start: 8.5, end: 10.5, label: "8:30AM - 10:30AM" };
	const MORNING_SLOT2 = { start: 10.5, end: 12.5, label: "10:30AM - 12:30PM" };
	const EVENING_SLOT1 = { start: 16.5, end: 18.5, label: "4:30PM - 6:30PM" };
	const EVENING_SLOT2 = { start: 18.5, end: 20.5, label: "6:30PM - 8:30PM" };
	const EID_SPECIAL_SLOT = { start: 20.5, end: 23.5, label: "8:30PM - 11:30PM" };
	const CUTOFF_HOUR = 18.5;

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 60000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		const generateSlots = () => {
			const newSlots = [];
			const now = new Date();
			const currentHour = now.getHours() + now.getMinutes() / 60;
			const isMorningOrder = currentHour < CUTOFF_HOUR;

			// Special Eid Dates
			const eidDates = [
				{ date: "2026-03-19", label: "Eid Special Slots" },
				{ date: "2026-03-20", label: "Eid Special Slots" }
			];

			// Today
			if (isMorningOrder) {
				const isMorningGone = currentHour >= (MORNING_SLOT1.start - 0.5);
				const isMorningGone2 = currentHour >= (MORNING_SLOT2.start);
				const isEveningGone = currentHour >= (EVENING_SLOT1.start - 0.5);
				const isEveningGone2 = currentHour >= (EVENING_SLOT2.start);
				
				const todayStr = now.toISOString().split("T")[0];
				const eidToday = eidDates.find(d => d.date === todayStr);
				const dayLabel = eidToday ? eidToday.label : "Today";

				newSlots.push({
					...createSlot(now, dayLabel, MORNING_SLOT1),
					available: !isMorningGone,
				});
				newSlots.push({
					...createSlot(now, dayLabel, MORNING_SLOT2),
					available: !isMorningGone2,
				});
				newSlots.push({
					...createSlot(now, dayLabel, EVENING_SLOT1),
					available: !isEveningGone,
				});
				newSlots.push({
					...createSlot(now, dayLabel, EVENING_SLOT2),
					available: !isEveningGone2,
				});

				if (eidToday) {
					const isSpecialGone = currentHour >= (EID_SPECIAL_SLOT.start - 0.5);
					newSlots.push({
						...createSlot(now, dayLabel, EID_SPECIAL_SLOT),
						available: !isSpecialGone,
					});
				}
			} else {
				const todayStr = now.toISOString().split("T")[0];
				const eidToday = eidDates.find(d => d.date === todayStr);
				const dayLabel = eidToday ? eidToday.label : "Today";

				newSlots.push({ ...createSlot(now, dayLabel, MORNING_SLOT1), available: false });
				newSlots.push({ ...createSlot(now, dayLabel, MORNING_SLOT2), available: false });
				newSlots.push({ ...createSlot(now, dayLabel, EVENING_SLOT1), available: false });
				newSlots.push({ ...createSlot(now, dayLabel, EVENING_SLOT2), available: false });

				if (eidToday) {
					const isSpecialGone = currentHour >= (EID_SPECIAL_SLOT.start - 0.5);
					newSlots.push({
						...createSlot(now, dayLabel, EID_SPECIAL_SLOT),
						available: !isSpecialGone,
					});
				}
			}

			// Next 2 days
			for (let i = 1; i <= 2; i++) {
				const nextDay = new Date(now);
				nextDay.setDate(now.getDate() + i);
				const nextDayStr = nextDay.toISOString().split("T")[0];
				const eidNextDay = eidDates.find(d => d.date === nextDayStr);
				
				const dayName = eidNextDay ? eidNextDay.label : nextDay.toLocaleDateString([], { weekday: "long" });
				
				newSlots.push(createSlot(nextDay, dayName, MORNING_SLOT1));
				newSlots.push(createSlot(nextDay, dayName, MORNING_SLOT2));
				newSlots.push(createSlot(nextDay, dayName, EVENING_SLOT1));
				newSlots.push(createSlot(nextDay, dayName, EVENING_SLOT2));
				
				if (eidNextDay) {
					newSlots.push(createSlot(nextDay, dayName, EID_SPECIAL_SLOT));
				}
			}

			// Ensure fixed Eid dates are always visible if they are in the future but not in the "next 2 days" range
			eidDates.forEach(eid => {
				const eidDateObj = new Date(eid.date);
				// If Eid date is beyond Today + 2 days and hasn't passed yet
				const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				const horizon = new Date(todayStart);
				horizon.setDate(todayStart.getDate() + 2);

				if (eidDateObj > horizon) {
					newSlots.push(createSlot(eidDateObj, eid.label, MORNING_SLOT1));
					newSlots.push(createSlot(eidDateObj, eid.label, MORNING_SLOT2));
					newSlots.push(createSlot(eidDateObj, eid.label, EVENING_SLOT1));
					newSlots.push(createSlot(eidDateObj, eid.label, EVENING_SLOT2));
					newSlots.push(createSlot(eidDateObj, eid.label, EID_SPECIAL_SLOT));
				}
			});

			setSlots(newSlots);
		};

		generateSlots();
	}, [currentTime]);

	const createSlot = (date, dayLabel, { start, end, label }) => ({
		id: date.toISOString().split("T")[0] + "_" + start + "_" + end,
		date,
		day: dayLabel,
		slot: label,
		available: true,
	});

	const handleSelectSlot = (slot) => {
		if (!slot.available) return;
		setSelectedSlot(slot);
		setIsOpen(false);
	};

	return (
		<div className="relative w-full max-w-sm">
			{/* Dropdown Trigger */}
			<button
				className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 transition-all hover:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
				onClick={() => setIsOpen(!isOpen)}
			>
				{selectedSlot ? (
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

			{/* Dropdown Menu */}
			{isOpen && (() => {
				// Group slots by day
				const slotsByDay = slots?.reduce((acc, slot) => {
					const dayKey = slot?.date?.toISOString().split("T")[0];
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
								<div key={dayGroup?.date?.toISOString()} className="space-y-2">
									{/* Day Header */}
									<div className={`border-b pb-2 dark:border-gray-700 ${dayGroup.day === "Eid Special Slots" ? "border-[#ed4264]/50 bg-[#ed4264]/5 -mx-3 px-3 rounded-t-lg pt-1" : "border-gray-200"}`}>
										<h3 className={`text-sm font-semibold ${dayGroup.day === "Eid Special Slots" ? "text-[#ed4264]" : "text-gray-900 dark:text-gray-100"}`}>
											{dayGroup.day},{" "}
											{dayGroup?.date?.toLocaleDateString([], {
												month: "short",
												day: "numeric",
											})}
										</h3>
									</div>
									{/* Slots for this day */}
									<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
										{dayGroup?.slots?.map((slot) => {
											const isEidSlot = slot.slot === EID_SPECIAL_SLOT.label;
											return (
												<button
													key={slot.id}
													onClick={() => handleSelectSlot(slot)}
													disabled={!slot.available}
													className={`rounded-md border px-3 py-2 text-xs shadow-sm transition-all duration-200 sm:text-sm ${
														slot.available
															? isEidSlot 
																? "border-green-500 bg-green-50 text-[#47141e] hover:scale-105 hover:shadow-md shadow-green-50"
																: "border-gray-200 bg-gray-50 text-gray-800 hover:scale-105 hover:bg-blue-100 hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-blue-900"
															: "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500"
													} ${
														selectedSlot?.id === slot.id
															? isEidSlot
																? "border-green-500 bg-green-80 ring-1 ring-green-80"
																: "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/40"
															: ""
													}`}
												>
													<div className="flex flex-col items-center text-center">
														<span className={`font-medium leading-tight ${isEidSlot && slot.available ? "text-[#ed4264]" : ""}`}>{slot.slot}</span>
														<span
															className={`mt-1 text-[10px] ${
																slot.available 
																	? isEidSlot ? "text-[#ed4264] font-bold" : "text-green-600 dark:text-green-400" 
																	: "text-red-500"
															}`}
														>
															{slot.available ? isEidSlot ? "Special Slot" : "Available" : "Not Available"}
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
