import ProjectStatsDashboard from "./ProjectStatsDashboard.jsx";
import RevenueTargetCard from "./RevenueTargetCard .jsx";
import StatisticsChart from "./StatisticsChart.jsx";
import RecentOrdersDashboard from "./RecentOrders.jsx";
import CustomerGrowth from "./CustomerGrowth.jsx";
import SalesDashboard from "./SalesDashboard.jsx";
import TopNavbar from "../../components/TopNavbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 px-5 py-2 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1 md:col-span-3">
        <TopNavbar />
      </div>
      <div className="col-span-1 md:col-span-3">
        <ProjectStatsDashboard />
      </div>

      <div className="col-span-1">
        <RevenueTargetCard />
      </div>
      <div className="col-span-1 md:col-span-2">
        <StatisticsChart />
      </div>
      <div className="col-span-1 md:col-span-3">
        <SalesDashboard />
      </div>

      <div className="col-span-1 lg:col-span-2  md:col-span-3">
        <RecentOrdersDashboard />
      </div>
      <div className="col-span-1 lg:col-span-1  md:col-span-3">
        <CustomerGrowth />
      </div>
    </main>
  );
}
