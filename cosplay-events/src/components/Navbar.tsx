"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State for hamburger menu

  return (
    <nav className="bg-[var(--cosevent-darkblue)] text-white py-3 px-6 fixed top-0 w-full z-40 shadow-md flex items-center justify-between">
      {/* cosevent banner - Links to Admin Page */}
      <Link href="/admin" className="flex items-center">
        <Image src="/cosevent-banner.png" alt="cosevent Banner" width={150} height={40} />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden space-x-6 font-semibold md:flex">
        <a href="https://cosgear.co" target="_blank" rel="noopener noreferrer" className="nav-link">
          Cosgear.co
        </a>
        <a href="https://app.cosgear.co/cosplanner" target="_blank" rel="noopener noreferrer" className="nav-link">
          Cosplanner
        </a>
      </div>

      {/* Mobile Menu Button */}
      <button className="text-2xl text-white md:hidden" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[var(--cosevent-darkblue)] p-4 shadow-md flex flex-col items-center">
          <a href="https://cosgear.co" target="_blank" rel="noopener noreferrer" className="nav-link">
            Cosgear.co
          </a>
          <a href="https://app.cosgear.co/cosplanner" target="_blank" rel="noopener noreferrer" className="nav-link">
            Cosplanner
          </a>
        </div>
      )}

      {/* Admin Navbar Styles */}
      <style jsx>{`
        .nav-link {
          font-weight: bold;
          padding: 8px 16px;
          transition: 0.2s;
        }
        .nav-link:hover,
        .nav-link.active {
          color: var(--cosevent-yellow);
        }
      `}</style>
    </nav>
  );
}
