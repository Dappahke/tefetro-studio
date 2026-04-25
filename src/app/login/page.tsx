// src/app/login/page.tsx
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

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

  useEffect(() => {
    setIsToggled(true);
  }, []);

  const clearMessages = useCallback(() => {
    setError("");
    setMessage("");
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

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
    clearMessages();

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
          data: { full_name: signUpName },
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
        setIsToggled(false);
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
    clearMessages();

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
    clearMessages();

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Google sign in failed");
      setLoading(false);
    }
  };

  /* ── Shared Components ── */
  const AlertBox = ({ type, text }: { type: "error" | "success"; text: string }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 p-3 ${
        type === "error"
          ? "bg-red-50 border-red-200"
          : "bg-green-50 border-green-200"
      } border rounded-xl flex items-center gap-2`}
    >
      {type === "error" ? (
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
      ) : (
        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
      )}
      <p
        className={`text-sm flex-1 ${
          type === "error" ? "text-red-700" : "text-green-700"
        }`}
      >
        {text}
      </p>
    </motion.div>
  );

  const InputWrapper = ({
    icon,
    type,
    value,
    onChange,
    placeholder,
    disabled,
    label,
    rightElement,
  }: {
    icon: React.ReactNode;
    type: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    disabled: boolean;
    label: string;
    rightElement?: React.ReactNode;
  }) => (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:border-blueprint-500 focus:ring-2 focus:ring-blueprint-500/20 outline-none transition-all disabled:opacity-50"
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );

  const SubmitButton = ({ text }: { text: string }) => (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 bg-gradient-to-r from-blueprint-600 to-deep-600 hover:from-blueprint-700 hover:to-deep-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {text}
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );

  const GoogleButton = () => (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all disabled:opacity-50"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span className="text-neutral-700 font-medium">Google</span>
    </button>
  );

  const Divider = () => (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-neutral-200" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-white text-neutral-500">Or continue with</span>
      </div>
    </div>
  );

  /* ── Form Content ── */
  const SignUpForm = () => (
    <div className="h-full flex flex-col justify-center">
      <div className="text-center mb-6 md:mb-8">
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="relative w-28 h-10 md:w-36 md:h-12">
            <Image
              src="/images/tefetro-logo.png"
              alt="Tefetro Studios"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-blueprint-900">
          Create Account
        </h1>
        <p className="text-neutral-500 mt-1 md:mt-2 text-sm md:text-base">
          Join Tefetro Studios today
        </p>
      </div>

      {error && <AlertBox type="error" text={error} />}
      {message && <AlertBox type="success" text={message} />}

      <form onSubmit={handleSignUp} className="space-y-3 md:space-y-4">
        <InputWrapper
          icon={<User className="w-5 h-5" />}
          type="text"
          value={signUpName}
          onChange={setSignUpName}
          placeholder="John Doe"
          disabled={loading}
          label="Full Name"
        />

        <InputWrapper
          icon={<Mail className="w-5 h-5" />}
          type="email"
          value={signUpEmail}
          onChange={setSignUpEmail}
          placeholder="you@example.com"
          disabled={loading}
          label="Email Address"
        />

        <InputWrapper
          icon={<Lock className="w-5 h-5" />}
          type={showSignUpPassword ? "text" : "password"}
          value={signUpPassword}
          onChange={setSignUpPassword}
          placeholder="••••••••"
          disabled={loading}
          label="Password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowSignUpPassword(!showSignUpPassword)}
              className="text-neutral-400 hover:text-neutral-600"
            >
              {showSignUpPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          }
        />

        <InputWrapper
          icon={<Lock className="w-5 h-5" />}
          type={showSignUpConfirmPassword ? "text" : "password"}
          value={signUpConfirmPassword}
          onChange={setSignUpConfirmPassword}
          placeholder="••••••••"
          disabled={loading}
          label="Confirm Password"
          rightElement={
            <button
              type="button"
              onClick={() =>
                setShowSignUpConfirmPassword(!showSignUpConfirmPassword)
              }
              className="text-neutral-400 hover:text-neutral-600"
            >
              {showSignUpConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          }
        />

        <SubmitButton text="Create Account" />
      </form>

      <Divider />
      <GoogleButton />

      <p className="mt-4 md:mt-6 text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <button
          onClick={() => {
            setIsToggled(false);
            clearMessages();
          }}
          className="text-blueprint-600 hover:text-blueprint-700 font-semibold"
        >
          Sign in
        </button>
      </p>
    </div>
  );

  const SignInForm = () => (
    <div className="h-full flex flex-col justify-center">
      <div className="text-center mb-6 md:mb-8">
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="relative w-28 h-10 md:w-36 md:h-12">
            <Image
              src="/images/tefetro-logo.png"
              alt="Tefetro Studios"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-blueprint-900">
          Sign In
        </h1>
        <p className="text-neutral-500 mt-1 md:mt-2 text-sm md:text-base">
          Access your Tefetro account
        </p>
      </div>

      {error && <AlertBox type="error" text={error} />}
      {message && <AlertBox type="success" text={message} />}

      <form onSubmit={handleSignIn} className="space-y-4 md:space-y-5">
        <InputWrapper
          icon={<Mail className="w-5 h-5" />}
          type="email"
          value={signInEmail}
          onChange={setSignInEmail}
          placeholder="you@example.com"
          disabled={loading}
          label="Email Address"
        />

        <InputWrapper
          icon={<Lock className="w-5 h-5" />}
          type={showSignInPassword ? "text" : "password"}
          value={signInPassword}
          onChange={setSignInPassword}
          placeholder="••••••••"
          disabled={loading}
          label="Password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowSignInPassword(!showSignInPassword)}
              className="text-neutral-400 hover:text-neutral-600"
            >
              {showSignInPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          }
        />

        <div className="text-right">
          <button
            type="button"
            onClick={() => {
              setShowForgot(true);
              clearMessages();
            }}
            className="text-sm text-blueprint-600 hover:text-blueprint-700 font-medium"
          >
            Forgot password?
          </button>
        </div>

        <SubmitButton text="Sign In" />
      </form>

      <Divider />
      <GoogleButton />

      <p className="mt-4 md:mt-6 text-center text-sm text-neutral-500">
        Don't have an account?{" "}
        <button
          onClick={() => {
            setIsToggled(true);
            clearMessages();
          }}
          className="text-blueprint-600 hover:text-blueprint-700 font-semibold"
        >
          Create one
        </button>
      </p>
    </div>
  );

  const WelcomePanel = ({
    title,
    subtitle,
    points,
    ctaText,
    onCta,
  }: {
    title: string;
    subtitle: string;
    points: { icon: React.ReactNode; text: string }[];
    ctaText: string;
    onCta: () => void;
  }) => (
    <div className="h-full flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12">
      <div className="text-center">
        <div className="relative w-28 h-10 md:w-36 md:h-12 mx-auto mb-6 md:mb-8">
          <Image
            src="/images/tefetro-logo.png"
            alt="Tefetro Studios"
            fill
            className="object-contain brightness-0 invert"
          />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
          {title}
        </h2>
        <p className="text-blueprint-200 text-base md:text-lg mb-6 md:mb-8">
          {subtitle}
        </p>
        <div className="space-y-2 md:space-y-3 text-left max-w-xs mx-auto">
          {points.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-2 md:gap-3 text-blueprint-100 text-sm md:text-base"
            >
              {p.icon}
              <span>{p.text}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onCta}
          className="mt-6 md:mt-8 px-5 md:px-6 py-2 border-2 border-white/30 rounded-lg text-white font-medium hover:bg-white/10 transition-all text-sm md:text-base"
        >
          {ctaText}
        </button>
      </div>
    </div>
  );

  /* ── Main Render ── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blueprint-950 via-blueprint-900 to-blueprint-800 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 md:top-20 md:left-20 w-64 h-64 md:w-96 md:h-96 bg-blueprint-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-64 h-64 md:w-96 md:h-96 bg-accent-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-5xl">
        {/* Main Card */}
        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="relative grid lg:grid-cols-2 min-h-[500px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[650px]">
            {/* LEFT PANEL */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                {isToggled ? (
                  <motion.div
                    key="signup-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 bg-white p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 overflow-y-auto"
                  >
                    <SignUpForm />
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup-welcome"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-br from-blueprint-800 to-blueprint-900"
                  >
                    <WelcomePanel
                      title="Welcome Back!"
                      subtitle="Sign in to continue your architectural journey."
                      points={[
                        {
                          icon: <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-accent-500 shrink-0" />,
                          text: "Access your purchased plans",
                        },
                        {
                          icon: <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-accent-500 shrink-0" />,
                          text: "Download drawings instantly",
                        },
                        {
                          icon: <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-accent-500 shrink-0" />,
                          text: "Track your construction projects",
                        },
                      ]}
                      ctaText="Create an Account →"
                      onCta={() => {
                        setIsToggled(true);
                        clearMessages();
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT PANEL */}
            <div className="relative overflow-hidden hidden lg:block">
              <AnimatePresence mode="wait">
                {!isToggled ? (
                  <motion.div
                    key="signin-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 bg-white p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 overflow-y-auto"
                  >
                    <SignInForm />
                  </motion.div>
                ) : (
                  <motion.div
                    key="signin-welcome"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-br from-blueprint-800 to-blueprint-900"
                  >
                    <WelcomePanel
                      title="Join Tefetro!"
                      subtitle="Create an account to start building your dream project."
                      points={[
                        { icon: <span className="text-lg md:text-xl">🏗️</span>, text: "Access 500+ architectural plans" },
                        { icon: <span className="text-lg md:text-xl">📐</span>, text: "Get professional BOQ services" },
                        { icon: <span className="text-lg md:text-xl">🎨</span>, text: "Interior design packages available" },
                      ]}
                      ctaText="← Sign In Instead"
                      onCta={() => {
                        setIsToggled(false);
                        clearMessages();
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile: Show sign in form below when toggled */}
            <div className="relative overflow-hidden lg:hidden bg-white">
              <AnimatePresence mode="wait">
                {!isToggled ? (
                  <motion.div
                    key="signin-form-mobile"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 p-5 sm:p-6 md:p-8 overflow-y-auto"
                  >
                    <SignInForm />
                  </motion.div>
                ) : (
                  <motion.div
                    key="signin-welcome-mobile"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-br from-blueprint-800 to-blueprint-900"
                  >
                    <WelcomePanel
                      title="Join Tefetro!"
                      subtitle="Create an account to start building your dream project."
                      points={[
                        { icon: <span className="text-lg">🏗️</span>, text: "Access 500+ architectural plans" },
                        { icon: <span className="text-lg">📐</span>, text: "Get professional BOQ services" },
                        { icon: <span className="text-lg">🎨</span>, text: "Interior design packages available" },
                      ]}
                      ctaText="← Sign In Instead"
                      onCta={() => {
                        setIsToggled(false);
                        clearMessages();
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 md:mt-6 text-white/60 text-xs md:text-sm">
          <p>
            By continuing, you agree to Tefetro's{" "}
            <Link href="/terms" className="text-accent-400 hover:text-accent-300 transition">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-accent-400 hover:text-accent-300 transition">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
            onClick={() => setShowForgot(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 max-w-md w-full shadow-xl"
            >
              <div className="text-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-blueprint-900">
                  Reset Password
                </h2>
                <p className="text-neutral-500 mt-1 md:mt-2 text-sm md:text-base">
                  We'll send you a reset link
                </p>
              </div>

              {error && <AlertBox type="error" text={error} />}
              {message && <AlertBox type="success" text={message} />}

              <form onSubmit={handleForgotPassword} className="space-y-4 md:space-y-5">
                <InputWrapper
                  icon={<Mail className="w-5 h-5" />}
                  type="email"
                  value={forgotEmail}
                  onChange={setForgotEmail}
                  placeholder="you@example.com"
                  disabled={loading}
                  label="Email Address"
                />

                <SubmitButton text="Send Reset Link" />

                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="w-full text-center text-sm text-neutral-500 hover:text-blueprint-600 transition py-2"
                >
                  ← Back to sign in
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}