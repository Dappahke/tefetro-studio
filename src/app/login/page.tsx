"use client";

import { useState, useMemo } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  // ✅ Create Supabase client ONCE
  const supabase = useMemo(() => createBrowserClient(), []);

  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // 🔍 Check if user is admin/super_admin and redirect accordingly
  const handlePostLoginRedirect = async (userId: string) => {
    try {
      // Fetch user profile to check role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        // Default to dashboard if profile fetch fails
        router.push("/dashboard");
        return;
      }

      // Redirect: admin OR super_admin → /admin, user → /dashboard
      const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";
      router.push(isAdmin ? "/admin" : "/dashboard");
    } catch (err) {
      console.error("Redirect error:", err);
      router.push("/dashboard");
    } finally {
      router.refresh();
    }
  };

  // 🔐 EMAIL LOGIN / SIGNUP / RESET
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setFieldErrors({});

    // Validation
    const errors: Record<string, string> = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Please enter a valid email";
    
    if (mode !== "forgot") {
      if (!password) errors.password = "Password is required";
      else if (password.length < 6) errors.password = "Password must be at least 6 characters";
      
      if (mode === "signup" && password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        setMessage("Account created! Check your email to verify your account.");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }

      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Invalid email or password");
          }
          throw error;
        }

        // Check role and redirect
        if (data.user) {
          await handlePostLoginRedirect(data.user.id);
        }
      }

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;

        setMessage("Password reset email sent. Check your inbox.");
        setEmail("");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 GOOGLE LOGIN
  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
      // Note: Google OAuth redirect is handled by the callback route
    } catch (err: any) {
      setError(err.message || "Failed to connect with Google");
      setLoading(false);
    }
  };

  // Switch modes with reset
  const switchMode = (newMode: "login" | "signup" | "forgot") => {
    setMode(newMode);
    setError("");
    setMessage("");
    setFieldErrors({});
    if (newMode !== "signup") setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Glass Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10">
          
          {/* TEFETRO LOGO */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-12 mb-4">
              <Image
                src="/images/tefetro-logo.png"
                alt="Tefetro"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-stone-800 text-center">
              {mode === "login" && "Welcome Back"}
              {mode === "signup" && "Create Your Account"}
              {mode === "forgot" && "Reset Your Password"}
            </h1>
            <p className="text-stone-500 text-sm mt-2 text-center">
              {mode === "login" && "Sign in to access your Tefetro account"}
              {mode === "signup" && "Join Tefetro for exclusive wellness benefits"}
              {mode === "forgot" && "Enter your email to receive reset instructions"}
            </p>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}

          {/* GOOGLE AUTH */}
          {mode !== "forgot" && (
            <>
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-stone-300 rounded-xl bg-white hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-stone-700 font-medium">Continue with Google</span>
              </button>

              {/* DIVIDER */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/80 text-stone-500">or continue with email</span>
                </div>
              </div>
            </>
          )}

          {/* FORM */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {/* EMAIL INPUT */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-3 border rounded-xl bg-white/50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-sage-500/20 ${
                  fieldErrors.email ? "border-red-300 focus:border-red-500" : "border-stone-300 focus:border-sage-500"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* PASSWORD INPUT */}
            {mode !== "forgot" && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder={mode === "signup" ? "Create a password (min 6 chars)" : "Enter your password"}
                  className={`w-full px-4 py-3 border rounded-xl bg-white/50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-sage-500/20 ${
                    fieldErrors.password ? "border-red-300 focus:border-red-500" : "border-stone-300 focus:border-sage-500"
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                )}
              </div>
            )}

            {/* CONFIRM PASSWORD (Signup only) */}
            {mode === "signup" && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 border rounded-xl bg-white/50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-sage-500/20 ${
                    fieldErrors.confirmPassword ? "border-red-300 focus:border-red-500" : "border-stone-300 focus:border-sage-500"
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-stone-800 hover:bg-stone-900 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : mode === "login" ? (
                "Sign In"
              ) : mode === "signup" ? (
                "Create Account"
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* MODE SWITCHERS */}
          <div className="mt-8 text-center space-y-3">
            {mode === "login" && (
              <>
                <p className="text-stone-600 text-sm">
                  Don't have an account?{" "}
                  <button
                    onClick={() => switchMode("signup")}
                    className="text-sage-600 hover:text-sage-700 font-semibold underline underline-offset-2"
                  >
                    Sign up
                  </button>
                </p>
                <button
                  onClick={() => switchMode("forgot")}
                  className="text-stone-500 hover:text-stone-700 text-sm"
                >
                  Forgot your password?
                </button>
              </>
            )}

            {mode === "signup" && (
              <p className="text-stone-600 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="text-sage-600 hover:text-sage-700 font-semibold underline underline-offset-2"
                >
                  Sign in
                </button>
              </p>
            )}

            {mode === "forgot" && (
              <button
                onClick={() => switchMode("login")}
                className="text-stone-600 hover:text-stone-800 text-sm flex items-center justify-center gap-1 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to sign in
              </button>
            )}
          </div>

          {/* FOOTER */}
          <div className="mt-8 pt-6 border-t border-stone-200 text-center">
            <p className="text-xs text-stone-400">
              By continuing, you agree to Tefetro's{" "}
              <Link href="/terms" className="underline hover:text-stone-600">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline hover:text-stone-600">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}