"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navLink = [
  {
    title: "Home",
    url: "/",
  },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const path = usePathname();

  useEffect(() => {
    setCurrentPath(path);
    console.log(path);
  }, [path]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // cleanup listener when component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:px-12",
        scrolled
          ? "bg-white/20 shadow-md **:text-black backdrop-blur-2xl"
          : "bg-transparent",
        "shadow-b-lg",
                currentPath === "/reservations"
          ? "bg-[#99582A] backdrop-blur-2xl"
          : "",
      )}
    >
      <div>
        <Image
          src={scrolled ? "/logo_black.svg" : "/logo.svg"}
          alt="Logo"
          height={50}
          width={100}
        />
      </div>
      <div className="w-[60%] flex justify-between items-center">
        {navLink.map((link, index) => (
          <Link
            key={index}
            className={cn(
              "border-transparent hover:text-[#99582A] border-b-2 text-white hover:border-b-[#99582A] transition-all duration-100",
              currentPath === link.url
                ? "text-[#99582A] border-b-[#99582A]"
                : "",
            )}
            href={link.url}
          >
            {link.title}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-2 *:text-white *:cursor-pointer *:hover:bg-transparent *:hover:text-white">
        <Button
          variant="outline"
          className="bg-transparent rounded-full primary-border px-8"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
