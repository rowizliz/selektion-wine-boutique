// Wine Folly Style Icons - Based on official reference
// Outline style with 2px stroke, rounded caps, organic feel

import React from 'react';

interface IconProps {
    className?: string;
}

// ============ RED FRUITS ============

// Cherry
export const CherryIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="8" cy="16" r="5" />
        <circle cx="16" cy="18" r="5" />
        <path d="M8 11c-2-6 4-9 8-7" />
        <path d="M16 13c2-4 0-8-4-10" />
    </svg>
);

// Strawberry
export const StrawberryIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5.5 10c0-2.5 1-4 3.5-5 .5 2 1.5 2 3 2 1.5 0 2.5 0 3-2 2.5 1 3.5 2.5 3.5 5 0 4-3.5 9-6.5 11-3-2-6.5-7-6.5-11z" />
        <path d="M12 7c0-2.5 0-4 0-5" />
        <path d="M10 5l2-2 2 2" />
        <circle cx="9" cy="12" r="0.5" fill="currentColor" />
        <circle cx="12" cy="15" r="0.5" fill="currentColor" />
        <circle cx="15" cy="12" r="0.5" fill="currentColor" />
    </svg>
);

// Raspberry / Blackberry
export const RaspberryIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="10" r="2.5" />
        <circle cx="8" cy="13" r="2.5" />
        <circle cx="16" cy="13" r="2.5" />
        <circle cx="10" cy="17" r="2.5" />
        <circle cx="14" cy="17" r="2.5" />
        <path d="M12 7V3" />
        <path d="M10 5l2-2 2 2" />
    </svg>
);

// Plum
export const PlumIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="13" r="7" />
        <path d="M12 6c1 3 2 7 0 14" opacity="0.6" />
        <path d="M12 6v-3" />
        <path d="M13 5l2-1" />
    </svg>
);

// ============ CITRUS & TREE FRUITS ============

// Citrus (Lemon/Orange)
export const CitrusIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4v16M4 12h16" />
        <path d="M7.5 7.5l9 9M16.5 7.5l-9 9" opacity="0.4" />
    </svg>
);

// Apple - Classic apple shape with indent at top
export const AppleIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 5c-5 0-8 3-8 8 0 5 3 8 8 8s8-3 8-8c0-5-3-8-8-8z" />
        <path d="M8 5c0-2 2-3 4-3s4 1 4 3" />
        <path d="M12 2v3" />
        <path d="M10 3c-1-1 0-2 1-2" />
    </svg>
);

// Pear
export const PearIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M8 10c-2 2-3 6-2 9 1 3 4 4 6 4s5-1 6-4c1-3 0-7-2-9-1-2-3-3-4-3s-3 1-4 3z" />
        <path d="M12 7v-4" />
        <path d="M10 5l2-2" />
    </svg>
);

// Peach
export const PeachIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 5c-4-2-9 1-9 7 0 6 6 10 9 10s9-4 9-10c0-6-5-9-9-7z" />
        <path d="M12 5c0 4 2 8 0 13" opacity="0.6" />
        <path d="M12 2v3" />
        <path d="M14 3l2-1" />
    </svg>
);

// Grape
export const GrapeIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="6" r="2.5" />
        <circle cx="8" cy="10" r="2.5" />
        <circle cx="16" cy="10" r="2.5" />
        <circle cx="10" cy="14" r="2.5" />
        <circle cx="14" cy="14" r="2.5" />
        <circle cx="12" cy="18" r="2.5" />
        <path d="M12 3v-1" />
    </svg>
);

// Banana
export const BananaIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 7c-2 4-1 10 3 12 4 2 9 0 11-4s1-10-3-12c-4-2-9 0-11 4z" />
        <path d="M16 5l1-2" />
    </svg>
);

// ============ FLOWERS ============

// Rose
export const RoseIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="8" r="6" />
        <path d="M9 7c0-2 1.5-3 3-3s3 1 3 3" />
        <path d="M12 14v7" />
        <path d="M9 18l3-2 3 2" />
    </svg>
);

// Flower
export const FlowerIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="6" r="3" />
        <circle cx="17" cy="9.5" r="3" />
        <circle cx="15.5" cy="15.5" r="3" />
        <circle cx="8.5" cy="15.5" r="3" />
        <circle cx="7" cy="9.5" r="3" />
    </svg>
);

// Violet
export const VioletIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <ellipse cx="12" cy="6" rx="3" ry="4" />
        <ellipse cx="7" cy="11" rx="3" ry="4" transform="rotate(-30 7 11)" />
        <ellipse cx="17" cy="11" rx="3" ry="4" transform="rotate(30 17 11)" />
        <circle cx="12" cy="13" r="2" />
        <path d="M12 15v6" />
    </svg>
);

// ============ HERBS ============

// Leaf/Herb
export const LeafIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 21V9" />
        <path d="M12 18c-2-1-3-3-3-5" />
        <path d="M12 15c2-1 3-3 3-5" />
        <path d="M12 12c-2-1-3-3-3-5" />
        <path d="M12 9c2-1 3-3 3-5" />
        <path d="M7 20c-1-3 0-6 2-8" />
        <path d="M17 20c1-3 0-6-2-8" />
    </svg>
);

// Mint
export const MintIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 21v-10" />
        <ellipse cx="12" cy="7" rx="4" ry="5" />
        <ellipse cx="7" cy="14" rx="3" ry="4" />
        <ellipse cx="17" cy="14" rx="3" ry="4" />
    </svg>
);

// Bell Pepper
export const BellPepperIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 4c0 3 2 5 2 5" />
        <path d="M6 10c0-4 2-5 6-5 2-.5 4 .5 6 4 3 4 2 12-6 12-4 0-5-2-6-6-2-2-2-6 0-9z" />
        <path d="M12 9c3 5 4 10 0 12" opacity="0.6" />
        <path d="M9 10c-3 3-1 9 3 11" opacity="0.6" />
    </svg>
);

// ============ SPICES ============

// Vanilla
export const VanillaIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M8 3c-1 6-1 12 0 18" />
        <path d="M12 3c-1 6-1 12 0 18" />
        <path d="M16 3c-1 6-1 12 0 18" />
    </svg>
);

// Pepper
export const PepperIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="8" cy="8" r="2.5" />
        <circle cx="16" cy="8" r="2.5" />
        <circle cx="12" cy="12" r="2.5" />
        <circle cx="8" cy="16" r="2.5" />
        <circle cx="16" cy="16" r="2.5" />
    </svg>
);

// Cinnamon
export const CinnamonIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 8h16c0 0 0 4-2 4H6c-2 0-2-4-2-4z" />
        <path d="M4 12h14c0 0 0 4-2 4H6c-2 0-2-4-2-4z" />
        <path d="M8 8v8M12 8v8" strokeWidth="1" opacity="0.4" />
    </svg>
);

// ============ WOOD & EARTH ============

// Oak
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

// Earth - Layered mineral/rock strata
export const EarthIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 8c2-1 4-2 8-2s6 1 8 2" />
        <path d="M4 12c2-1 4-2 8-2s6 1 8 2" />
        <path d="M4 16c2-1 4-2 8-2s6 1 8 2" />
        <path d="M4 20c2-1 4-2 8-2s6 1 8 2" />
        <circle cx="7" cy="10" r="1" fill="currentColor" />
        <circle cx="15" cy="14" r="1" fill="currentColor" />
        <circle cx="10" cy="18" r="1" fill="currentColor" />
    </svg>
);

// Mushroom
export const MushroomIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 13c0-5 4-9 8-9s8 4 8 9H4z" />
        <path d="M9 13v8h6v-8" />
    </svg>
);

// ============ SWEET ============

// Chocolate
export const ChocolateIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="4" y="6" width="16" height="12" rx="1" />
        <path d="M4 11h16" />
        <path d="M4 16h16" />
        <path d="M9 6v12M14 6v12" />
    </svg>
);

// Coffee
export const CoffeeIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <ellipse cx="12" cy="12" rx="5" ry="8" />
        <path d="M12 4c-1 5-1 11 0 16" strokeWidth="1.5" />
    </svg>
);

// Honey
export const HoneyIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 3v13" />
        <path d="M8 16h8" />
        <path d="M8 19h8" />
        <path d="M9 22h6" />
        <path d="M10 16c-1 0-2 1-2 3s1 3 2 3h4c1 0 2-1 2-3s-1-3-2-3" />
        <path d="M12 22s2 1 2 2" strokeWidth="1.5" />
    </svg>
);

// Cream/Ice Cream
export const CreamIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M7 10l5 12 5-12" />
        <path d="M12 10c3 0 5-2 5-5s-2-5-5-5-5 2-5 5 2 5 5 5z" />
        <path d="M9.5 16l5-5" strokeWidth="1.5" opacity="0.5" />
        <path d="M14.5 16l-5-5" strokeWidth="1.5" opacity="0.5" />
    </svg>
);

// Butter
export const ButterIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 14h14l-2-6H7z" />
        <path d="M3 18h18" />
        <path d="M5 14v4" />
        <path d="M19 14v4" />
    </svg>
);

// Cheese
export const CheeseIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M13 4l8 5-7 5-10-4z" />
        <path d="M4 10l7 5v8l-7-5z" />
        <path d="M14 23v-9l7-5v7z" />
        <circle cx="8" cy="18" r="1.5" />
        <circle cx="17.5" cy="19.5" r="1" />
    </svg>
);

// ============ TOBACCO & LEATHER ============

// Tobacco
export const TobaccoIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2c-4 0-7 3-8 7-1 4 1 9 4 11 1 1 3 2 4 2s3-1 4-2c3-2 5-7 4-11-1-4-4-7-8-7z" />
        <path d="M12 2v20" />
        <path d="M8 8c2-2 6-2 8 0" opacity="0.5" />
        <path d="M7 12c2.5-1 7.5-1 10 0" opacity="0.5" />
        <path d="M8 16c2-1 6-1 8 0" opacity="0.5" />
    </svg>
);

// Leather
export const LeatherIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 5c2 0 3.5 1.5 3.5 3.5 0-3 2-4.5 3.5-4.5s3.5 1.5 3.5 4.5c0-2 1.5-3.5 3.5-3.5 0 2 1.5 5 1.5 6.5s-1.5 4.5-1.5 6.5c-2 0-3.5-1.5-3.5-3.5 0 3-2 4.5-3.5 4.5s-3.5-1.5-3.5-4.5c0 2-1.5 3.5-3.5 3.5 0-2-1.5-5-1.5-6.5S3.5 5 5 5z" />
        <path d="M7 6.5c1 0 2 1 2 2.5 0-2.5 1.5-3.5 3-3.5s3 1 3 3.5c0-1.5 1-2.5 2-2.5 0 1 .5 3 .5 5s-.5 4-.5 5c-1 0-2-1-2-2.5 0 2.5-1.5 3.5-3 3.5s-3-1-3-3.5c0 1.5-1 2.5-2 2.5 0-1-.5-3-.5-5s.5-4 .5-5z" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
    </svg>
);

// Smoke - Wavy smoke wisps
export const SmokeIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 22c0-3 1-4 2-6s-1-4-1-6c0-3 2-4 3-4" />
        <path d="M12 22c0-3 1-4 2-6s-1-4-1-6c0-3 2-4 3-4" />
        <path d="M18 22c0-3 1-4 2-6s-1-4-1-6c0-3 2-4 3-4" />
    </svg>
);

// ============ NUTS ============

// Nut
export const NutIcon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <ellipse cx="12" cy="12" rx="6" ry="9" />
        <path d="M12 3v18" />
        <path d="M7 7l10 10" opacity="0.4" />
    </svg>
);
