'use client';

import { useEffect, useState } from "react";
import {
  FaInstagram,
  FaTiktok,
  FaDiscord,
  FaLinkedin,
} from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-[var(--cosevent-surface)] text-center py-6 mt-10">
      {/* Year and copyright */}
      {year && (
        <p className="text-sm text-[var(--cosevent-text-muted)]">
          © {year} cosevent. All rights reserved.
        </p>
      )}

      {/* Clickable Legal & Dashboard Links */}
      <div className="mt-1 text-xs text-[var(--cosevent-text-muted)] space-x-2">
        <Link href="/terms" className="hover:text-[var(--cosevent-yellow)] transition">Terms of Service</Link> |
        <Link href="/privacy" className="hover:text-[var(--cosevent-yellow)] transition"> Privacy Policy</Link> |
        <Link href="/admin-landing" className="hover:text-[var(--cosevent-yellow)] transition"> Dashboard</Link>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center mt-3 space-x-5 text-xl">
        <a href="https://instagram.com/cosgearofficial" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-[var(--cosevent-text-muted)] hover:text-[var(--cosevent-yellow)] transition" />
        </a>
        <a href="https://tiktok.com/@cosgear" target="_blank" rel="noopener noreferrer">
          <FaTiktok className="text-[var(--cosevent-text-muted)] hover:text-[var(--cosevent-yellow)] transition" />
        </a>
        <a href="https://discord.gg/xDyjYRvfBK" target="_blank" rel="noopener noreferrer">
          <FaDiscord className="text-[var(--cosevent-text-muted)] hover:text-[var(--cosevent-yellow)] transition" />
        </a>
        <a href="https://www.linkedin.com/company/cosgear-as" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="text-[var(--cosevent-text-muted)] hover:text-[var(--cosevent-yellow)] transition" />
        </a>
      </div>
    </footer>
  );
}
