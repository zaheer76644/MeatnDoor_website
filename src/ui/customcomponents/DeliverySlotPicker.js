"use client";
import React, { useState, useEffect } from "react";

const DeliverySlotPicker = ({ selectedSlot, setSelectedSlot }) => {
	const [slots, setSlots] = useState([]);
	// const [selectedSlot, setSelectedSlot] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());

	const MORNING_SLOT = { start: 8.5, end: 11.5, label: "8:30AM - 11:30AM" };
	const EVENING_SLOT = { start: 16.5, end: 19.5, label: "4:30PM - 7:30PM" };
	const CUTOFF_HOUR = 16.5;

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

			// Today
			if (isMorningOrder) {
				const isMorningGone = currentHour >= MORNING_SLOT.start;
				newSlots.push({
					...createSlot(now, "Today", MORNING_SLOT),
					available: !isMorningGone,
				});
				newSlots.push(createSlot(now, "Today", EVENING_SLOT));
			} else {
				newSlots.push({
					...createSlot(now, "Today", MORNING_SLOT),
					available: false,
				});
				newSlots.push({
					...createSlot(now, "Today", EVENING_SLOT),
					available: false,
				});
			}

			// Next 2 days (total 6 slots)
			for (let i = 1; i <= 2; i++) {
				const nextDay = new Date(now);
				nextDay.setDate(now.getDate() + i);
				const dayName = nextDay.toLocaleDateString([], { weekday: "long" });
				newSlots.push(createSlot(nextDay, dayName, MORNING_SLOT));
				newSlots.push(createSlot(nextDay, dayName, EVENING_SLOT));
			}
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
				className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 shadow-sm transition-all hover:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
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
			{isOpen && (
				<div className="animate-fade-in absolute z-20 mt-2 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
					<div className="grid grid-cols-3 gap-3">
						{slots.map((slot) => (
							<button
								key={slot.id}
								onClick={() => handleSelectSlot(slot)}
								disabled={!slot.available}
								className={`rounded-md border px-2 py-2 text-xs shadow-sm transition-all sm:text-sm ${
									slot.available
										? "border-gray-200 bg-gray-50 text-gray-800 hover:bg-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-blue-900"
										: "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500"
								} ${
									selectedSlot?.id === slot.id
										? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/40"
										: ""
								}`}
							>
								<div className="flex flex-col items-start text-left">
									<span className="font-medium leading-tight">
										{slot.day},{" "}
										{slot.date.toLocaleDateString([], {
											month: "short",
											day: "numeric",
										})}
									</span>
									<span className="text-[11px] text-gray-500 dark:text-gray-400">{slot.slot}</span>
									<span
										className={`mt-1 text-[11px] ${
											slot.available ? "text-green-600 dark:text-green-400" : "text-red-500"
										}`}
									>
										{slot.available ? "Available" : "Not Available"}
									</span>
								</div>
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default DeliverySlotPicker;
