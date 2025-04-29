"use client";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import AdminNavbar from "@/components/AdminNavbar";
import AdminNotifications from "@/components/AdminNotifications";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email?.endsWith("@cosevent.co")) {
        setUser(user);
        setIsAdmin(true);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (!result.user.email?.endsWith("@cosevent.co")) {
        alert("Only authorized e-mails are allowed, please contact Admin.");
        await signOut(auth);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-center">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <h2 className="text-4xl font-bold text-[var(--cosevent-yellow)] text-center">
          Admin Login
        </h2>
        <p className="mt-2 text-lg text-center">
          Sign in with your authorized CosEvent account.
        </p>
        <button onClick={handleLogin} className="mt-4 btn-primary">
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
      <div className="max-w-4xl px-6 py-10 mx-auto mt-15">
        <h2 className="text-3xl font-bold text-[var(--cosevent-yellow)] mb-6">
          Welcome, {user.displayName}
        </h2>
        <p className="mb-8 text-lg">You are logged in as an admin.</p>

        {/* Notifications Component */}
        <AdminNotifications />

        <button onClick={handleLogout} className="mt-10 btn-primary">
          Logout
        </button>
      </div>
    </div>
  );
}
