// ProjectStatsDashboard.jsx
import React from "react";
import cardoneicon from "../../assets/dashboardimgs/cardoneicon.svg";
import cardicontwo from "../../../src/assets/dashboardimgs/cardicontwo.svg";
import cardiconthree from "../../../src/assets/dashboardimgs/cardiconthree.svg";
import cardiconfour from "../../../src/assets/dashboardimgs/cardiconfour.svg";
import Image from "next/image";
const ProjectStatsDashboard = () => {
  return (
    <div className="py-1 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-5 flex justify-between items-start">
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">
              Total Project
            </h3>
            <p className="text-gray-800 text-3xl font-semibold mb-2">6,784</p>
            <div className="flex items-center">
              <span className="text-green-500 text-xs font-medium mr-1">
                10%
              </span>
              <svg
                className="w-3 h-3 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                ></path>
              </svg>
              <span className="text-gray-400 text-xs ml-1">+$150 today</span>
            </div>
          </div>
          <Image src={cardoneicon} alt="" height={"auto"} width={"auto"} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 flex justify-between items-start">
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">
              In Progress
            </h3>
            <p className="text-gray-800 text-3xl font-semibold mb-2">1,920</p>
            <div className="flex items-center">
              <span className="text-green-500 text-xs font-medium mr-1">
                30%
              </span>
              <svg
                className="w-3 h-3 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                ></path>
              </svg>
              <span className="text-gray-400 text-xs ml-1">+$150 today</span>
            </div>
          </div>
          <Image src={cardicontwo} alt="" height={"auto"} width={"auto"} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 flex justify-between items-start">
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Finished</h3>
            <p className="text-gray-800 text-3xl font-semibold mb-2">4,412</p>
            <div className="flex items-center">
              <span className="text-green-500 text-xs font-medium mr-1">
                10%
              </span>
              <svg
                className="w-3 h-3 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                ></path>
              </svg>
              <span className="text-gray-400 text-xs ml-1">+$150 today</span>
            </div>
          </div>
          <Image src={cardiconthree} alt="" height={"auto"} width={"auto"} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 flex justify-between items-start">
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">
              Unfinished
            </h3>
            <p className="text-gray-800 text-3xl font-semibold mb-2">329</p>
            <div className="flex items-center">
              <span className="text-green-500 text-xs font-medium mr-1">
                10%
              </span>
              <svg
                className="w-3 h-3 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                ></path>
              </svg>
              <span className="text-gray-400 text-xs ml-1">+$150 today</span>
            </div>
          </div>
          <Image src={cardiconfour} alt="" height={"auto"} width={"auto"} />
        </div>
      </div>
    </div>
  );
};

export default ProjectStatsDashboard;
