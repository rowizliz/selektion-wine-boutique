// PremiumFlavorIcons.tsx – New cohesive icon set matching Wine Folly outline style

import React from 'react';

interface IconProps {
  className?: string;
}

// NOTE: All icons use viewBox="0 0 24 24", stroke="currentColor", strokeWidth="2",
// strokeLinecap="round", strokeLinejoin="round", and no fill for a clean outline look.

// --- Fruit Icons ---
export const CherryIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2c-2 0-4 1-5 3-1 2-1 5 0 7 1 2 3 3 5 3s4-1 5-3c1-2 1-5 0-7-1-2-3-3-5-3z" />
        <path d="M12 12v6" />
        <path d="M9 15h6" />
    </svg>
);

export const StrawberryIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2c-3 0-5 2-5 5 0 2 1 4 3 5l2 8 2-8c2-1 3-3 3-5 0-3-2-5-5-5z" />
        <path d="M9 7l1 1M12 6l0 1M15 7l-1 1" strokeWidth="1.5" />
    </svg>
);

export const RaspberryIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2c-3 0-5 2-5 5 0 2 1 4 3 5l2 8 2-8c2-1 3-3 3-5 0-3-2-5-5-5z" />
        <path d="M9 7l1 1M12 6l0 1M15 7l-1 1" strokeWidth="1.5" />
    </svg>
);

export const GrapeIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M5 12h4" />
        <path d="M15 12h4" />
    </svg>
);

export const AppleIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 2c-1 2-1 4 0 5" />
        <path d="M15 2c1 2 1 4 0 5" />
        <path d="M7 7c-3 3-3 9 0 12s9 3 12 0 3-9 0-12-9-3-12 0z" />
    </svg>
);

export const CitrusIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M5 12h4" />
        <path d="M15 12h4" />
    </svg>
);

export const PlumIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="13" r="7" />
        <path d="M12 6v-3" />
        <path d="M9 7l1 1M12 6l0 1M15 7l-1 1" strokeWidth="1.5" />
    </svg>
);

export const PeachIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2c-4 0-7 3-7 7 0 5 4 10 7 10s7-5 7-10c0-4-3-7-7-7z" />
        <path d="M12 2v3" />
        <path d="M9 5l2-1" />
        <path d="M15 5l-2-1" />
    </svg>
);

export const PearIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 2c-1 2-1 4 0 5" />
        <path d="M15 2c1 2 1 4 0 5" />
        <path d="M7 7c-2 3-2 9 0 12s9 3 12 0 2-9 0-12-9-3-12 0z" />
    </svg>
);

export const BananaIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 12c0-4 4-8 8-8s8 4 8 8-4 8-8 8-8-4-8-8z" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
    </svg>
);

// --- Floral & Plant ---
export const RoseIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2c-2 2-2 5 0 7 2-2 2-5 0-7z" />
        <path d="M12 9c-2 2-2 5 0 7 2-2 2-5 0-7z" />
        <path d="M12 16c-2 2-2 5 0 7 2-2 2-5 0-7z" />
    </svg>
);

export const FlowerIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M5 5l3 3" />
        <path d="M19 5l-3 3" />
        <path d="M5 19l3-3" />
        <path d="M19 19l-3-3" />
    </svg>
);

export const VioletIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <ellipse cx="12" cy="6" rx="3" ry="4" />
        <ellipse cx="7" cy="11" rx="3" ry="4" transform="rotate(-30 7 11)" />
        <ellipse cx="17" cy="11" rx="3" ry="4" transform="rotate(30 17 11)" />
        <circle cx="12" cy="13" r="2" />
        <path d="M12 15v6" />
    </svg>
);

// --- Herbs ---
export const LeafIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 21s-2-10 6-17c8 7 6 17 6 17" />
        <path d="M12 4v17" />
        <path d="M9 12c2-1 4-1 6 0" strokeWidth="1.5" />
    </svg>
);

export const MintIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 21v-10" />
        <ellipse cx="12" cy="7" rx="4" ry="5" />
        <ellipse cx="7" cy="14" rx="3" ry="4" />
        <ellipse cx="17" cy="14" rx="3" ry="4" />
    </svg>
);

// --- Spices ---
export const VanillaIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M8 3c-1 6-1 12 0 18" />
        <path d="M12 3c-1 6-1 12 0 18" />
        <path d="M16 3c-1 6-1 12 0 18" />
    </svg>
);

export const PepperIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="8" cy="8" r="2.5" />
        <circle cx="16" cy="8" r="2.5" />
        <circle cx="12" cy="12" r="2.5" />
        <circle cx="8" cy="16" r="2.5" />
        <circle cx="16" cy="16" r="2.5" />
    </svg>
);

export const CinnamonIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 8h16c0 0 0 4-2 4H6c-2 0-2-4-2-4z" />
        <path d="M4 12h14c0 0 0 4-2 4H6c-2 0-2-4-2-4z" />
        <path d="M8 8v8M12 8v8" strokeWidth="1" opacity="0.4" />
    </svg>
);

// --- Wood & Earth ---
export const OakIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <ellipse cx="12" cy="4" rx="7" ry="2" />
        <ellipse cx="12" cy="20" rx="7" ry="2" />
        <path d="M5 4c-1 4-1 12 0 16" />
        <path d="M19 4c1 4 1 12 0 16" />
        <path d="M5 8h14" />
        <path d="M5 16h14" />
        <path d="M9 4v16M12 4v16M15 4v16" strokeWidth="1" opacity="0.4" />
    </svg>
);

export const EarthIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2l8 7-8 13-8-13 8-7z" />
        <path d="M4 9h16" />
        <path d="M8 9l4 13 4-13" strokeWidth="1.5" />
    </svg>
);

export const MushroomIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 13c0-5 4-9 8-9s8 4 8 9H4z" />
        <path d="M9 13v8h6v-8" />
    </svg>
);

// --- Sweet ---
export const ChocolateIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="4" y="6" width="16" height="12" rx="1" />
        <path d="M4 11h16" />
        <path d="M4 16h16" />
        <path d="M9 6v12M14 6v12" />
    </svg>
);

export const CoffeeIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <ellipse cx="12" cy="12" rx="5" ry="8" />
        <path d="M12 4c-1 5-1 11 0 16" strokeWidth="1.5" />
    </svg>
);

export const HoneyIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2l5 3v6l-5 3-5-3V5l5-3z" />
        <path d="M12 14l5 3v5l-5 3-5-3v-5l5-3z" />
    </svg>
);

export const CreamIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M7 10l5 12 5-12" />
        <path d="M12 10c3 0 5-2 5-5s-2-5-5-5-5 2-5 5 2 5 5 5z" />
        <path d="M9.5 16l5-5" strokeWidth="1.5" opacity="0.5" />
        <path d="M14.5 16l-5-5" strokeWidth="1.5" opacity="0.5" />
    </svg>
);

export const ButterIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 14h14l-2-6H7z" />
        <path d="M3 18h18" />
        <path d="M5 14v4" />
        <path d="M19 14v4" />
    </svg>
);

export const CheeseIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M13 4l8 5-7 5-10-4z" />
        <path d="M4 10l7 5v8l-7-5z" />
        <path d="M14 23v-9l7-5v7z" />
        <circle cx="8" cy="18" r="1.5" />
        <circle cx="17.5" cy="19.5" r="1" />
    </svg>
);

// --- Tobacco & Leather ---
export const TobaccoIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 6c2 0 3 1.5 3 2.5 0 1-1.5 1.5-2.5 1.5-4 0-7 2-9 6-1 2-2 3-4.5 3C2.5 19 1 17.5 1 14.5c0-3 2-4.5 4-5 .5 0 1 0 1.5.2C8 7.5 12 6.5 18 6z" />
        <path d="M5 9.5c.5-2 2-2.5 3.5-1.5" strokeWidth="1.5" opacity="0.6" />
    </svg>
);

export const LeatherIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 5c2 0 3.5 1.5 3.5 3.5 0-3 2-4.5 3.5-4.5s3.5 1.5 3.5 4.5c0-2 1.5-3.5 3.5-3.5 0 2 1.5 5 1.5 6.5s-1.5 4.5-1.5 6.5c-2 0-3.5-1.5-3.5-3.5 0 3-2 4.5-3.5 4.5s-3.5-1.5-3.5-4.5c0 2-1.5 3.5-3.5 3.5 0-2-1.5-5-1.5-6.5S3.5 5 5 5z" />
        <path d="M7 6.5c1 0 2 1 2 2.5 0-2.5 1.5-3.5 3-3.5s3 1 3 3.5c0-1.5 1-2.5 2-2.5 0 1 .5 3 .5 5s-.5 4-.5 5c-1 0-2-1-2-2.5 0 2.5-1.5 3.5-3 3.5s-3-1-3-3.5c0 1.5-1 2.5-2 2.5 0-1-.5-3-.5-5s.5-4 .5-5z" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
    </svg>
);

export const SmokeIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M8 21c0-4 2-6 0-10s2-6 4-8" />
        <path d="M12 21c0-4 2-6 0-10s2-6 4-8" />
        <path d="M16 21c0-4 2-6 0-10s2-6 4-8" />
    </svg>
);

// --- Nuts ---
export const NutIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 12c0-4 2-8 6-11 4 3 6 7 6 11s-2 8-6 11c-4-3-6-7-6-11z" />
        <path d="M12 2v20" />
        <path d="M8 6l8 12" />
        <path d="M16 6l-8 12" />
    </svg>
);

// --- Bell Pepper ---
export const BellPepperIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 4c0 3 2 5 2 5" />
        <path d="M6 10c0-4 2-5 6-5 2-.5 4 .5 6 4 3 4 2 12-6 12-4 0-5-2-6-6-2-2-2-6 0-9z" />
        <path d="M12 9c3 5 4 10 0 12" opacity="0.6" />
        <path d="M9 10c-3 3-1 9 3 11" opacity="0.6" />
    </svg>
);

// --- Misc ---
export const Sparkles = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2l1 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" />
    </svg>
);

