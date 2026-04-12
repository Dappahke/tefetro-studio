"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient();

  // Check if user has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // For password reset, we need a session from the recovery link
      if (!session) {
        setError("Invalid or expired reset link. Please request a new one.");
      }
      setValidating(false);
    };
    
    checkSession();
  }, [supabase]);

  const validatePassword = () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePassword()) return;

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      
      // Sign out after password reset for security
      await supabase.auth.signOut();
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/login?message=password_updated");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-stone-100 flex items-center justify-center p-4">
        <div className="flex items-center gap-3">
          <div className="animate-spin h-6 w-6 border-3 border-stone-400 border-t-transparent rounded-full"></div>
          <span className="text-stone-600">Validating reset link...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Glass Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10">
          
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-stone-800 text-center">
              {success ? "Password Updated!" : "Reset Your Password"}
            </h1>
            <p className="text-stone-500 text-sm mt-2 text-center">
              {success 
                ? "Your password has been successfully changed" 
                : "Create a new secure password for your account"}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-red-700 text-sm font-medium">{error}</p>
                {error.includes("expired") && (
                  <Link 
                    href="/login?mode=forgot" 
                    className="text-red-600 text-sm underline mt-1 inline-block hover:text-red-800"
                  >
                    Request new reset link
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Success State */}
          {success ? (
            <div className="text-center space-y-6 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-stone-600 text-sm">
                Redirecting you to login...
              </p>
              <div className="w-full bg-stone-200 rounded-full h-1 overflow-hidden">
                <div className="bg-stone-800 h-full animate-[shrink_2s_linear_forwards]" style={{ width: '100%' }}></div>
              </div>
            </div>
          ) : error.includes("expired") ? (
            /* Expired Link State */
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-stone-800 hover:bg-stone-900 text-white font-semibold rounded-xl transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
              </Link>
            </div>
          ) : (
            /* Reset Form */
            <form onSubmit={handleReset} className="space-y-5">
              {/* New Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full px-4 py-3 pr-12 border border-stone-300 rounded-xl bg-white/50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Password strength indicator */}
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= i * 2
                          ? password.length >= 8
                            ? "bg-green-500"
                            : "bg-amber-500"
                          : "bg-stone-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  {password.length < 6 
                    ? "Password must be at least 6 characters" 
                    : password.length < 8 
                      ? "Good password" 
                      : "Strong password"}
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className={`w-full px-4 py-3 border rounded-xl bg-white/50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-sage-500/20 ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-300 focus:border-red-500"
                      : "border-stone-300 focus:border-sage-500"
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                className="w-full py-3 px-4 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          )}

          {/* Back to Login */}
          {!success && !error.includes("expired") && (
            <div className="mt-6 text-center">
              <Link 
                href="/login" 
                className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}