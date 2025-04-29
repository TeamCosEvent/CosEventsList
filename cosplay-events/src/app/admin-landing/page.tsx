"use client";
import { useRouter } from "next/navigation";

export default function AdminLanding() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h2 className="text-4xl font-bold">Restricted Area</h2>
      <p className="mt-4 text-lg text-secondary">
        You are about to enter the CosEvent admin panel. If you are not an admin, please return to the main site.
      </p>

      <div className="flex mt-6 space-x-4">
        <button onClick={() => router.push("/")} className="btn-primary">
          Return to CosEvent
        </button>
        <button onClick={() => router.push("/admin")} className="btn-primary">
          Proceed to Admin
        </button>
      </div>
    </div>
  );
}
