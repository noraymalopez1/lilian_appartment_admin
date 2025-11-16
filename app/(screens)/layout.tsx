"use client";
import Sidebar from "@/components/common/Sidebar";
import Navbar from "@/components/Navbar";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
const Layout = ({ children }: { children: React.ReactNode }) => {
  /*
  useLayoutEffect(() => {
    console.log("loading or user changed : ", user, authStateLoading);
    if (!authStateLoading && !user) {
      router.push("/get-started");
    }
  }, [user, authStateLoading]);
    
    */

  return (
    <div className="bg-[#FAFAFA] flex h-screen w-screen justify-end">




      {/* Sidebar (not scrollable) */}
      <Sidebar />

      {/* Main section */}
      <div className="flex flex-1 flex-col">
        {/* Navbar fixed at top */}
        <div className="fixed top-0 right-0 left-0 z-10">
          <Navbar />
        </div>

        {/* Scrollable content */}
        <div className="mt-16 w-[calc(100vw-5%)] overflow-y-auto md:w-full">
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
