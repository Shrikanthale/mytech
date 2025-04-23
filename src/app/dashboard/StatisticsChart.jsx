"use client";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 450, sales: 430 },
  { month: "Feb", revenue: 500, sales: 480 },
  { month: "Mar", revenue: 450, sales: 500 },
  { month: "Apr", revenue: 520, sales: 520 },
  { month: "May", revenue: 500, sales: 480 },
  { month: "Jun", revenue: 540, sales: 500 },
  { month: "Jul", revenue: 580, sales: 520 },
  { month: "Aug", revenue: 600, sales: 550 },
  { month: "Sep", revenue: 650, sales: 500 },
  { month: "Oct", revenue: 470, sales: 530 },
  { month: "Nov", revenue: 520, sales: 450 },
  { month: "Dec", revenue: 560, sales: 580 },
];

const StatisticsChart = () => {
  const [tooltipData, setTooltipData] = useState(null);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 rounded-lg p-3 shadow-lg text-white">
          <p className="text-sm mb-1 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
            Revenue: ${payload[0].value}
          </p>
          <p className="text-sm flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
            Sales: ${payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm w-full mx-auto">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-700">Statistic</h2>
        <p className="text-sm text-gray-500">Revenue and Sales</p>
      </div>

      <div className="flex justify-end mb-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span className="text-sm text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
            <span className="text-sm text-gray-600">Sales</span>
          </div>
        </div>
      </div>

      <div className="w-full h-64 md:h-72" style={{ minHeight: "200px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            onMouseMove={(e) => {
              if (e && e.activePayload) {
                setTooltipData(e.activePayload);
              }
            }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              domain={[200, 700]}
              ticks={[0, 250, 400, 500, 600, 700]}
              tickFormatter={(value) => (value === 0 ? "0" : `$${value}`)}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                stroke: "#3b82f6",
                strokeWidth: 2,
                fill: "white",
              }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#f97316"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                stroke: "#f97316",
                strokeWidth: 2,
                fill: "white",
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {tooltipData && (
        <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
          <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg">
            <p className="text-xs mb-1">{tooltipData[0]?.payload?.month}</p>
            <div className="flex items-center gap-4">
              <p className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                <span>Revenue: ${tooltipData[0]?.value}</span>
              </p>
              <p className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                <span>Sales: ${tooltipData[1]?.value}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsChart;
