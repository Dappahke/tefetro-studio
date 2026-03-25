"use client";

import { useState, useMemo } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  // ✅ Create Supabase client ONCE
  const supabase = useMemo(() => createBrowserClient(), []);

  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 🔐 EMAIL LOGIN / SIGNUP / RESET
  const handleEmailAuth = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        setMessage("Account created. Check your email.");
      }

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.push("/dashboard");
      }

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;

        setMessage("Password reset email sent.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 GOOGLE LOGIN
  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="section flex items-center justify-center min-h-screen">
      <div className="section-inner max-w-md w-full">
        <div className="glass rounded-2xl p-8">
          
          {/* HEADER */}
          <h1 className="text-2xl font-semibold text-deep text-center">
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Create Account"}
            {mode === "forgot" && "Reset Password"}
          </h1>

          {/* GOOGLE */}
          {mode !== "forgot" && (
            <button
              onClick={handleGoogle}
              className="w-full mt-6 border border-neutral-300 rounded-lg py-3 flex justify-center gap-2 hover:bg-neutral-100"
            >
              Continue with Google
            </button>
          )}

          {/* DIVIDER */}
          {mode !== "forgot" && (
            <div className="my-6 text-center text-sm text-neutral-500">
              or
            </div>
          )}

          {/* ERROR */}
          {error && (
            <p className="text-alert text-sm mb-3">{error}</p>
          )}

          {/* SUCCESS */}
          {message && (
            <p className="text-sage text-sm mb-3">{message}</p>
          )}

          {/* EMAIL INPUT */}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 px-4 py-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          {mode !== "forgot" && (
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 px-4 py-2 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          {/* CTA */}
          <button
            onClick={handleEmailAuth}
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : mode === "login"
              ? "Login"
              : mode === "signup"
              ? "Create Account"
              : "Send Reset Link"}
          </button>

          {/* SWITCHES */}
          <div className="mt-6 text-sm text-center text-neutral-600 space-y-2">
            {mode === "login" && (
              <>
                <button onClick={() => setMode("signup")}>
                  Create account
                </button>
                <br />
                <button onClick={() => setMode("forgot")}>
                  Forgot password?
                </button>
              </>
            )}

            {mode === "signup" && (
              <button onClick={() => setMode("login")}>
                Already have an account?
              </button>
            )}

            {mode === "forgot" && (
              <button onClick={() => setMode("login")}>
                Back to login
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}