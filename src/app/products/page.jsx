"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Filter,
  Plus,
  Download,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Menu,
  Calendar,
  LayoutGrid,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TopNavbar from "../../components/TopNavbar";
import { products } from "../../datastore/Products";
import FilterComponent from "../../components/FilterComponent";
import eyeball from "../../assets/productimg/eyeball.svg";
import plusicon from "../../assets/productimg/plusicon.svg";
import exporticon from "../../assets/productimg/exporticon.svg";
import arrowheader from "../../assets/productimg/arrowheader.svg";
import DatePicker from "../../components/DatePicker";
import EditColumns from "../../components/EditColumns";

function exportToCSV(data, filename = "products-export.csv") {
  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Product Name" },
    { key: "sku", header: "SKU" },
    { key: "category", header: "Category" },
    { key: "quantity", header: "Stock" },
    { key: "price", header: "Price" },
    { key: "status", header: "Status" },
    { key: "added", header: "Added Date" },
  ];
  const headerRow = columns.map((column) => `"${column.header}"`).join(",");
  const csvRows = data.map((item) => {
    const values = columns.map((column) => {
      const value =
        column.key === "quantity"
          ? item[column.key] || item.stock || 0
          : item[column.key] || "";
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    return values.join(",");
  });

  const csvContent = [headerRow, ...csvRows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Page() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("All Product");
  const [selectedProducts, setSelectedProducts] = useState([302010, 302011]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [showFilter, setShowFilter] = useState(false);
  const buttonRef = useRef(null);
  const mobileButtonRef = useRef(null);
  const [filterPosition, setFilterPosition] = useState({ top: 50, left: 50 });
  const [isMobile, setIsMobile] = useState(false);
  const [show, setShow] = useState(false);
  const [showEditColumns, setShowEditColumns] = useState(false);
  const modalRef = useRef(null);

  const handleExportCSV = () => {
    const dataToExport = filteredProducts;

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const filename = `products-${selectedTab
      .toLowerCase()
      .replace(" ", "-")}-${formattedDate}.csv`;

    exportToCSV(dataToExport, filename);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShow(false);
        setShowEditColumns(false);
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    if (showEditColumns) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, showEditColumns]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width < 768);
      if (showFilter) {
        setShowFilter(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showFilter]);

  const toggleFilter = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setFilterPosition({ top: rect.bottom + 10, left: rect.left - 170 });
    }
    setShowFilter((prev) => !prev);
  };

  const toggleFiltermobile = () => {
    if (mobileButtonRef.current) {
      const rect = mobileButtonRef.current.getBoundingClientRect();
      const leftPosition = Math.max(
        10,
        Math.min(
          rect.left - modalWidth / 2 + rect.width / 2,
          window.innerWidth - modalWidth - 10
        )
      );

      setFilterPosition({
        top: rect.bottom + 10,
        left: leftPosition,
      });
    }
    setShowFilter((prev) => !prev);
  };

  const closeFilter = () => setShowFilter(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isDesktopButtonClick =
        buttonRef.current && buttonRef.current.contains(e.target);
      const isMobileButtonClick =
        mobileButtonRef.current && mobileButtonRef.current.contains(e.target);

      if (
        showFilter &&
        !e.target.closest(".filter-modal") &&
        !isDesktopButtonClick &&
        !isMobileButtonClick
      ) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilter]);

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const localProducts = JSON.parse(localStorage.getItem("productData")) || [];
    let result = [...products, ...localProducts];

    if (selectedTab === "Published") {
      result = result.filter((product) => product.status === "Published");
    } else if (selectedTab === "Low Stock") {
      result = result.filter((product) => product.status === "Low Stock");
    } else if (selectedTab === "Draft") {
      result = result.filter((product) => product.status === "Draft");
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(result);
  }, [products, selectedTab, searchQuery]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentProducts = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleSelectProduct = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(
        selectedProducts.filter((productId) => productId !== id)
      );
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(currentProducts.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "text-emerald-500";
      case "Low Stock":
        return "text-amber-500";
      case "Out of Stock":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, searchQuery]);

  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];

    if (windowWidth < 480) {
      if (totalPages <= 3) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        return [currentPage];
      }
    } else if (windowWidth < 640) {
      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage <= 2) {
        return [1, 2, 3, "...", totalPages];
      } else if (currentPage >= totalPages - 1) {
        return [1, "...", totalPages - 2, totalPages - 1, totalPages];
      } else {
        return [1, "...", currentPage, "...", totalPages];
      }
    } else {
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage <= 3) {
        return [1, 2, 3, 4, 5, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        return [
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        return [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);

  const tabs = ["All Product", "Published", "Low Stock", "Draft"];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="py-2">
        <TopNavbar />
      </div>
      <div className="max-w-1xl mx-auto px-4 py-1">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Product
            </h1>
            <div className="flex items-center justify-center text-xs md:text-sm mt-1 text-gray-500">
              <span style={{ color: "#2086BF", fontWeight: 500 }}>
                Dashboard
              </span>
              <span className="mx-2">
                {" "}
                <Image
                  src={arrowheader}
                  alt="img"
                  width={"auto"}
                  height={"auto"}
                />{" "}
              </span>
              <span className="text-gray-800">Product List</span>
            </div>
          </div>
          <div className="flex items-center hidden sm:inline ">
            <div className="flex gap-4">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 py-2 px-3 rounded-lg bg-blue-50 text-[#2086BF] hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Image src={exporticon} alt="" width={"auto"} height={"auto"} />
                <span className="font-medium">Export</span>
              </button>

              <button
                className="flex items-center gap-1 py-2 px-3 rounded-lg bg-[#2086BF] text-white hover:bg-blue-600 transition-colors cursor-pointer"
                onClick={() => {
                  router.push("products/addproduct");
                }}
              >
                <Image src={plusicon} alt="" width={"auto"} height={"auto"} />
                <span className="font-medium">Add Product</span>
              </button>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="hidden md:flex flex-col lg:flex-row justify-between items-center mb-4 gap-3">
            <div className="inline-flex gap-2 items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm mx-auto lg:mx-0">
              {tabs.map((tab) => {
                const isActive = tab === selectedTab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#EAF8FF] text-[#2086BF]"
                        : "text-[#667085] hover:bg-gray-100"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap justify-center gap-2 mx-auto lg:mx-0">
              <div className="flex items-center rounded-md border border-gray-200 px-2 py-1.5">
                <Search className="text-gray-400 w-4 h-4 mr-1.5" />
                <input
                  type="text"
                  placeholder="Search product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm text-gray-500 outline-none bg-transparent w-32"
                />
              </div>
              <button
                className="flex items-center rounded-md border border-gray-200 px-2 py-1.5 text-gray-500 cursor-pointer"
                onClick={() => setShow(!show)}
              >
                <Calendar className="text-gray-400 w-4 h-4 mr-1.5" />
                <span className="text-sm">Select Date</span>
              </button>
              {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                  <div ref={modalRef} className="bg-white ">
                    <DatePicker />
                  </div>
                </div>
              )}
              {showEditColumns && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                  <div ref={modalRef} className="bg-white ">
                    <EditColumns />
                  </div>
                </div>
              )}{" "}
              <div>
                <button
                  ref={buttonRef}
                  onClick={toggleFilter}
                  className="flex items-center rounded-md border border-gray-200 px-2 py-1.5 text-gray-500 cursor-pointer"
                >
                  <SlidersHorizontal className="text-gray-400 w-4 h-4 mr-1.5" />
                  <span className="text-sm">Filters</span>
                </button>
              </div>
              <button
                className="flex items-center rounded-md border border-gray-200 px-2 py-1.5 text-gray-500 cursor-pointer"
                onClick={() => {
                  setShowEditColumns(!showEditColumns);
                  setShow(false);
                }}
              >
                <LayoutGrid className="text-gray-400 w-4 h-4 mr-1.5" />
                <span className="text-sm">Edit Column</span>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="md:hidden border-b">
            <div className="flex justify-between items-center p-4">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <Menu size={20} />
              </button>
              <div className="font-semibold text-gray-600">{selectedTab}</div>
              <div className="w-5"></div>
            </div>
            {mobileMenuOpen && (
              <div className="bg-white p-4 border-t">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-md mb-1 ${
                      selectedTab === tab
                        ? "text-blue-600 bg-blue-50 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedTab(tab);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="md:hidden flex justify-between p-4 border-b">
            <button
              onClick={handleExportCSV}
              className="flex items-center px-3 py-1.5 text-xs text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
            >
              <Download size={14} className="mr-1" />
              Export
            </button>
            <button
              className="flex items-center px-3 py-1.5 text-xs text-white bg-[#2086BF] rounded-md hover:bg-blue-700"
              onClick={() => {
                router.push("products/addproduct");
              }}
            >
              <Plus size={14} className="mr-1" />
              Add Product
            </button>
          </div>

          <div className="p-2 md:p-0 sm:p-2">
            <div className="md:hidden mb-4">
              <div className="flex items-center rounded-md border border-gray-200 px-2 py-1.5 mb-3">
                <Search className="text-gray-400 w-4 h-4 mr-1.5" />
                <input
                  type="text"
                  placeholder="Search product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm text-gray-500 outline-none bg-transparent w-32"
                />
              </div>
              <div className="flex justify-between">
                <button className="flex items-center rounded-md border border-gray-200 px-2 py-1.5 text-gray-500 cursor-pointer">
                  <Calendar className="text-gray-400 w-4 h-4 mr-1.5" />
                  <span className="text-sm">Select Date</span>
                </button>
                <button
                  ref={mobileButtonRef}
                  onClick={toggleFiltermobile}
                  className="flex items-center rounded-md border border-gray-200 px-2 py-1.5 text-gray-500 cursor-pointer"
                >
                  <SlidersHorizontal className="text-gray-400 w-4 h-4 mr-1.5" />
                  <span className="text-sm">Filters</span>
                </button>
              </div>
            </div>
            {showFilter && (
              <div
                className="absolute z-50 filter-modal"
                style={{
                  top: `${filterPosition.top}px`,
                  left: `${filterPosition.left}px`,
                }}
              >
                <FilterComponent onClose={closeFilter} />
              </div>
            )}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-white-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                    <th className="px-4 py-3 w-12">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 accent-[#2086BF] w-4 h-4"
                        onChange={handleSelectAll}
                        checked={
                          currentProducts.length > 0 &&
                          currentProducts.every((product) =>
                            selectedProducts.includes(product.id)
                          )
                        }
                      />
                    </th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Added</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <tr
                        key={product.id}
                        className={`hover:bg-gray-50 ${
                          selectedProducts.includes(product.id)
                            ? "bg-gray-100"
                            : ""
                        }`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 accent-[#2086BF] w-4 h-4"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleSelectProduct(product.id)}
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-md mr-3"></div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {product.variations
                                  ? product.variations.length
                                  : 0}{" "}
                                variants
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-[#2086BF]">
                          {product.sku}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {product.category}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {product.quantity || product.stock || 0}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {product.price}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`text-xs px-2 py-1 rounded-sm ${
                              product.status === "Published"
                                ? "bg-green-100 text-[#1A9882] font-medium"
                                : product.status === "Low Stock"
                                ? "bg-[#FFF0EA] text-[#F86624] font-medium"
                                : product.status === "Out of Stock"
                                ? "bg-red-100 text-red-800"
                                : "bg-[#F0F1F3] text-[#667085]"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {product.added || "24 Dec 2022"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600">
                              <Edit2
                                style={{ cursor: "pointer" }}
                                size={16}
                                onClick={() => {
                                  router.push(`/products/${product.id}`);
                                }}
                              />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600">
                              <Trash2 size={16} style={{ cursor: "pointer" }} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <Image
                                src={eyeball}
                                alt="img"
                                height={"auto"}
                                width={"auto"}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="md:hidden">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-md mb-3 overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                        />
                        <span className="font-xl text-gray-600 text-sm ">
                          {product.name}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          product.status === "Published"
                            ? "bg-green-100 text-[#1A9882] font-medium"
                            : product.status === "Low Stock"
                            ? "bg-[#FFF0EA] text-[#F86624] font-medium"
                            : product.status === "Out of Stock"
                            ? "bg-red-100 text-red-800"
                            : "bg-[#F0F1F3] text-[#667085]"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="flex mb-2">
                        <div className="w-16 h-16 bg-gray-200 rounded-md mr-3"></div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            {product.variations ? product.variations.length : 0}{" "}
                            variants
                          </div>
                          <div className="text-sm text-grey-700 font-medium mb-1">
                            {product.price}
                          </div>
                          <div className="text-xs text-[#2086BF]">
                            SKU: {product.sku}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                        <div>
                          <span className="text-gray-500">Category:</span>{" "}
                          {product.category}
                        </div>
                        <div>
                          <span className="text-gray-500">Stock:</span>{" "}
                          {product.quantity || product.stock || 0}
                        </div>
                        <div>
                          <span className="text-gray-500">Added:</span>{" "}
                          {product.added || "24 Dec 2022"}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 border-t pt-2">
                        <button
                          className="p-1.5 text-gray-400 hover:text-blue-600"
                          onClick={() => {
                            router.push(`/products/${product.id}`);
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600">
                          <Image
                            src={eyeball}
                            alt="img"
                            height={"auto"}
                            width={"auto"}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-gray-500">
                  No products found
                </div>
              )}
            </div>
            {totalItems > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 p-3">
                <div className="text-gray-500 text-xs sm:text-sm">
                  Showing {firstItem}-{lastItem} from {totalItems}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg cursor-pointer ${
                      currentPage === 1
                        ? "bg-blue-50 text-blue-300 cursor-not-allowed"
                        : "bg-blue-50 text-blue-500 hover:bg-blue-100"
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={windowWidth < 640 ? 16 : 20} />
                  </button>
                  {pageNumbers.map((number, index) =>
                    number === "..." ? (
                      <div
                        key={`ellipsis-${index}`}
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-blue-500 font-medium"
                      >
                        ...
                      </div>
                    ) : (
                      <button
                        key={number}
                        onClick={() => changePage(number)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg font-medium cursor-pointer ${
                          currentPage === number
                            ? "bg-blue-500 text-white"
                            : "bg-blue-50 text-blue-500 hover:bg-blue-100"
                        }`}
                      >
                        {number}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg cursor-pointer ${
                      currentPage === totalPages
                        ? "bg-blue-50 text-blue-300 cursor-not-allowed"
                        : "bg-blue-50 text-blue-500 hover:bg-blue-100"
                    }`}
                    aria-label="Next page"
                  >
                    <ChevronRight size={windowWidth < 640 ? 16 : 20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
