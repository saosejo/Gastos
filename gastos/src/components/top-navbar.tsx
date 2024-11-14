// src/components/TopNavBar.tsx
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {  UserIcon,  } from "@heroicons/react/24/solid";


export function TopNavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 text-white h-10 flex items-center justify-between px-4 shadow-lg z-50">
      <SidebarTrigger />
      <h1 className="text-lg font-semibold">My App</h1>
      <UserIcon className="w-6 h-6" aria-label="User Profile" />
    </nav>
  );
}
