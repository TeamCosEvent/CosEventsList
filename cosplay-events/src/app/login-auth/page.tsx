"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export default function MockAuthPage() {
  const [step, setStep] = useState<"googlePrompt" | "credentials">("googlePrompt");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const validateInput = () => {
    if (!email.endsWith("@gmail.com")) {
      setError("Only @gmail.com addresses are allowed.");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid e-mail address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    setError("");
    setMessage("");

    if (!validateInput()) return;

    try {
      const usersRef = collection(db, "mock_users");
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const match = snapshot.docs.find(
          (doc) => doc.data().password === password
        );

        if (match) {
          setMessage("Welcome back! Redirecting...");
          setTimeout(() => router.push("/"), 1500);
          return;
        } else {
          setError("Google account not found, please log in to Google in your current browser.");
          return;
        }
      }

      // Save new user
      await addDoc(usersRef, {
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      setMessage("Sign up successful! Redirecting...");
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold text-[var(--cosevent-yellow)]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {step === "googlePrompt" ? "Continue with Google" : "Enter your credentials"}
      </motion.h1>

      <AnimatePresence>
        {message && (
          <motion.p
            key="message"
            className="mt-4 text-green-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {message}
          </motion.p>
        )}
        {error && (
          <motion.p
            key="error"
            className="mt-4 text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {step === "googlePrompt" ? (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setStep("credentials")}
          className="mt-6 btn-primary px-6 py-2"
        >
          Log in with your Google account
        </motion.button>
      ) : (
        <motion.div
          className="mt-6 w-full max-w-xs flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field p-2 border rounded-md mt-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field p-2 border rounded-md mt-2"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRegister}
            className="mt-4 btn-primary w-full"
          >
            Continue
          </motion.button>
        </motion.div>
      )}

     
    </motion.div>
  );
}
