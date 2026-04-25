// src/app/login/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserClient(), []);
  
  const [isToggled, setIsToggled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  
  // Sign Up State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
  
  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  // Set initial toggled state (Sign Up visible on left by default)
  useEffect(() => {
    setIsToggled(true); // Start with Sign Up panel active (left side)
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!signInEmail || !signInPassword) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password");
        }
        throw error;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";
        router.push(isAdmin ? "/admin" : "/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!signUpName || !signUpEmail || !signUpPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (signUpPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          data: {
            full_name: signUpName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setMessage("Account created! Check your email to verify your account.");
      setSignUpName("");
      setSignUpEmail("");
      setSignUpPassword("");
      setSignUpConfirmPassword("");
      
      setTimeout(() => {
        setIsToggled(false); // Switch to sign in after 3 seconds
        setMessage("");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!forgotEmail) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setMessage("Password reset email sent! Check your inbox.");
      setForgotEmail("");
      
      setTimeout(() => {
        setShowForgot(false);
        setMessage("");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Google sign in failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blueprint-950 via-blueprint-900 to-blueprint-800 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blueprint-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-5xl">
        {/* Main Auth Wrapper */}
        <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          
          <div className="relative grid lg:grid-cols-2 min-h-[650px]">
            
            {/* LEFT PANEL - Sign Up Section */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                {isToggled ? (
                  // Sign Up Form (Left Side - Active)
                  <motion.div
                    key="signup-form"
                    initial={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-white p-10 lg:p-12 overflow-y-auto"
                  >
                    <div className="text-center mb-8">
                      <div className="flex justify-center mb-6">
                        <div className="relative w-36 h-12">
                          <Image
                            src="/images/tefetro-logo.png"
                            alt="Tefetro Studios"
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                      </div>
                      <h1 className="text-2xl font-bold text-blueprint-900">Create Account</h1>
                      <p className="text-neutral-500 mt-2">Join Tefetro Studios today</p>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"
                      >
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <p className="text-red-700 text-sm flex-1">{error}</p>
                      </motion.div>
                    )}

                    {message && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <p className="text-green-700 text-sm flex-1">{message}</p>
                      </motion.div>
                    )}

                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <input
                            type="text"
                            value={signUpName}
                            onChange={(e) => setSignUpName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:border-blueprint-500 focus:ring-2 focus:ring-blueprint-500/20 outline-none transition-all"
                            placeholder="John Doe"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <input
                            type="email"
                            value={signUpEmail}
                            onChange={(e) => setSignUpEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:border-blueprint-500 focus:ring-2 focus:ring-blueprint-500/20 outline-none transition-all"
                            placeholder="you@example.com"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <input
                            type={showSignUpPassword ? "text" : "password"}
                            value={signUpPassword}
                            onChange={(e) => setSignUpPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-3 border border-neutral-200 rounded-xl focus:border-blueprint-500 focus:ring-2 focus:ring-blueprint-500/20 outline-none transition-all"
                            placeholder="••••••••"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showSignUpPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <input
                            type={showSignUpConfirmPassword ? "text" : "password"}
                            value={signUpConfirmPassword}
                            onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-3 border border-neutral-200 rounded-xl focus:border-blueprint-500 focus:ring-2 focus:ring-blueprint-500/20 outline-none transition-all"
                            placeholder="••••••••"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showSignUpConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-blueprint-600 to-deep-600 hover:from-blueprint-700 hover:to-deep-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="relative my-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-neutral-500">Or continue with</span>
                      </div>
                    </div>

                    <button
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-neutral-700 font-medium">Google</span>
                    </button>

                    <p className="mt-6 text-center text-sm text-neutral-500">
                      Already have an account?{" "}
                      <button
                        onClick={() => setIsToggled(false)}
                        className="text-blueprint-600 hover:text-blueprint-700 font-semibold"
                      >
                        Sign in
                      </button>
                    </p>
                  </motion.div>
                ) : (
                  // Welcome Panel (Left Side - Inactive)
                  <motion.div
                    key="signup-welcome"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col justify-center p-10 lg:p-12 bg-gradient-to-br from-blueprint-800 to-blueprint-900"
                  >
                    <div className="text-center">
                      <div className="relative w-36 h-12 mx-auto mb-8">
                        <Image
                          src="/images/tefetro-logo.png"
                          alt="Tefetro Studios"
                          fill
                          className="object-contain brightness-0 invert"
                        />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-4">Welcome Back!</h2>
                      <p className="text-blueprint-200 text-lg mb-8">
                        Sign in to continue your architectural journey.
                      </p>
                      <div className="space-y-3 text-left">
                        <div className="flex items-center gap-3 text-blueprint-100">
                          <CheckCircle className="w-5 h-5 text-accent-500" />
                          <span>Access your purchased plans</span>
                        </div>
                        <div className="flex items-center gap-3 text-blueprint-100">
                          <CheckCircle className="w-5 h-5 text-accent-500" />
                          <span>Download drawings instantly</span>
                        </div>
                        <div className="flex items-center gap-3 text-blueprint-100">
                          <CheckCircle className="w-5 h-5 text-accent-500" />
                          <span>Track your construction projects</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsToggled(true)}
                        className="mt-8 px-6 py-2 border-2 border-white/30 rounded-lg text-white font-medium hover:bg-white/10 transition-all"
                      >
                        Create an Account →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT PANEL - Sign In Section */}
            <div className="relative overflow-hidden bg-white">
              <AnimatePresence mode="wait">
                {!isToggled ? (
                  // Sign In Form (Right Side - Active)
                  <motion.div
                    key="signin-form"
                    initial={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 p-10 lg:p-12 overflow-y-auto"
                  >
                    <div className="text-center mb-8">
                      <div className="flex justify-center mb-6">
                        <div className="relative w-36 h-12">
                          <Image
                            src="/images/tefetro-logo.png"
                            alt="Tefetro Studios"
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                      </div>
                      <h1 className="text-2xl font-bold text-blueprint-900">Sign In</h1>
                      <p className="text-neutral-500 mt-2">Access your Tefetro account</p>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"
                      >
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <p className="text-red-700 text-sm flex-1">{error}</p>
                      </motion.div>
                    )}

                    {message && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <p className="text-green-700 text-sm flex-1">{message}</p>
                      </motion.div>
                    )}

                    <form onSubmit={handleSignIn} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <input
                            type="email"
                            value={signInEmail}
                            onChange={(e) => setSignInEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:border-blueprint-500 focus:ring-2 focus:ring-blueprint-500/20 outline-none transition-all"
                            placeholder="you@example.com"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                          <input
                            type={showSignInPassword ? "text" : "password"}
                            value={signInPassword}
                            onChange={(e) => setSignInPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-3 border border-neutral-200 rounded-xl focus:border-blueprint-500 focus:ring-2 focus:ring-blueprint-500/20 outline-none transition-all"
                            placeholder="••••••••"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignInPassword(!showSignInPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showSignInPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blueprint-600 hover:bg-blueprint-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setShowForgot(true)}
                        className="text-sm text-blueprint-600 hover:text-blueprint-700 font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative my-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-neutral-500">Or continue with</span>
                      </div>
                    </div>

                    <button
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-neutral-700 font-medium">Google</span>
                    </button>
                  </motion.div>
                ) : (
                  // Welcome Panel (Right Side - Inactive)
                  <motion.div
                    key="signin-welcome"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col justify-center p-10 lg:p-12 bg-gradient-to-br from-blueprint-800 to-blueprint-900"
                  >
                    <div className="text-center">
                      <div className="relative w-36 h-12 mx-auto mb-8">
                        <Image
                          src="/images/tefetro-logo.png"
                          alt="Tefetro Studios"
                          fill
                          className="object-contain brightness-0 invert"
                        />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-4">Join Tefetro!</h2>
                      <p className="text-blueprint-200 text-lg mb-8">
                        Create an account to start building your dream project.
                      </p>
                      <div className="space-y-3 text-left">
                        <div className="flex items-center gap-3 text-blueprint-100">
                          <span className="text-2xl">🏗️</span>
                          <span>Access 500+ architectural plans</span>
                        </div>
                        <div className="flex items-center gap-3 text-blueprint-100">
                          <span className="text-2xl">📐</span>
                          <span>Get professional BOQ services</span>
                        </div>
                        <div className="flex items-center gap-3 text-blueprint-100">
                          <span className="text-2xl">🎨</span>
                          <span>Interior design packages available</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Forgot Password Modal */}
        <AnimatePresence>
          {showForgot && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowForgot(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-blueprint-900">Reset Password</h2>
                  <p className="text-neutral-500 mt-2">We'll send you a reset link</p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 text-sm flex-1">{error}</p>
                  </div>
                )}

                {message && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-green-700 text-sm flex-1">{message}</p>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:border-blueprint-500 focus:ring-2 focus:ring-blueprint-500/20 outline-none transition-all"
                        placeholder="you@example.com"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blueprint-600 hover:bg-blueprint-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center mt-6 text-white/60 text-sm">
          <p>
            By continuing, you agree to Tefetro's{" "}
            <Link href="/terms" className="text-accent-400 hover:text-accent-300">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-accent-400 hover:text-accent-300">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}