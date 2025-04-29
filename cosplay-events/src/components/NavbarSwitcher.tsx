"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/Navbar";
import AdminNavbar from "@/components/AdminNavbar";

export default function NavbarSwitcher() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin"; // Only the login page
  const isLandingPage = pathname === "/admin-landing"; // Exclude navbar from landing page

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // User is authenticated if they have an @cosevent.com email
      setIsAuthenticated(!!(user && user.email?.endsWith("@cosevent.com")));
    });

    return () => unsubscribe();
  }, []);

  // If it's the landing page, HIDE the navbar completely
  if (isLandingPage) return null;

  // If it's the admin login page and the user isn't logged in, HIDE the navbar
  if (isAdminLoginPage && !isAuthenticated) return null;

  // If it's an admin page and the user is authenticated, show the admin navbar
  return isAdminPage && isAuthenticated ? <AdminNavbar /> : <Navbar />;
}
