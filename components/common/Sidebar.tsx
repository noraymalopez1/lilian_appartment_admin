"use client";

import { cn } from "@/lib/utils";
import {
  BellIcon,
  Building2,
  CalendarCheck,
  Car,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardListIcon,
  Home,
  LogOut,
  Menu,
  MessageSquareDiff,
  ScrollText,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const sideBarItems = [
  {
    title: "Booking",
    to: "/bookings",
    icon: <CalendarCheck size={24} />,
  },
  {
    title: "Taxis",
    to: "/taxis",
    icon: <Car size={24} />,
  },
  {
    title: "Add Listing",
    icon: <ClipboardListIcon size={24} />,
    to: "/add-listing",
  },
  {
    title: "Apartment List",
    icon: <Building2 size={24} />,
    to: "/apartments",
  },
  {
    title: "Attraction List",
    icon: <ScrollText size={24} />,
    to: "attractions",
  },
  {
    title: "Reviews",
    icon: <MessageSquareDiff size={24} />,
    to: "reviews",
  },
];

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const path = usePathname();
  const [triggerHovered, setTriggerHovered] = useState(false);

  return (
    <div
      className={cn(
        "flex h-screen flex-col items-center transition-all duration-300 z-50 bg-white shadow-2xl border-r border-gray-200",
        sidebarOpen ? "w-[250px] translate-x-0" : "w-0 -translate-x-full md:translate-x-0 md:w-[5%] md:min-w-[75px]",
        "fixed top-0 left-0"
      )}
    >
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[-1] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`${!sidebarOpen ? "max-w-16" : ""
          } flex h-full w-full mt-32 min-w-fit gap-3 flex-col items-center justify-between`}
      >
        <div className="flex flex-col items-center justify-center">
          <div
            className={cn(
              "flex flex-col px-4 justify-center gap-y-3",
              sidebarOpen ? "items-start" : "items-center"
            )}
          >
            {/* main items */}

            <Link
              href={"dashboard"}
              className={cn(
                path.includes("/dashboard") || path.startsWith("/dashboard")
                  ? "text-[#F0EAE9] bg-[#99582A]"
                  : "",
                "rounded-2xl px-3 py-2 gap-2 mt-2 w-fit text-center justify-between flex items-center"
              )}
            >
              <Home /> {sidebarOpen && <p>Dashboard</p>}
            </Link>

            <div className="pt-4">
              {sidebarOpen && (
                <span className="text-gray-500 uppercase font-light">
                  Management
                </span>
              )}

              <div className="flex flex-col mt-2 ">
                {sideBarItems.map((item, index) => (
                  <Link
                    key={index}
                    // onClick={() => setActiveTab(item.title)}
                    href={item.to}
                    className={cn(
                      path.includes(item.to) || path.startsWith(item.to)
                        ? "text-[#F0EAE9] bg-[#99582A]"
                        : "",
                      "py-2 px-3 rounded-2xl w-fit text-center flex items-center gap-2"
                    )}
                  >
                    {item.icon}
                    {sidebarOpen && (
                      <p className="whitespace-nowrap">{item.title}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
            <div className="pt-4">
              <span className=" text-gray-500 uppercase whitespace-nowrap font-light">
                {sidebarOpen && " Account Options"}
              </span>
              <button className="mt-2 px-3 w-full text-center flex items-center gap-2">
                <LogOut />
                {sidebarOpen && <p>Logout</p>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          setSidebarOpen(!sidebarOpen);
          setTriggerHovered(false);
        }}
        onMouseEnter={() => {
          setTriggerHovered(true);
        }}
        onMouseLeave={() => {
          setTriggerHovered(false);
        }}
        className={cn(
          "absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-md md:flex hidden",
          sidebarOpen ? "rotate-0" : "rotate-180"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    </div >
  );
};

export default Sidebar;
