"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // State for hamburger menu

  return (
    <nav className="bg-[var(--cosevent-darkblue)] text-white py-3 px-6 fixed top-0 w-full z-40 shadow-md flex items-center justify-between">
      {/* cosevent banner - Links to Admin Page */}
      <Link href="/admin" className="flex items-center">
        <Image src="/cosgear-bannerNEW.png" alt="cosevent Banner" width={150} height={40} />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden space-x-6 font-semibold md:flex">
        <Link href="/admin" className={`nav-link ${pathname === "/admin" ? "active" : ""}`}>
          Dashboard
        </Link>
        <Link href="/admin/crawl" className={`nav-link ${pathname === "/admin/forms" ? "active" : ""}`}>
         Crawler
        </Link>
        <Link href="/admin/conventionlist" className={`nav-link ${pathname === "/admin" ? "active" : ""}`}>
          Conventions
        </Link>
        <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
          Home
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button className="text-2xl text-white md:hidden" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[var(--cosevent-darkblue)] p-4 shadow-md flex flex-col items-center">
          <Link href="/admin" className={`nav-link ${pathname === "/admin" ? "active" : ""}`}>
          Dashboard
          </Link>
          <Link href="/admin/crawl" className={`nav-link ${pathname === "/admin/forms" ? "active" : ""}`}>
           Crawler
          </Link>
          <Link href="/admin/conventionlist" className={`nav-link ${pathname === "/admin" ? "active" : ""}`}>
            Conventions
          </Link>
          <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
            Home
          </Link>
        </div>
      )}

      {/* Admin Navbar Styles */}
      <style jsx>{`
        .nav-link {
          font-weight: bold;
          padding: 8px 16px;
          transition: 0.2s;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--cosevent-yellow);
        }
      `}</style>
    </nav>
  );
}
