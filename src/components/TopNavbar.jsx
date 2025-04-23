'use client';
import { Bell, CalendarDays, Mail } from 'lucide-react';
import Image from 'next/image';
import dropdown from "../../src/assets/productimg/dropdown.svg"

export default function TopNavbar() {
  return (
    <div className="w-full flex items-center justify-between px-4 py-2 ">
      <div className="flex items-center w-full max-w-xs">
        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z" />
        </svg>
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
        />
      </div>
      <div className="flex items-center gap-4">
        <CalendarDays className="text-gray-500 w-5 h-5 cursor-pointer " />
        <div className="relative cursor-pointer">
          <Bell className="text-gray-500 w-5 h-5 cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            2
          </span>
        </div>
        <div className="relative">
          <Mail className="text-gray-500 w-5 h-5 cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            2
          </span>
        </div>
        <div className="h-6 w-[1px] bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-7 h-7 bg-gray-200 rounded-full" />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border-2 border-white rounded-full" />
          </div>
          <div className="text-sm leading-tight hidden sm:block">
            <div className="text-gray-800 font-medium">Jenil Patel</div>
            <div className="text-gray-500 text-xs">Manager</div>
          </div>
         <Image src={dropdown} alt='' height={"auto"} width={"auto"} className='cursor-pointer' />
        </div>
      </div>
    </div>
  );
}