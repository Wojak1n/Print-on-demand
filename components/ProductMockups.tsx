import React from 'react';

interface MockupProps {
  color: string;
  className?: string;
  baseImage?: string;
}

export const CustomMockup: React.FC<MockupProps> = ({ color, className, baseImage }) => {
  if (!baseImage) {
    return (
      <div className={`relative ${className} flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg`}>
        <div className="text-center text-gray-400 p-8">
          <p className="text-sm font-semibold">No Product Image</p>
          <p className="text-xs mt-1">Upload a product image</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <img
        src={baseImage}
        alt="Custom Mockup"
        className="w-full h-full object-contain relative z-0"
      />
    </div>
  );
};

export const TshirtSVG: React.FC<MockupProps> = ({ color, className }) => (
  <svg viewBox="0 0 500 500" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tee-fold-left" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#000" stopOpacity="0.1"/>
        <stop offset="100%" stopColor="#000" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id="tee-fold-right" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#000" stopOpacity="0.1"/>
        <stop offset="100%" stopColor="#000" stopOpacity="0"/>
      </linearGradient>
      <filter id="fabric-texture">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise"/>
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" in="noise" result="coloredNoise"/>
      </filter>
      <filter id="drop">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.2"/>
      </filter>
    </defs>
    
    <g filter="url(#drop)">
      {/* Base Shape */}
      <path 
        d="M160 80 C 160 80, 190 110, 250 110 C 310 110, 340 80, 340 80 L 430 120 L 410 190 L 360 170 L 360 460 L 140 460 L 140 170 L 90 190 L 70 120 Z" 
        fill={color}
      />
      
      {/* Inner Neck Shadow */}
      <path d="M160 80 C 190 110, 310 110, 340 80 C 310 95, 190 95, 160 80" fill="#000" fillOpacity="0.2"/>
      
      {/* Sleeve Shadows */}
      <path d="M70 120 L 140 170 L 140 150 Z" fill="url(#tee-fold-left)" />
      <path d="M430 120 L 360 170 L 360 150 Z" fill="url(#tee-fold-right)" />

      {/* Body Wrinkles (Left Side) */}
      <path d="M140 250 Q 160 300 140 350" fill="none" stroke="#000" strokeWidth="2" strokeOpacity="0.05" />
      <path d="M140 170 Q 160 220 150 280" fill="none" stroke="#000" strokeWidth="3" strokeOpacity="0.03" />

      {/* Body Wrinkles (Right Side) */}
      <path d="M360 250 Q 340 300 360 350" fill="none" stroke="#000" strokeWidth="2" strokeOpacity="0.05" />
      <path d="M360 170 Q 340 220 350 280" fill="none" stroke="#000" strokeWidth="3" strokeOpacity="0.03" />
      
      {/* Hem Shadow */}
      <path d="M140 450 L 360 450 L 360 460 L 140 460 Z" fill="#000" fillOpacity="0.1" />
      
      {/* Collar Detail */}
      <path d="M160 80 C 190 110, 310 110, 340 80" fill="none" stroke="#fff" strokeWidth="1" strokeOpacity="0.3" />
      <path d="M160 80 C 190 110, 310 110, 340 80" fill="none" stroke="#000" strokeWidth="3" strokeOpacity="0.1" />
    </g>
  </svg>
);

export const HoodieSVG: React.FC<MockupProps> = ({ color, className }) => (
  <svg viewBox="0 0 500 500" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="hoodie-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#000" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="#000" stopOpacity="0"/>
      </linearGradient>
      <radialGradient id="pocket-shadow" cx="50%" cy="0%" r="100%">
         <stop offset="0%" stopColor="#000" stopOpacity="0.15"/>
         <stop offset="100%" stopColor="#000" stopOpacity="0"/>
      </radialGradient>
    </defs>

    <g filter="url(#drop)">
      {/* Arms Back */}
      <path d="M80 140 L 150 430 L 180 430 L 150 180" fill={color} fillOpacity="1" />
      <path d="M420 140 L 350 430 L 320 430 L 350 180" fill={color} fillOpacity="1" />

      {/* Body */}
      <path 
        d="M150 100 L 130 160 L 140 180 L 150 460 L 350 460 L 360 180 L 370 160 L 350 100 Z" 
        fill={color}
      />
      
      {/* Hood */}
      <path d="M150 100 C 150 50 350 50 350 100 L 350 150 C 300 180 200 180 150 150 Z" fill={color} />
      <path d="M150 100 C 150 50 350 50 350 100" fill="none" stroke="#000" strokeOpacity="0.1" strokeWidth="1" />
      
      {/* Hood Inner Shadow */}
      <path d="M150 150 C 200 180 300 180 350 150 C 320 140 180 140 150 150" fill="#000" fillOpacity="0.3" />

      {/* Sleeves Front */}
      <path d="M130 160 L 80 220 L 110 240 L 140 180" fill={color} />
      <path d="M370 160 L 420 220 L 390 240 L 360 180" fill={color} />
      
      {/* Pocket */}
      <path d="M180 350 L 320 350 L 340 440 L 160 440 Z" fill={color} />
      <path d="M180 350 L 320 350 L 340 440 L 160 440 Z" fill="url(#pocket-shadow)" />
      <path d="M180 350 L 160 440" stroke="#000" strokeOpacity="0.1" strokeWidth="1"/>
      <path d="M320 350 L 340 440" stroke="#000" strokeOpacity="0.1" strokeWidth="1"/>

      {/* Cuffs */}
      <rect x="150" y="440" width="200" height="20" fill={color} />
      <rect x="150" y="440" width="200" height="20" fill="url(#hoodie-shadow)" />
      <line x1="150" y1="440" x2="350" y2="440" stroke="#000" strokeOpacity="0.1" />
      
      {/* Drawstrings */}
      <path d="M220 160 Q 225 200 220 250" fill="none" stroke="#fff" strokeWidth="3" />
      <path d="M280 160 Q 275 200 280 250" fill="none" stroke="#fff" strokeWidth="3" />
      <circle cx="220" cy="160" r="3" fill="#000" fillOpacity="0.5"/>
      <circle cx="280" cy="160" r="3" fill="#000" fillOpacity="0.5"/>
    </g>
  </svg>
);

export const SweaterSVG: React.FC<MockupProps> = ({ color, className }) => (
  <svg viewBox="0 0 500 500" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
       <pattern id="knit-pattern" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M0 0 L4 4 M4 0 L0 4" stroke="#000" strokeWidth="0.5" strokeOpacity="0.03" />
       </pattern>
       <linearGradient id="sweater-body-shade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.1" />
          <stop offset="20%" stopColor="#000" stopOpacity="0" />
          <stop offset="80%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.1" />
       </linearGradient>
    </defs>
    
    <g filter="url(#drop)">
      {/* Main Body */}
      <path 
        d="M140 100 C 160 110 340 110 360 100 L 430 140 L 400 460 L 100 460 L 70 140 Z" 
        fill={color}
      />
      {/* Knit Texture Overlay */}
      <path 
        d="M140 100 C 160 110 340 110 360 100 L 430 140 L 400 460 L 100 460 L 70 140 Z" 
        fill="url(#knit-pattern)"
      />
      {/* Body Shading */}
      <path 
        d="M140 100 C 160 110 340 110 360 100 L 430 140 L 400 460 L 100 460 L 70 140 Z" 
        fill="url(#sweater-body-shade)"
      />

      {/* Collar */}
      <path d="M140 100 C 160 130 340 130 360 100" fill="none" stroke={color} strokeWidth="15" />
      <path d="M140 100 C 160 130 340 130 360 100" fill="none" stroke="#000" strokeWidth="15" strokeOpacity="0.05" strokeDasharray="2 2"/>
      
      {/* Cuffs */}
      <path d="M70 140 L 100 460" fill="none" stroke="#000" strokeOpacity="0.05" strokeWidth="1"/>
      <path d="M430 140 L 400 460" fill="none" stroke="#000" strokeOpacity="0.05" strokeWidth="1"/>
      
      {/* Bottom Ribbing */}
      <rect x="100" y="440" width="300" height="20" fill="#000" fillOpacity="0.05" />
      <line x1="100" y1="440" x2="400" y2="440" stroke="#000" strokeOpacity="0.1" />
    </g>
  </svg>
);

export const CapSVG: React.FC<MockupProps> = ({ color, className }) => (
  <svg viewBox="0 0 500 500" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="brim-shine" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.1"/>
        <stop offset="100%" stopColor="#000" stopOpacity="0.2"/>
      </linearGradient>
      <radialGradient id="cap-dome" cx="50%" cy="30%" r="70%">
         <stop offset="0%" stopColor="#fff" stopOpacity="0.1"/>
         <stop offset="100%" stopColor="#000" stopOpacity="0.2"/>
      </radialGradient>
    </defs>
    
    <g filter="url(#drop)">
      {/* Back Strap area */}
      <path d="M180 320 Q 250 340 320 320" fill="none" stroke="#000" strokeWidth="4" strokeOpacity="0.2"/>

      {/* Brim */}
      <path 
        d="M140 300 Q 250 400 360 300 L 370 320 Q 250 450 130 320 Z" 
        fill={color} 
      />
      <path 
        d="M140 300 Q 250 400 360 300 L 370 320 Q 250 450 130 320 Z" 
        fill="url(#brim-shine)" 
      />

      {/* Dome Panels */}
      <path 
        d="M140 300 Q 120 150 250 120 Q 380 150 360 300 Q 250 280 140 300" 
        fill={color}
      />
      <path 
        d="M140 300 Q 120 150 250 120 Q 380 150 360 300 Q 250 280 140 300" 
        fill="url(#cap-dome)"
      />
      
      {/* Seams */}
      <path d="M250 120 Q 200 200 190 300" fill="none" stroke="#000" strokeWidth="1" strokeOpacity="0.2" />
      <path d="M250 120 Q 300 200 310 300" fill="none" stroke="#000" strokeWidth="1" strokeOpacity="0.2" />
      <path d="M250 120 L 250 290" fill="none" stroke="#000" strokeWidth="1" strokeOpacity="0.2" />

      {/* Button */}
      <circle cx="250" cy="120" r="8" fill={color} />
      <circle cx="250" cy="120" r="8" fill="url(#cap-dome)" />
      
      {/* Vent Holes */}
      <circle cx="190" cy="200" r="3" fill="#000" fillOpacity="0.4" />
      <circle cx="310" cy="200" r="3" fill="#000" fillOpacity="0.4" />
    </g>
  </svg>
);