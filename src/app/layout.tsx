"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ResponsiveSidebar from "../components/resSidebar";
import { useState, useEffect } from "react";
import { Open_Sans } from 'next/font/google'

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-open-sans',
})
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} ${geistSans.variable} ${geistMono.variable} antialiased h-screen bg-gray-50 overflow-x-hidden`}
      >
        <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 z-30">
          <button onClick={toggleSidebar} className="p-2 focus:outline-none cursor-pointer" aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="black" viewBox="0 0 24 24" stroke="black">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center">
            <ResponsiveSidebar isMobileHeader={true} onClose={toggleSidebar} />
          </div>
        </header>
        <aside
          className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 shadow-sm z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <ResponsiveSidebar onClose={toggleSidebar} />
        </aside>
        {sidebarOpen && (
  <div
    className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-all duration-300"
    onClick={toggleSidebar}
    aria-hidden="true"
  />
)}
        <main className={`lg:ml-60 pt-16 lg:pt-0 min-h-screen transition-all duration-300 ease-in-out w-full lg:w-[calc(100%-15rem)] overflow-y-auto overflow-x-hidden ${sidebarOpen ? 'ml-0' : ''}`}>
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}