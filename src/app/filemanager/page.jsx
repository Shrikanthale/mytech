import React from "react";
import Link from "next/link";

export default function filemanager() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <h1 className="text-2xl font-bold mb-4 color-black-800" style={{ color: "#1D1F2C" }}>File Manager Page</h1>
      <p className="text-gray-600">This is the file manager page content.</p>
      <Link href="/dashboard">
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">Go to Dashboard</button>
      </Link>
    </div>
  );
}