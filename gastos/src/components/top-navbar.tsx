// // src/components/TopNavBar.tsx
// import React from "react";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import {  UserIcon,  } from "@heroicons/react/24/solid";


// export function TopNavBar() {
//   return (
//     <nav className="fixed top-0 left-0 right-0 bg-gray-800 text-white h-10 flex items-center justify-between px-4 shadow-lg z-50">
//       <SidebarTrigger />
//       <h1 className="text-lg font-semibold">My App</h1>
//       <UserIcon className="w-6 h-6" aria-label="User Profile" />
//     </nav>
//   );
// }


/**
 * v0 by Vercel.
 * @see https://v0.dev/t/xYHqD5MkVkT
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "./ui/sidebar"

export function TopNavBar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <SidebarTrigger />
          <Link href="#" className="flex items-center" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          {/* <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Sign in
            </Button>
            <Button size="sm">Sign up</Button>
          </div> */}
        </div>
      </div>
    </nav>
  )
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}
