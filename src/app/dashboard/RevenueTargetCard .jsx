"use client";

import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import Image from "next/image";
import "react-circular-progressbar/dist/styles.css";
import { ArrowDown, ArrowUp } from "lucide-react";
import threedots from "../../assets/dashboardimgs/threedots.svg";

const RevenueTargetCard = () => {
  const percentage = 75.55;

  return (
    <div className="w-full py-6 px-4 md:px-6 rounded-2xl shadow-md bg-white h-full">
      <div className="flex justify-between">
        <div>
          <div className="text-sm font-medium text-[#1D1F2C]">Target</div>
          <div className="text-xs text-[#777980] mb-4">Revenue Target</div>
        </div>
        <Image src={threedots} alt="" width={"auto"} height={"auto"} />
      </div>

      <div className="w-full max-w-[180px] md:max-w-[150px] lg:max-w-[200px] mx-auto mb-2">
        <CircularProgressbarWithChildren
          value={percentage}
          maxValue={100}
          circleRatio={0.5}
          styles={buildStyles({
            rotation: 0.75,
            strokeLinecap: "round",
            trailColor: "#e5e7eb",
            pathColor: "#2086BF",
          })}
        >
          <div className="flex flex-col items-center -mt-4">
            <span
              className="text-2xl font-semibold"
              style={{ color: "#1D1F2C" }}
            >
              {percentage}%
            </span>

            <span className="text-xs mt-1 px-2 py-0.5 bg-green-100 text-green-600 rounded-md">
              +10%
            </span>
          </div>
        </CircularProgressbarWithChildren>
      </div>

      <p className="text-center text-[14px] font-normal text-gray-500 my-3">
        You succeed earn <span className="font-semibold text-black">$240</span>{" "}
        today, it's higher than yesterday
      </p>

      <div className="flex justify-between text-sm font-medium text-gray-600 px-2">
        <div className="flex flex-col items-center">
          <span className="ml-0.5 text-xs font-normal text-gray-500">
            Target
          </span>
          <div className="flex items-center text-red-500">
            <span className="text-[#1D1F2C] font-semibold">$20k</span>
            <ArrowDown className="w-4 h-4 ml-2" color="#EB3D4D" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="ml-0.5 text-xs">Revenue</span>
          <div className="flex items-center">
            <span className="text-[#1D1F2C] font-semibold">$16k</span>
            <ArrowUp className="w-4 h-4 ml-2" style={{ color: "#22CAAD" }} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="ml-0.5 text-xs">Today</span>
          <div className="flex items-center">
            <span className="text-[#1D1F2C] font-semibold">$1.5k</span>
            <ArrowUp className="w-4 h-4 ml-2" style={{ color: "#22CAAD" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueTargetCard;
