import React from "react";
import threedots from "../../assets/dashboardimgs/threedots.svg";
import Image from "next/image";
import phone from "../../assets/dashboardimgs/phone.svg";
import tablet from "../../assets/dashboardimgs/tablet.svg";
import earphone from "../../assets/dashboardimgs/earphone.svg";
import laptop from "../../assets/dashboardimgs/laptop.svg";
import mouse from "../../assets/dashboardimgs/mouse.svg";
import usb from "../../assets/dashboardimgs/usb.svg";
import camera from "../../assets/dashboardimgs/camera.svg";
const MultiSegmentCircularProgress = ({ segments }) => {
  const radius = 50;
  const strokeWidth = 5;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const totalValue = segments.reduce((sum, segment) => sum + segment.value, 0);
  let accumulatedOffset = 0;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg height="100%" width="100%" viewBox="0 0 100 100">
        <circle
          stroke="#e6f4ff"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {segments.map((segment, index) => {
          const segmentPercentage = segment.value / totalValue;
          const segmentLength = segmentPercentage * circumference;
          const dashOffset = circumference - accumulatedOffset;
          accumulatedOffset += segmentLength;
          return (
            <circle
              key={index}
              stroke={segment.color}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={`${segmentLength} ${
                circumference - segmentLength
              }`}
              strokeDashoffset={dashOffset}
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          );
        })}
      </svg>
      <div className="flex flex-col items-center absolute mt-4">
        <span className="text-2xl font-semibold" style={{ color: "#1D1F2C" }}>
          $ 75k
        </span>

        <span className="text-xs mt-1 px-2 py-0.5 bg-green-100 text-green-600 rounded-md">
          +10%
        </span>
      </div>
    </div>
  );
};

export default function SalesDashboard() {
  const salesData = {
    total: "$75.5k",
    growth: "+10%",
    sources: [
      { name: "Official Website", value: 25000, color: "#2086BF" },
      { name: "Offline Store", value: 20000, color: "#2BB2FE" },
      { name: "Reseller", value: 15500, color: "skyblue" },
      { name: "Amazon Store", value: 15000, color: "#D5F0FF" },
    ],
    topProducts: [
      { name: "Logic+ Wireless Mouse", category: "Mouse", value: "$1,240" },
      {
        name: "PS Wireless Controller",
        category: "Controllers",
        value: "$1,189",
      },
      {
        name: "Xim Mechanical Keyboard",
        category: "Smartphone",
        value: "$1,100",
      },
      { name: "Audio Tech Earphone", category: "Earphone", value: "$908" },
      { name: "Sams S14 Pro", category: "Tablet", value: "$900" },
      { name: "Sams A13 5G", category: "Smartphone", value: "$870" },
      { name: "Jound P01 TWS", category: "Earphone", value: "$870" },
    ],
    topCategories: [
      { name: "Smartphone", value: "1,509", growth: "+12%" },
      { name: "Tablet", value: "1,460", growth: "-5%" },
      { name: "Earphone", value: "1,229", growth: "0%" },
      { name: "Laptop & PC", value: "982", growth: "+19%" },
      { name: "Mouse", value: "791", growth: "+25%" },
      { name: "Harddisk & USB Drive", value: "679", growth: "+31%" },
      { name: "Camera", value: "679", growth: "+11%" },
    ],
  };
  const getGrowthStyle = (growth) => {
    if (growth === "0%") return "text-[#1A9882] bg-[#E9FAF7] p-1 rounded-md";
    if (growth === "5%") return "text-[#EB3D4D] bg-[#FEECEE] p-1 rounded-md";
    if (growth === "+12%") return "text-[#2BB2FE] bg-[#EAF8FF] p-1 rounded-md";
    if (growth === "-5%") return "text-[#EB3D4D] bg-[#FEECEE] p-1 rounded-md";
    if (growth === "+10%") return "text-[#2BB2FE] bg-[#EAF8FF] p-1 rounded-md";
    if (growth === "+25%") return "text-[#2BB2FE] bg-[#EAF8FF] p-1 rounded-md";
    if (growth === "+31%") return "text-[#F9C80E] bg-[#FFFAE7] p-1 rounded-md";
    if (growth === "+19%") return "text-[#EB3D4D] bg-[#FEECEE] p-1 rounded-md";
    if (growth === "+11%") return "text-[#030304] bg-[#E9E9EA] p-1 rounded-md";
    return "text-red-500 bg-red-50";
  };

  const getCategoryIcon = (index) => {
    switch (index) {
      case 0:
        return <Image src={phone} alt="" height={"auto"} width={"auto"} />;
      case 1:
        return <Image src={tablet} alt="" height={"auto"} width={"auto"} />;
      case 2:
        return <Image src={earphone} alt="" height={"auto"} width={"auto"} />;
      case 3:
        return <Image src={laptop} alt="" height={"auto"} width={"auto"} />;
      case 4:
        return <Image src={mouse} alt="" height={"auto"} width={"auto"} />;
      case 5:
        return <Image src={usb} alt="" height={"auto"} width={"auto"} />;
      case 6:
        return <Image src={camera} alt="" height={"auto"} width={"auto"} />;
      default:
        return null;
    }
  };
  const segments = salesData.sources.map((source) => ({
    value: source.value,
    color: source.color,
    children: (
      <div className="text-center">
        <div className="text-2xl font-bold">{salesData.total}</div>
        <div className="text-green-500 text-sm">{salesData.growth}</div>
      </div>
    ),
  }));

  return (
    <div className="flex flex-col md:flex-row w-full bg-gray-100 p-2 md:p-0 gap-6 md:gap-6">
      <div className="bg-white rounded-lg shadow p-3 md:p-4 flex-1 mb-2 md:mb-0">
        <div className="flex justify-between items-center mb-2 md:mb-4">
          <h2 className="font-bold text-gray-800 text-sm md:text-base">
            Sales Source
          </h2>
          <Image src={threedots} alt="" height={"auto"} width={"auto"} />
        </div>

        <div className="w-28 h-28 md:w-40 md:h-40 mx-auto mb-2 md:mb-4">
          <MultiSegmentCircularProgress segments={segments} />
        </div>

        <div className="space-y-1 md:space-y-4 mt-3 md:mt-6">
          {salesData.sources.map((source, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: source.color }}
                ></div>
                <span className="text-xs md:text-sm text-[#4A4C56]">
                  {source.name}
                </span>
              </div>
              <span className="text-xs md:text-sm font-medium text-[#1D1F2C]">
                ${(source.value / 1000).toFixed(1)}k
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-3 md:p-4 flex-1 mb-2 md:mb-0">
        <div className="flex justify-between items-center mb-2 md:mb-4">
          <div>
            <h2 className="font-bold text-gray-800 text-sm md:text-base text[#777980]">
              Top Product
            </h2>
            <p className="text-xs text-gray-500 text-[#777980]">
              Top Product in This Month
            </p>
          </div>
          <Image src={threedots} alt="" height={"auto"} width={"auto"} />
        </div>

        <div className="space-y-2 md:space-y-3 mt-2">
          {salesData.topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded mr-2 md:mr-3"></div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-[#1D1F2C]">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 text-[#667085]">
                    {product.category}
                  </p>
                </div>
              </div>
              <span className="text-xs md:text-sm font-medium text-[#667085]">
                {product.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-3 md:p-4 flex-1">
        <div className="flex justify-between items-center mb-2 md:mb-4">
          <div>
            <h2 className="font-bold text-gray-800 text-sm md:text-base">
              Top Category
            </h2>
            <p className="text-xs text-gray-500">Top Category in This Month</p>
          </div>
          <Image src={threedots} alt="" height={"auto"} width={"auto"} />
        </div>

        <div className="space-y-2 md:space-y-4 mt-2">
          {salesData.topCategories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded mr-2 md:mr-3 flex items-center justify-center">
                  {getCategoryIcon(index)}
                </div>
                <span className="text-xs md:text-sm text-[#1D1F2C]">
                  {category.name}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs md:text-sm font-medium mr-2 text-[#1D1F2C]">
                  {category.value}
                </span>
                <span className={`text-xs ${getGrowthStyle(category.growth)}`}>
                  {category.growth}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
