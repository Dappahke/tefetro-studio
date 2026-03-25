"use client";

import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient();

  const handleReset = async () => {
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (!error) {
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <div className="section flex items-center justify-center min-h-screen">
      <div className="glass p-6 rounded-2xl max-w-md w-full">

        <h1 className="text-xl text-deep mb-4">
          Set New Password
        </h1>

        <input
          type="password"
          placeholder="New password"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleReset} className="btn-primary w-full">
          {loading ? "Updating..." : "Update Password"}
        </button>

      </div>
    </div>
  );
}