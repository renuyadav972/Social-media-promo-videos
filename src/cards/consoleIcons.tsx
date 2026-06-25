import React from "react";

// Clean line-icon set for the new-console mock, so the simulated screens read
// as a real product (no emoji glyphs). All icons share a 20x20 box and inherit
// color via currentColor.
export type IcoName =
  | "search"
  | "chevron"
  | "download"
  | "filter"
  | "phone"
  | "bolt"
  | "headset"
  | "sparkle"
  | "warning"
  | "plus"
  | "sip"
  | "code"
  | "hash"
  | "whatsapp"
  | "list"
  | "bell"
  | "menu"
  | "copy"
  | "eye";

export const Ico: React.FC<{ name: IcoName; size?: number; stroke?: number }> = ({
  name,
  size = 16,
  stroke = 1.6,
}) => {
  const c: React.SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "search":
      return (
        <svg {...c}>
          <circle cx="8.7" cy="8.7" r="5" />
          <path d="M12.5 12.5 17 17" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...c}>
          <path d="M5.5 8 10 12.5 14.5 8" />
        </svg>
      );
    case "download":
      return (
        <svg {...c}>
          <path d="M10 3v9M6.5 8.5 10 12l3.5-3.5" />
          <path d="M4 15.5h12" />
        </svg>
      );
    case "filter":
      return (
        <svg {...c}>
          <path d="M3.5 5h13l-5 6v4l-3 1.5V11z" />
        </svg>
      );
    case "phone":
      return (
        <svg {...c}>
          <path d="M6 3.5C5 3.5 4 4.4 4 5.8c0 5 5 10 10 10 1.4 0 2.3-1 2.3-2l-2.8-1.9-2 1.5C8.8 12 8 11.2 6.6 8.5L8 6.5z" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...c}>
          <path d="M11 2.5 5 11h4l-1 6.5L15 9h-4z" />
        </svg>
      );
    case "headset":
      return (
        <svg {...c}>
          <path d="M4 11v-1a6 6 0 0 1 12 0v1" />
          <rect x="3" y="11" width="3" height="5" rx="1.2" />
          <rect x="14" y="11" width="3" height="5" rx="1.2" />
          <path d="M16 16v.5a2.5 2.5 0 0 1-2.5 2.5H10" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...c}>
          <path d="M10 2.5 11.4 8.6 17.5 10 11.4 11.4 10 17.5 8.6 11.4 2.5 10 8.6 8.6Z" />
        </svg>
      );
    case "warning":
      return (
        <svg {...c}>
          <path d="M10 3 17.5 16.5h-15z" />
          <path d="M10 8.5v3.5" />
          <circle cx="10" cy="14.3" r="0.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "plus":
      return (
        <svg {...c}>
          <path d="M10 4.5v11M4.5 10h11" />
        </svg>
      );
    case "sip":
      return (
        <svg {...c}>
          <path d="M7 3.5v9M7 12.5 4.5 10M7 12.5 9.5 10" />
          <path d="M13 16.5v-9M13 7.5 10.5 10M13 7.5 15.5 10" />
        </svg>
      );
    case "code":
      return (
        <svg {...c}>
          <path d="M7.5 6 4 10l3.5 4M12.5 6 16 10l-3.5 4" />
        </svg>
      );
    case "hash":
      return (
        <svg {...c}>
          <path d="M7 3.5 5.6 16.5M14.4 3.5 13 16.5M3.8 7.4h12.4M3.2 12.6h12.4" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...c}>
          <path d="M4 16l1-3a6.3 6.3 0 1 1 2.4 2.3z" />
          <path d="M7.6 8.3c.2 1.6 2.4 3.8 4 4l1-.9 1.4.8c-.1.8-.9 1.2-1.7 1.1-2.6-.3-5-2.7-5.3-5.3-.1-.8.3-1.6 1.1-1.7z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "list":
      return (
        <svg {...c}>
          <path d="M7 5.5h10M7 10h10M7 14.5h10" />
          <circle cx="3.7" cy="5.5" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="3.7" cy="10" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="3.7" cy="14.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "bell":
      return (
        <svg {...c}>
          <path d="M6 8.5a4 4 0 0 1 8 0c0 4 1.5 5 1.5 5h-11s1.5-1 1.5-5z" />
          <path d="M8.6 16a1.6 1.6 0 0 0 2.8 0" />
        </svg>
      );
    case "menu":
      return (
        <svg {...c}>
          <path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13" />
        </svg>
      );
    case "copy":
      return (
        <svg {...c}>
          <rect x="7" y="7" width="9" height="9" rx="1.6" />
          <path d="M4 12.5V5a1 1 0 0 1 1-1h7.5" />
        </svg>
      );
    case "eye":
      return (
        <svg {...c}>
          <path d="M2.5 10S5.5 5 10 5s7.5 5 7.5 5-3 5-7.5 5-7.5-5-7.5-5z" />
          <circle cx="10" cy="10" r="2.2" />
        </svg>
      );
  }
};
