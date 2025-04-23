"use client";
import React from "react";

import { useState } from "react";

export default function DatePicker({ onClose }) {
  const [selectedStartDate, setSelectedStartDate] = useState(
    new Date(2022, 0, 6)
  );
  const [selectedEndDate, setSelectedEndDate] = useState(new Date(2022, 0, 13));
  const [currentMonthStart, setCurrentMonthStart] = useState(
    new Date(2022, 0, 1)
  );
  const [currentMonthEnd, setCurrentMonthEnd] = useState(new Date(2022, 1, 1));
  const [activeTab, setActiveTab] = useState("This week");
  const timePeriods = [
    "Today",
    "Yesterday",
    "This week",
    "Last week",
    "This month",
    "Last month",
    "This year",
    "Last year",
    "All time",
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const firstDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const days = [];
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      days.push({
        date: new Date(prevYear, prevMonth, day),
        isCurrentMonth: false,
        isSelected: isDateInRange(new Date(prevYear, prevMonth, day)),
      });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
        isSelected: isDateInRange(new Date(year, month, i)),
      });
    }
    const daysNeeded = 42 - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let i = 1; i <= daysNeeded; i++) {
      days.push({
        date: new Date(nextYear, nextMonth, i),
        isCurrentMonth: false,
        isSelected: isDateInRange(new Date(nextYear, nextMonth, i)),
      });
    }

    return days;
  };
  const isDateInRange = (date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  const goToPrevMonth = (isStartMonth) => {
    if (isStartMonth) {
      setCurrentMonthStart(
        new Date(
          currentMonthStart.getFullYear(),
          currentMonthStart.getMonth() - 1,
          1
        )
      );
    } else {
      setCurrentMonthEnd(
        new Date(
          currentMonthEnd.getFullYear(),
          currentMonthEnd.getMonth() - 1,
          1
        )
      );
    }
  };
  const goToNextMonth = (isStartMonth) => {
    if (isStartMonth) {
      setCurrentMonthStart(
        new Date(
          currentMonthStart.getFullYear(),
          currentMonthStart.getMonth() + 1,
          1
        )
      );
    } else {
      setCurrentMonthEnd(
        new Date(
          currentMonthEnd.getFullYear(),
          currentMonthEnd.getMonth() + 1,
          1
        )
      );
    }
  };
  const formatDateRange = () => {
    const formatDate = (date) => {
      if (!date) return "";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };
    return `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`;
  };
  const handleDateClick = (date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      if (date < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
      } else {
        setSelectedEndDate(date);
      }
    }
  };
  const selectTimePeriod = (period) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

    let start, end;

    switch (period) {
      case "Today":
        start = end = new Date(today);
        break;
      case "Yesterday":
        start = end = new Date(today);
        start.setDate(today.getDate() - 1);
        end.setDate(today.getDate() - 1);
        break;
      case "This week":
        start = new Date(startOfWeek);
        end = new Date(startOfWeek);
        end.setDate(startOfWeek.getDate() + 6);
        break;
      case "Last week":
        start = new Date(startOfWeek);
        start.setDate(startOfWeek.getDate() - 7);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      case "This month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "Last month":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "This year":
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      case "Last year":
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
      case "All time":
        start = new Date(2010, 0, 1);
        end = new Date(today);
        break;
      default:
        start = new Date(2022, 0, 6);
        end = new Date(2022, 0, 13);
    }

    setSelectedStartDate(start);
    setSelectedEndDate(end);
    setActiveTab(period);
  };
  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sat", "Su"];
  const getMonthName = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };
  const daysStart = getDaysInMonth(currentMonthStart);
  const daysEnd = getDaysInMonth(currentMonthEnd);

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg p-4 max-w-4xl mx-auto">
      <div className="flex">
        <div className="w-32 mr-4 border-r pr-2">
          {timePeriods.map((period) => (
            <div
              key={period}
              className={`py-2 px-4 cursor-pointer text-sm rounded-md text-[#344054] ${
                activeTab === period
                  ? "bg-blue-100 text-[#16597F]"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => selectTimePeriod(period)}
            >
              {period}
            </div>
          ))}
        </div>
        <div className="flex-1 flex">
          <div className="w-1/2 pr-4">
            <div className="flex items-center justify-between mb-4">
              <button
                className="p-1 text-sm  text-[#344054] rounded-full hover:bg-[#EAF8FF]"
                onClick={() => goToPrevMonth(true)}
              >
                &lt;
              </button>
              <div className=" text-sm  text-[#344054] ">
                {getMonthName(currentMonthStart)}
              </div>
              <button
                className="p-1 text-sm  text-[#344054] rounded-full hover:bg-[#EAF8FF]"
                onClick={() => goToNextMonth(true)}
              >
                &gt;
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {weekdays.map((day) => (
                <div key={day} className="text-xs text-center font-medium py-1">
                  {day}
                </div>
              ))}
              {daysStart.map((day, index) => (
                <div
                  key={index}
                  onClick={() => handleDateClick(day.date)}
                  className={`text-xs h-8 w-8 flex items-center justify-center rounded-full cursor-pointer
                    ${!day.isCurrentMonth ? "text-gray-800" : ""}
                    ${
                      day.isSelected
                        ? "bg-[#2086BF] text-white"
                        : "hover:bg-[#EAF8FF]"
                    }
                    ${isToday(day.date) ? "border border-[#2086BF]" : ""}
                  `}
                >
                  {day.date.getDate()}
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/2 pl-4">
            <div className="flex items-center justify-between mb-4">
              <button
                className="p-1 text-sm  text-[#344054] rounded-full hover:bg-[#EAF8FF]"
                onClick={() => goToPrevMonth(false)}
              >
                &lt;
              </button>
              <div className="text-sm  text-[#344054] ">
                {getMonthName(currentMonthEnd)}
              </div>
              <button
                className="p-1 text-sm  text-[#344054] rounded-full hover:bg-[#EAF8FF]"
                onClick={() => goToNextMonth(false)}
              >
                &gt;
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {weekdays.map((day) => (
                <div key={day} className="text-xs text-center font-medium py-1">
                  {day}
                </div>
              ))}
              {daysEnd.map((day, index) => (
                <div
                  key={index}
                  onClick={() => handleDateClick(day.date)}
                  className={`text-xs h-8 w-8 flex items-center justify-center rounded-full cursor-pointer
                    ${!day.isCurrentMonth ? "text-gray-800" : ""}
                    ${
                      day.isSelected
                        ? "bg-[#2086BF] text-white"
                        : "hover:bg[#EAF8FF]"
                    }
                    ${isToday(day.date) ? "border border-[#2086BF]" : ""}
                  `}
                >
                  {day.date.getDate()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <div className="px-4 py-2 text-sm border text-black rounded-md hover:bg-gray-50">
          {formatDateRange()}
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm border text-black rounded-md hover:bg-gray-50">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm bg-[#2086BF] text-white rounded-md hover:bg-blue-600">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
