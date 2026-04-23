// ============================================================
// OUR WORK PAGE - ERROR BOUNDARY
// Handles data fetching errors gracefully
// ============================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function OurWorkError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 
                      flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#0f2a44] mb-3">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-2">
          We encountered an error while loading our portfolio.
        </p>

        {/* Error Message (in development) */}
        {process.env.NODE_ENV === 'development' && (
          <p className="text-sm text-red-500 mb-6 font-mono bg-red-50 p-3 rounded-lg">
            {error.message}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 
                     px-6 py-3 bg-[#0f2a44] hover:bg-[#1f4e79] 
                     text-white font-semibold rounded-lg 
                     transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 
                     px-6 py-3 border-2 border-gray-200 
                     hover:border-[#0f2a44] text-[#0f2a44] 
                     font-semibold rounded-lg transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}



//✅ FILE 15: src/app/our-work/error.tsx
//🎯 Features: Error display, retry button, home navigation
//🔧 Dev mode: Shows actual error message for debugging