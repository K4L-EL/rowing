import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function Boat1x({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12L21 12" />
      <path d="M12 12L12 3" />
      <path d="M11 3L13 3" />
      <path d="M3 15L3 18" />
      <path d="M21 15L21 18" />
    </svg>
  );
}

export function Boat2x({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 14L22 14" />
      <path d="M4 14L4 17" />
      <path d="M20 14L20 17" />
      <path d="M8 8L8 14" />
      <path d="M16 8L16 14" />
      <path d="M8 8L7 5" />
      <path d="M16 8L17 5" />
    </svg>
  );
}

export function Boat4({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 16L22 16" />
      <path d="M4 16L4 19" />
      <path d="M20 16L20 19" />
      <path d="M6 8L6 16" />
      <path d="M10 6L10 16" />
      <path d="M14 6L14 16" />
      <path d="M18 8L18 16" />
      <path d="M6 8L5 5" />
      <path d="M18 8L19 5" />
    </svg>
  );
}

export function Boat8({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 18L22 18" />
      <path d="M4 18L4 21" />
      <path d="M20 18L20 21" />
      <path d="M4 8L4 18" />
      <path d="M7 6L7 18" />
      <path d="M10 5L10 18" />
      <path d="M13 5L13 18" />
      <path d="M16 6L16 18" />
      <path d="M19 8L19 18" />
      <path d="M4 8L3 5" />
      <path d="M19 8L20 5" />
    </svg>
  );
}

export function Oar({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2L12 22" />
      <path d="M5 14L12 19" />
      <path d="M12 19L19 14" />
      <path d="M3 13L5 15" />
      <path d="M19 15L21 13" />
    </svg>
  );
}

export function WaterRipple({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12C4 8 6 8 8 12C10 16 12 16 14 12C16 8 18 8 20 12C22 16 22 16 22 16" />
      <path d="M2 18C4 14 6 14 8 18C10 22 12 22 14 18C16 14 18 14 20 18" />
    </svg>
  );
}

export function Whistle({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="8" cy="16" r="4" />
      <path d="M12 16L22 16" />
      <path d="M18 13C18 11 16 9 14 9" />
      <path d="M8 12L8 8" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}
