"use client";
import React, { useState } from "react";
import { EyeOff, ChevronDown, GripVertical } from "lucide-react";

const initialColumns = [
  "Payment Type",
  "Bank Name",
  "Discount",
  "Delivery Status",
  "Delivery Date",
];

const EditColumns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [columns, setColumns] = useState(initialColumns);
  const [hiddenColumns, setHiddenColumns] = useState(initialColumns);
  const [expanded, setExpanded] = useState(true);

  const handleToggle = (col) => {
    setHiddenColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleReset = () => {
    setHiddenColumns(initialColumns);
    setSearchTerm("");
  };

  const filteredColumns = columns.filter((col) =>
    col.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-72 border rounded-lg bg-white shadow text-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b font-medium text-gray-800">
        <span>Edit Columns</span>
        <ChevronDown
          className={`w-4 h-4 cursor-pointer transform transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
          onClick={() => setExpanded(!expanded)}
        />
      </div>

      {expanded && (
        <>
          <div className="bg-blue-50 px-4 py-1">
            <div
              className="text-blue-600 text-sm mb-1 cursor-pointer text-right"
              onClick={handleReset}
            >
              Reset Columns
            </div>
          </div>
          <div className=" px-4 py-1 ">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Find an Columns"
              className="w-full px-3 py-2 border border-[#2086BF] rounded text-gray-700"
            />
          </div>
          <div className="py-2">
            {filteredColumns.map((col) => (
              <div
                key={col}
                className="flex items-center justify-between px-4 py-1.5 text-gray-700 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span>{col}</span>
                </div>
                <EyeOff
                  className="w-4 h-4 text-gray-400 cursor-pointer"
                  onClick={() => handleToggle(col)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EditColumns;
