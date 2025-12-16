import Image from "next/image";
import { BellIcon, ChevronDown, Menu, Search } from "lucide-react";

const Navbar = () => {
  return (
    <>
      {/* Navbar */}
      <div className="flex items-center bg-white justify-between py-2 px-4 md:px-12">
        <div className="flex items-center gap-8">
          <Image src="/logo_black.svg" alt="Logo" height={50} width={100} />
          {/* <Menu size={24} /> */}
        </div>
        <div className="hidden md:flex md:w-1/3" />
      </div>
    </>
  );
};

export default Navbar;
