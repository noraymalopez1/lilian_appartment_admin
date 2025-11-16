
import Image from "next/image";
import {
  BellIcon,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";


const Navbar = () => {
  return (
    <>
      {/* Navbar */}
      <div className="flex items-center bg-white justify-between py-2 px-4 md:px-12">
        <div className="flex items-center gap-8">
          <Image src="/logo_black.svg" alt="Logo" height={50} width={100} />
          {/* <Menu size={24} /> */}
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
          {/* <BellIcon size={24} className="mr-8" /> */}
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
    </>
  );
};

export default Navbar;
