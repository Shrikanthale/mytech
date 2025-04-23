"use client";

import Map from "../../assets/dashboardimgs/Map.svg";
import Image from "next/image";
import threedots from "../../assets/dashboardimgs/threedots.svg";
const CustomerGrowth = () => {
  const customerData = [
    { country: "USA", customers: 1240, growthPercentage: 80, color: "#1ABC9C" },
    {
      country: "Japan",
      customers: 1240,
      growthPercentage: 60,
      color: "#E67E22",
    },
    {
      country: "France",
      customers: 1240,
      growthPercentage: 49,
      color: "#F1C40F",
    },
    {
      country: "Germany",
      customers: 1240,
      growthPercentage: 100,
      color: "#3498DB",
    },
    {
      country: "South Korea",
      customers: 1240,
      growthPercentage: 50,
      color: "#E74C3C",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-5 w-full ">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Customer Growth
          </h2>
          <p className="text-xs text-gray-500">Based on Country</p>
        </div>
        <Image src={threedots} alt="" height={"auto"} width={"auto"} />
      </div>
      <div className="relative rounded-md overflow-hidden mb-4 w-full">
        <div className="w-full aspect-[16/9] flex items-center justify-center">
          <Image src={Map} alt="Map" className="w-full h-auto object-contain" />
        </div>
      </div>
      <div className="max-h-68 overflow-y-auto pr-5 space-y-5 custom-scroll">
        {customerData.map((item) => (
          <div key={item.country} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div className="flex-grow">
              <div className="flex justify-between text-sm font-medium text-gray-800">
                <span>{item.country}</span>
                <span>{item.growthPercentage}%</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">
                {item.customers.toLocaleString()} Customers
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${item.growthPercentage}%`,
                    backgroundColor: item.color,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: #2086bf;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default CustomerGrowth;
