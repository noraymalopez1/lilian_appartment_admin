import Image from "next/image";
import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaX, FaXTwitter } from "react-icons/fa6";

const quickLinks = [
  {
    title: "Appartments",
    url: "/",
  },
  {
    title: "Attractions",
    url: "/",
  },
  {
    title: "Airport Taxi",
    url: "/",
  },
  {
    title: "City Guide",
    url: "/",
  },
  {
    title: "Reservation",
    url: "/",
  },
  {
    title: "Contact",
    url: "/",
  },
];

const Footer = () => {
  return (
    <div className="bg-gradient-to-b from-[#F0EAE9]/20 to-[#B89593]/20 pt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 pb-8 md:mx-12">
        <div>
          <Image src="/black-logo.svg" alt="logo" width={150} height={100} />
          <p className="w-full md:w-[80%]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut laboreet dolore magna aliqua. Ut enim
            ad minim
          </p>
          <div className="mt-8 flex items-center gap-8 *:text-[#781F19]">
            {[
              {
                icon: <FaInstagram size={20} />,
                url: "/",
              },
              {
                icon: <FaFacebook size={20} />,
                url: "/",
              },
              {
                icon: <FaXTwitter size={20} />,
                url: "/",
              },
              {
                icon: <FaYoutube size={20} />,
                url: "/",
              },
            ].map((item, index) => (
              <a key={index} href={item.url}>
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* quick links */}
        <div>
          <h2 className="text-xl uppercase font-normal mb-2">Quick Link</h2>
          {
            <div className="flex flex-col gap-2">
              {quickLinks.map((link, index) => (
                <a key={index} href={link.url}>
                  {link.title}
                </a>
              ))}
            </div>
          }
        </div>

        {/* contact info */}
        <div>
          <h2 className="text-xl uppercase font-normal mb-2">Contact Info</h2>
          <div className="flex flex-col gap-2">
            <p>Address: Lorem ipsum dolor</p>
            <p>Phone: xxxx-xxxxxxx</p>
            <p>E-Mail: loremipsum@gmail.com</p>
            <p>Business Hours: 24 hrs</p>
          </div>
        </div>
      </div>

      {/* footer bottom */}
      <div className="py-3 flex justify-between items-center px-8 bg-white">
        <p className="text-[14px]">
          Copyright © {new Date().getFullYear()} lilians Design Apartments
        </p>
        <div className="flex items-center gap-4 *:text-[14px] *:text-[#781F19]">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
