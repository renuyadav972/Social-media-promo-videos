import React from "react";
import { SORA_FAMILY, INTER_FAMILY } from "../fonts";

// ============================================================================
// OldConsoleShell — a code-controlled mock of the LEGACY Plivo console, used
// only as brief "before" context in the comparison video. Dark navy unlabeled
// icon rail -> secondary text sidebar per product -> dense white content with
// green accents, plus the real "Switch to our redesigned platform" nag banner.
// Deliberately busier / more dated than NewConsoleShell to sell the contrast.
// ============================================================================

const NAVY = "#13134f";
const NAVY_2 = "#1c1c66";
const GREEN = "#2faa4a";
const INK = "#22252b";
const SUB = "#6b7280";
const HAIR = "#e7e8ec";

// Simple white rail glyphs (the old rail was icon-only, no labels).
const RailGlyph: React.FC<{ kind: string; active?: boolean }> = ({ kind, active }) => {
  const c: React.SVGProps<SVGSVGElement> = {
    width: 20,
    height: 20,
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: active ? GREEN : "#aeb0d8",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (kind) {
    case "voice":
      return (
        <svg {...c}>
          <path d="M6 3.5C5 3.5 4 4.5 4 6c0 5 5 10 10 10 1.5 0 2.5-1 2.5-2l-3-2-2 1.5C9 12 8 11 6.5 8.5L8 6.5z" />
        </svg>
      );
    case "msg":
      return (
        <svg {...c}>
          <rect x="3" y="4" width="14" height="9" rx="2" />
          <path d="M6 13v3l3-3" />
        </svg>
      );
    case "wa":
      return (
        <svg {...c}>
          <circle cx="10" cy="10" r="7" />
        </svg>
      );
    case "lookup":
      return (
        <svg {...c}>
          <circle cx="9" cy="9" r="5" />
          <path d="M13 13l4 4" />
        </svg>
      );
    case "sip":
      return (
        <svg {...c}>
          <rect x="3.5" y="5" width="13" height="4" rx="1" />
          <rect x="3.5" y="11" width="13" height="4" rx="1" />
        </svg>
      );
    case "num":
      return (
        <svg {...c}>
          <path d="M7 3 5.6 17M14.4 3 13 17M3.5 7.2h13M3 12.8h13" />
        </svg>
      );
    case "phlo":
      return (
        <svg {...c}>
          <circle cx="5" cy="5" r="2" />
          <circle cx="15" cy="10" r="2" />
          <circle cx="5" cy="15" r="2" />
          <path d="M7 5h4a2 2 0 0 1 2 2v1M7 15h4a2 2 0 0 0 2-2v-1" />
        </svg>
      );
    case "billing":
      return (
        <svg {...c}>
          <rect x="3.5" y="4.5" width="13" height="11" rx="1.5" />
          <path d="M3.5 8h13" />
        </svg>
      );
    default:
      return (
        <svg {...c}>
          <circle cx="10" cy="10" r="6" />
        </svg>
      );
  }
};

const RAIL: { kind: string; key: string }[] = [
  { kind: "voice", key: "voice" },
  { kind: "msg", key: "msg" },
  { kind: "wa", key: "wa" },
  { kind: "lookup", key: "lookup" },
  { kind: "sip", key: "sip" },
  { kind: "num", key: "num" },
  { kind: "phlo", key: "phlo" },
  { kind: "billing", key: "billing" },
];

export type OldConsoleShellProps = {
  // Which rail product is active (its icon turns green).
  activeRail?: string;
  // Secondary sidebar header + items.
  productName?: string;
  subItems?: { label: string; active?: boolean; indent?: boolean; badge?: string }[];
  children?: React.ReactNode;
};

const DEFAULT_SUBITEMS = [
  { label: "Overview", active: true },
  { label: "Advanced Insights", badge: "NEW" },
  { label: "Applications" },
  { label: "XML", indent: true },
  { label: "PHLO", indent: true },
  { label: "Endpoints" },
  { label: "Logs" },
  { label: "Calls", indent: true },
  { label: "Recordings", indent: true },
  { label: "Verified Caller ID", badge: "NEW" },
  { label: "Settings" },
  { label: "Geo Permissions", indent: true },
  { label: "Other Settings", indent: true },
];

export const OldConsoleShell: React.FC<OldConsoleShellProps> = ({
  activeRail = "voice",
  productName = "Voice",
  subItems = DEFAULT_SUBITEMS,
  children,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        fontFamily: `${INTER_FAMILY}, ${SORA_FAMILY}, sans-serif`,
        color: INK,
        fontSize: 13,
      }}
    >
      {/* Nag banner */}
      <div
        style={{
          height: 34,
          background: NAVY,
          color: "#dfe0f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontSize: 12.5,
          flexShrink: 0,
        }}
      >
        Switch to our redesigned platform for a faster, smarter experience.
        <span style={{ color: "#8ea0ff", fontWeight: 700 }}>Click Here</span>
        <span style={{ position: "absolute", right: 16, color: "#9a9cc7" }}>✕</span>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Dark icon rail */}
        <div
          style={{
            width: 58,
            background: NAVY,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 14,
            gap: 4,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 20,
              marginBottom: 12,
              fontFamily: `${SORA_FAMILY}, sans-serif`,
            }}
          >
            P
          </div>
          {RAIL.map((r) => {
            const active = r.key === activeRail;
            return (
              <div
                key={r.key}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: active ? NAVY_2 : "transparent",
                  borderLeft: active ? `3px solid ${GREEN}` : "3px solid transparent",
                }}
              >
                <RailGlyph kind={r.kind} active={active} />
              </div>
            );
          })}
        </div>

        {/* Secondary text sidebar */}
        <div
          style={{
            width: 184,
            background: "#fbfbfc",
            borderRight: `1px solid ${HAIR}`,
            padding: "16px 0",
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: INK, padding: "0 18px 12px" }}>
            {productName}
          </div>
          {subItems.map((it, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                height: 30,
                padding: it.indent ? "0 18px 0 34px" : "0 18px",
                fontSize: 13,
                color: it.active ? GREEN : "#4b5160",
                fontWeight: it.active ? 700 : 500,
                borderLeft: it.active ? `3px solid ${GREEN}` : "3px solid transparent",
                background: it.active ? "#f1faf2" : "transparent",
              }}
            >
              {it.label}
              {it.badge ? (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: GREEN,
                    border: `1px solid ${GREEN}`,
                    borderRadius: 4,
                    padding: "0 4px",
                    marginLeft: 4,
                  }}
                >
                  {it.badge}
                </span>
              ) : null}
            </div>
          ))}
          <div style={{ fontSize: 11.5, color: "#8ea0ff", padding: "16px 18px 0" }}>
            Switch to redesigned view. Click Here
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0, background: "#ffffff", overflow: "hidden" }}>
          {children ?? <OldVoiceOverview />}
        </div>
      </div>
    </div>
  );
};

// A representative dense legacy page (Voice Overview) for the hook beat.
const OldVoiceOverview: React.FC = () => (
  <div style={{ padding: "18px 24px" }}>
    {/* India compliance sub-banner */}
    <div
      style={{
        background: "#fff8e6",
        border: "1px solid #f3e2a8",
        borderRadius: 6,
        padding: "8px 12px",
        fontSize: 12,
        color: "#7a5a12",
        marginBottom: 16,
      }}
    >
      If you are interested in renting local numbers in India, please submit a{" "}
      <span style={{ color: GREEN, fontWeight: 600 }}>compliance application</span>.
    </div>
    <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 14 }}>Voice Overview</div>
    <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
      <OldCard title="Account">
        <OldKV k="Auth ID:" v="MAYZ4ZWMM..." />
        <OldKV k="Auth Token:" v="••••••••••" />
        <OldKV k="Status:" v="Enabled" pill />
      </OldCard>
      <OldCard title="Payment">
        <OldKV k="Remaining Credits:" v="$60.56" />
        <OldKV k="Payment Mode:" v="Prepaid" />
        <div style={{ color: GREEN, fontSize: 12, fontWeight: 600, marginTop: 6 }}>
          + Add Credits &nbsp; Setup Auto Recharge
        </div>
      </OldCard>
    </div>
    <div style={{ display: "flex", gap: 16 }}>
      {["Calls", "Minutes", "Call Quality"].map((m, i) => (
        <div
          key={m}
          style={{
            flex: 1,
            border: `1px solid ${HAIR}`,
            borderRadius: 6,
            padding: "14px 16px",
          }}
        >
          <div style={{ fontSize: 12, color: SUB }}>{m}</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>
            {i === 0 ? "9" : i === 1 ? "0s" : "NA"}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const OldCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ flex: 1, border: `1px solid ${HAIR}`, borderRadius: 6, padding: "14px 16px" }}>
    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{title}</div>
    {children}
  </div>
);

const OldKV: React.FC<{ k: string; v: string; pill?: boolean }> = ({ k, v, pill }) => (
  <div style={{ display: "flex", gap: 8, fontSize: 12.5, marginBottom: 6 }}>
    <span style={{ color: SUB }}>{k}</span>
    {pill ? (
      <span style={{ background: "#e6f2ff", color: "#2563eb", borderRadius: 4, padding: "0 6px", fontSize: 11 }}>
        {v}
      </span>
    ) : (
      <span style={{ color: INK, fontWeight: 600 }}>{v}</span>
    )}
  </div>
);
