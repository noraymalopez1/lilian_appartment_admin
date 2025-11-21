"use client";
import Sidebar from "@/components/common/Sidebar";
import Navbar from "@/components/Navbar";
import { Loader } from "lucide-react";
const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="bg-[#FAFAFA] flex h-screen w-screen">

      <Sidebar />

      {/* Main section */}
      <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out ml-0 md:ml-[75px] has-[+div.w-\[250px\]]:md:ml-[250px]">
        {/* Navbar fixed at top */}
        <div className="fixed top-0 right-0 left-0 z-10 transition-all duration-300 ease-in-out ml-0 md:ml-[75px]">
          <Navbar />
        </div>

        {/* Scrollable content */}
        <div className="mt-16 w-full flex-1 overflow-y-auto p-4 md:p-8">
          {false ? (
            <div className="flex h-full w-full items-center justify-center text-white">
              <Loader className="animate-spin text-4xl" />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
