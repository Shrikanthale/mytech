"use client";
import React, { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronUp } from "lucide-react";

const FilterComponent = ({ onClose }) => {
  const DEFAULT_MIN = 200;
  const DEFAULT_MAX = 8000;

  const [minValue, setMinValue] = useState(DEFAULT_MIN);
  const [maxValue, setMaxValue] = useState(DEFAULT_MAX);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("(<) Less Than");
  const [dragging, setDragging] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [checked, setChecked] = useState({
    lowToHigh: false,
    highToLow: false,
  });

  const sliderRef = useRef(null);
  const dropdownRef = useRef(null);

  const comparisonOptions = [
    "(=) Equals",
    "(<) Less Than",
    "(>) Greater Than",
    "(<=) Less Than Equal",
    "(>=) Greater Than Equal",
  ];

  const getPercentage = (value) => {
    return ((value - DEFAULT_MIN) / (DEFAULT_MAX - DEFAULT_MIN)) * 100;
  };

  const minPos = getPercentage(minValue);
  const maxPos = getPercentage(maxValue);

  const handleMove = (clientX) => {
    if (!sliderRef.current || !dragging) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.min(
      Math.max(0, (clientX - rect.left) / rect.width),
      1
    );
    const rawValue = DEFAULT_MIN + percent * (DEFAULT_MAX - DEFAULT_MIN);
    const value = Math.round(rawValue);

    if (dragging === "min") {
      if (value <= maxValue - 100) {
        setMinValue(value);
      }
    } else if (dragging === "max") {
      if (value >= minValue + 100) {
        setMaxValue(value);
      }
    }
  };

  const handleMouseDown = (handle) => {
    setDragging(handle);
  };

  useEffect(() => {
    const handleMouseUp = () => setDragging(null);
    const handleMouseMove = (e) => handleMove(e.clientX);

    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClearAll = () => {
    setMinValue(DEFAULT_MIN);
    setMaxValue(DEFAULT_MAX);
    setSelectedOption("(<) Less Than");
    setSearchTerm("");
    setChecked({
      lowToHigh: false,
      highToLow: false,
    });
  };

  return (
    <div className="w-64 border border-gray-200 rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <div className="text-lg font-medium text-gray-800">Filter</div>
        <ChevronUp
          size={20}
          className="text-gray-600 cursor-pointer"
          onClick={onClose}
        />
      </div>
      <div className="bg-blue-50 py-2 px-4 flex justify-end border-b border-gray-200">
        <button
          className="text-blue-500 text-sm cursor-pointer"
          onClick={handleClearAll}
        >
          Clear all
        </button>
      </div>

      <div className="p-4 space-y-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-[#2086BF] rounded text-gray-700"
        />
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="lowToHigh"
              checked={checked.lowToHigh}
              onChange={(e) =>
                setChecked((prev) => ({ ...prev, lowToHigh: e.target.checked }))
              }
              className="w-4 h-4 border-gray-300 mr-2"
            />
            <label htmlFor="lowToHigh" className="text-sm text-gray-700">
              Low to high
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="highToLow"
              checked={checked.highToLow}
              onChange={(e) =>
                setChecked((prev) => ({ ...prev, highToLow: e.target.checked }))
              }
              className="w-4 h-4 border-gray-300 mr-2"
            />
            <label htmlFor="highToLow" className="text-sm text-gray-700">
              High to low
            </label>
          </div>
        </div>
        <div className="flex justify-between py-1">
          <div className="text-sm text-[#344054] bg-gray-100 px-2 py-1 rounded-md border border-gray-300">
            {minValue}
          </div>
          <div className="text-sm text-[#344054] bg-gray-100 px-2 py-1 rounded-md border border-gray-300">
            {maxValue}
          </div>
        </div>
        <div className="relative w-full h-6 flex items-center" ref={sliderRef}>
          <div className="absolute w-full h-1 bg-gray-300 rounded-full"></div>
          <div
            className="absolute h-1 bg-blue-500 rounded-full"
            style={{ width: `${maxPos - minPos}%`, left: `${minPos}%` }}
          ></div>
          <div
            className="absolute w-6 h-6 bg-white rounded-full shadow border-2 border-blue-500 cursor-pointer z-10"
            style={{ left: `${minPos}%`, marginLeft: "-12px" }}
            onMouseDown={() => handleMouseDown("min")}
          ></div>
          <div
            className="absolute w-6 h-6 bg-white rounded-full shadow border-2 border-blue-500 cursor-pointer z-10"
            style={{ left: `${maxPos}%`, marginLeft: "-12px" }}
            onMouseDown={() => handleMouseDown("max")}
          ></div>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={minValue}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!isNaN(value) && value >= DEFAULT_MIN && value < maxValue) {
                setMinValue(value);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700"
          />
          <input
            type="text"
            value={maxValue}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!isNaN(value) && value <= DEFAULT_MAX && value > minValue) {
                setMaxValue(value);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700"
          />
        </div>
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex justify-between items-center w-full px-3 py-2 border border-[#2086BF] rounded text-gray-700 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span>{selectedOption}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {showDropdown && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
              {comparisonOptions.map((option, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  onClick={() => {
                    setSelectedOption(option);
                    setShowDropdown(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
