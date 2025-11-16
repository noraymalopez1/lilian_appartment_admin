"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  BellIcon,
  Building2,
  CalendarCheck,
  ChevronDown,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  MessageSquareDiff,
  ScrollText,
  Search,
} from "lucide-react";
import AddListing from "@/app/AddListing";
import Booking from "@/app/Booking";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState<String>("dashboard");
  return (
    <>
      {/* Navbar */}
      <div className="flex items-center justify-between py-2 px-4 md:px-12">
        <div className="flex items-center gap-8">
          <Image src="/logo_black.svg" alt="Logo" height={50} width={100} />
          <Menu size={24} />
        </div>
        <div className="w-1/3">
          <div className="border border-gray-300 rounded-md p-2 flex items-center gap-3">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Type to search"
              className="focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <BellIcon size={24} className="mr-8" />
          <Image
            src="/avatar.png"
            alt="Avatar"
            height={50}
            width={50}
            className="rounded-full"
          />
          <h3 className="capitalize font-semibold">Safeer Khan</h3>
          <ChevronDown size={24} />
        </div>
      </div>

      <section className="w-full flex">
        {/* Sidebar */}
        <aside className=" w-[266px] py-8 px-4">
          <div className=" *:pl-8">
            <span className="text-gray-500 uppercase font-light">Menu</span>
            <button
              className={`${
                activeTab === "dashboard" && "text-[#F0EAE9] bg-[#99582A]"
              } py-3 rounded-2xl mt-2 w-full text-center flex items-center gap-2`}
              onClick={() => setActiveTab("dashboard")}
            >
              <Home size={24} /> Dashboard
            </button>
          </div>
          <div className="pt-4">
            <span className="pl-8 text-gray-500 uppercase font-light">
              Managment
            </span>
            <div className="flex flex-col mt-2 ">
              {[
                {
                  title: "Booking",
                  icon: <CalendarCheck size={24} />,
                  func: () => {},
                },
                {
                  title: "Add Listing",
                  icon: <ClipboardList size={24} />,
                  func: () => {},
                },
                {
                  title: "Apartment List",
                  icon: <Building2 size={24} />,
                  func: () => {},
                },
                {
                  title: "Attraction List",
                  icon: <ScrollText size={24} />,
                  func: () => {},
                },
                {
                  title: "Reviews",
                  icon: <MessageSquareDiff size={24} />,
                  func: () => {},
                },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(item.title)}
                  className={`${
                    activeTab === item.title && "text-[#F0EAE9] bg-[#99582A]"
                  } pl-8 py-3 rounded-2xl w-full text-center flex items-center gap-2`}
                >
                  {item.icon}
                  {item.title}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4 pl-8">
            <span className=" text-gray-500 uppercase font-light">
              Account Options
            </span>
            <button className="mt-2 w-full text-center flex items-center gap-2">
              <LogOut size={24} /> Logout
            </button>
          </div>
        </aside>

        {/* main tabs */}
        <main className="w-full bg-gray-100">
          {activeTab === "dashboard" && <div>Dashboard</div>}
          {activeTab === "Booking" && <Booking />}
          {activeTab === "Add Listing" && <AddListing />}
          {activeTab === "Apartment List" && <div>Apartment List</div>}
          {activeTab === "Attraction List" && <div>Attraction List</div>}
          {activeTab === "Reviews" && <div>Reviews</div>}
        </main>
      </section>
    </>
  );
};

export default Navbar;
