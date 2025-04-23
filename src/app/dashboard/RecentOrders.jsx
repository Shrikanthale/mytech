"use client";
import { useState, useEffect } from "react";
import { Eye, Trash2, ChevronLeft, ChevronRight, SlidersHorizontal, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RecentOrdersDashboard() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  const [orders, setOrders] = useState([
    { id: 1, product: "Handmade Pouch", additionalInfo: "+3 other products", customer: "John Bushmill", email: "johnb@email.com", total: 121.0, status: "Processing" },
    { id: 2, product: "Smartwatch E2", additionalInfo: "+1 other products", customer: "Ilham Budi Agung", email: "ilhambudii@email.com", total: 590.0, status: "Processing" },
    { id: 3, product: "Smartwatch E1", additionalInfo: "", customer: "Mohammad Karim", email: "m_karim@email.com", total: 125.0, status: "Shipped" },
    { id: 4, product: "Headphone G1 Pro", additionalInfo: "+1 other products", customer: "Linda Blair", email: "lindablair@email.com", total: 348.0, status: "Shipped" },
    { id: 5, product: "Iphone X", additionalInfo: "", customer: "Josh Adam", email: "josh_adam@email.com", total: 607.0, status: "Delivered" }
  ]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sortOrders = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    const sorted = [...orders].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setSortConfig({ key, direction });
    setOrders(sorted);
  };

  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (windowWidth < 480) {
      if (totalPages <= 3) {
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
      } else return [currentPage];
    } else if (windowWidth < 640) {
      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
      } else if (currentPage <= 2) {
        return [1, 2, 3, "...", totalPages];
      } else if (currentPage >= totalPages - 1) {
        return [1, "...", totalPages - 2, totalPages - 1, totalPages];
      } else {
        return [1, "...", currentPage, "...", totalPages];
      }
    } else {
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
      } else if (currentPage <= 3) {
        return [1, 2, 3, 4, 5, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
      }
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);
  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "text-orange-500 bg-orange-50 px-3 py-1 rounded-lg";
      case "Shipped":
        return "text-blue-500 bg-blue-50 px-3 py-1 rounded-lg";
      case "Delivered":
        return "text-green-500 bg-green-50 px-3 py-1 rounded-lg";
      default:
        return "text-gray-500 bg-gray-50 px-3 py-1 rounded-lg";
    }
  };

  const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow max-w-6xl mx-auto w-full">
      <div className="bg-white rounded-t-lg px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs text-green-700 bg-green-100">+2 Orders</span>
          </div>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <button className="flex items-center rounded-md border border-gray-200 px-2 py-1.5 text-gray-500">
              <Calendar className="text-gray-400 w-4 h-4 mr-1.5" />
              <span className="text-sm">Select Date</span>
            </button>
            <button className="flex items-center rounded-md border border-gray-200 px-2 py-1.5 text-gray-500 cursor-pointer">
              <SlidersHorizontal className="text-gray-400 w-4 h-4 mr-1.5" />
              <span className="text-sm">Filters</span>
            </button>
            <div className="text-[#2086BF] px-3 py-1.5 text-sm bg-[#EAF8FF] rounded-lg">See All</div>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 text-left px-6 cursor-pointer" onClick={() => sortOrders("product")}>
                <div className="flex items-center text-sm font-medium text-gray-500">
                  Product
                  <span className="ml-1">
                    {sortConfig.key === "product" ? (
                      sortConfig.direction === "asc" ? "▲" : "▼"
                    ) : (
                      "▼"
                    )}
                  </span>
                </div>
              </th>
              <th className="py-3 text-left px-6">
                <div className="flex items-center text-sm font-medium text-gray-500">
                  Customer
                </div>
              </th>
              <th className="py-3 text-left px-6 cursor-pointer" onClick={() => sortOrders("total")}>
                <div className="flex items-center text-sm font-medium text-gray-500">
                  Total
                  <span className="ml-1">
                    {sortConfig.key === "total" ? (
                      sortConfig.direction === "asc" ? "▲" : "▼"
                    ) : (
                      "▼" // Default arrow icon
                    )}
                  </span>
                </div>
              </th>
              <th className="py-3 text-left px-6 cursor-pointer" onClick={() => sortOrders("status")}>
                <div className="flex items-center text-sm font-medium text-gray-500">
                  Status
                  <span className="ml-1">
                    {sortConfig.key === "status" ? (
                      sortConfig.direction === "asc" ? "▲" : "▼"
                    ) : (
                      "▼" // Default arrow icon
                    )}
                  </span>
                </div>
              </th>
              <th className="py-3 text-left px-6">
                <div className="flex items-center text-sm font-medium text-gray-500">
                  Action
                </div>
              </th>
            </tr>
          </thead>



          <tbody>
            {paginatedOrders.map((order, index) => (
              <tr key={order.id} className={`hover:bg-gray-50 ${index !== orders.length - 1 ? 'border-b border-gray-200' : ''}`}>
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{order.product}</div>
                      {order.additionalInfo && <div className="text-xs text-gray-500">{order.additionalInfo}</div>}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{order.customer}</div>
                    <div className="text-xs text-gray-500">{order.email}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm font-medium text-gray-800">${order.total.toFixed(2)}</div>
                </td>
                <td className="py-4 px-6">
                  <span className={getStatusColor(order.status)}>{order.status}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600"><Eye size={18} /></button>
                    <button className="p-1 text-gray-400 hover:text-gray-600"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 p-3">
          <div className="text-gray-500 text-xs sm:text-sm">
            Showing {firstItem}-{lastItem} from {totalItems}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg cursor-pointer ${currentPage === 1 ? "bg-blue-50 text-blue-300 cursor-not-allowed" : "bg-blue-50 text-blue-500 hover:bg-blue-100"
                }`}>
              <ChevronLeft size={windowWidth < 640 ? 16 : 20} />
            </button>
            {pageNumbers.map((number, index) =>
              number === "..." ? (
                <div key={`ellipsis-${index}`} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-blue-500 font-medium">...</div>
              ) : (
                <button key={number} onClick={() => changePage(number)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg font-medium cursor-pointer ${currentPage === number ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-500 hover:bg-blue-100"
                    }`}>
                  {number}
                </button>
              )
            )}
            <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg cursor-pointer ${currentPage === totalPages ? "bg-blue-50 text-blue-300 cursor-not-allowed" : "bg-blue-50 text-blue-500 hover:bg-blue-100"
                }`}>
              <ChevronRight size={windowWidth < 640 ? 16 : 20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
