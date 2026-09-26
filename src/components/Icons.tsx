/* Inline SVG icons: 1.5px strokes beside regular text, 2px beside semibold. */

interface IconProps {
  className?: string;
  strokeWidth?: number;
}

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function InfoIcon({ className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} strokeWidth={strokeWidth} {...base}>
      <circle cx="10" cy="10" r="7.25" />
      <path d="M10 9v4.5M10 6.5v.5" />
    </svg>
  );
}

export function AlertIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} strokeWidth={strokeWidth} {...base}>
      <path d="M10 3.5 2.75 16h14.5L10 3.5Z" />
      <path d="M10 8v3.5M10 13.5v.5" />
    </svg>
  );
}

export function CheckIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} strokeWidth={strokeWidth} {...base}>
      <circle cx="10" cy="10" r="7.25" />
      <path d="m6.75 10.25 2.25 2.25 4.25-4.75" />
    </svg>
  );
}

export function BrandMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="var(--teal-700)" />
      <path
        d="M8 19c2.5-2.6 5.5-2.6 8 0s5.5 2.6 8 0"
        fill="none"
        stroke="var(--teal-50)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M8 13c2.5-2.6 5.5-2.6 8 0s5.5 2.6 8 0"
        fill="none"
        stroke="var(--teal-50)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity=".55"
      />
    </svg>
  );
}
