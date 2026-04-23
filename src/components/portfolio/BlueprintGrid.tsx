// ============================================================
// BLUEPRINT GRID BACKGROUND COMPONENT
// Subtle technical drawing aesthetic
// ============================================================

'use client';

import React from 'react';

interface BlueprintGridProps {
  className?: string;
  opacity?: number;
}

export default function BlueprintGrid({ 
  className = '', 
  opacity = 0.03 
}: BlueprintGridProps) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* Main grid */}
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern 
            id="blueprint-grid" 
            width="40" 
            height="40" 
            patternUnits="userSpaceOnUse"
          >
            {/* Major grid lines */}
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke="#0f2a44" 
              strokeWidth="0.5"
            />
            {/* Minor grid dots */}
            <circle cx="20" cy="20" r="0.5" fill="#0f2a44" />
          </pattern>

          {/* Diagonal hatch pattern for technical feel */}
          <pattern 
            id="diagonal-hatch" 
            width="10" 
            height="10" 
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line 
              x1="0" y1="0" x2="0" y2="10" 
              stroke="#0f2a44" 
              strokeWidth="0.3" 
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
        <rect 
          width="100%" 
          height="100%" 
          fill="url(#diagonal-hatch)" 
          opacity="0.5" 
        />
      </svg>

      {/* Corner technical marks */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#0f2a44]" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#0f2a44]" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#0f2a44]" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#0f2a44]" />
    </div>
  );
}



//✅ FILE 4: src/components/portfolio/BlueprintGrid.tsx
//🎨 Features: SVG grid pattern, diagonal hatch, corner technical marks