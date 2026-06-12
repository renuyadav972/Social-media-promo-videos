import React from "react";
import { PlivoLogoSvg } from "../PlivoLogoSvg";
import { SORA_FAMILY, INTER_FAMILY } from "../fonts";
import { ClickCursor } from "./ClickCursor";

// A code-controlled mock of the Plivo app shell — sidebar, top bar, page
// header, and a content split (canvas left, chat panel right). Anything that
// changes in the real product (agent name, "Unsaved" pill, tab bar, action
// buttons) is a prop, so this can be retimed or edited in seconds.

export type PlivoAppShellProps = {
  agentName: string;
  agentStatus?: "Unsaved" | "Draft" | "Published";
  activeTab?: string;
  tabs?: string[];
  canvas: React.ReactNode;
  // Show the flow-canvas bottom toolbar (zoom %, undo/redo, fit, Global Prompt).
  canvasToolbar?: boolean;
  chatPanel?: React.ReactNode;
  // Optional toast / floating layer rendered above the canvas (e.g. success
  // notification at the top-right).
  overlay?: React.ReactNode;
  // When true, the active tab gets a purple highlight pill so the viewer's
  // eye lands on it (used when the tab itself is the subject of the beat,
  // e.g. "Running simulations").
  highlightActiveTab?: boolean;
  // Show a cursor clicking a specific tab at a given frame.
  tabCursor?: { label: string; clickAtFrame: number };
  // Show a cursor clicking the top-bar "Ask Buddy" button at a given frame
  // (and highlight the button), to open the Ask Buddy panel.
  buddyCursorFrame?: number;
};

// The real Plivo "AI Agents" left nav, collapsed to its icon rail (matches the
// console's navigation bar: AI STUDIO group, then VIEWS, then a settings gear).
// Built from primitive SVG shapes so the glyphs render crisply at rail size.
type RailIconName =
  | "vibe"
  | "flows"
  | "tools"
  | "knowledge"
  | "secrets"
  | "chat"
  | "runs"
  | "conversations"
  | "tasks"
  | "settings";

const RailIcon: React.FC<{ name: RailIconName }> = ({ name }) => {
  const c: React.SVGProps<SVGSVGElement> = {
    width: 20,
    height: 20,
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "vibe": // sparkle / star
      return (
        <svg {...c}>
          <path d="M10 2.5 11.5 8.5 17.5 10 11.5 11.5 10 17.5 8.5 11.5 2.5 10 8.5 8.5Z" />
        </svg>
      );
    case "flows": // three connected nodes
      return (
        <svg {...c}>
          <rect x="7" y="2.5" width="6" height="4" rx="1" />
          <rect x="2.5" y="13.5" width="6" height="4" rx="1" />
          <rect x="11.5" y="13.5" width="6" height="4" rx="1" />
          <path d="M10 6.5V10M10 10H5.5V13.5M10 10h4.5v3.5" />
        </svg>
      );
    case "tools": // sliders
      return (
        <svg {...c}>
          <path d="M3 6.5h14M3 13.5h14" />
          <circle cx="8" cy="6.5" r="2" fill="#ffffff" />
          <circle cx="13" cy="13.5" r="2" fill="#ffffff" />
        </svg>
      );
    case "knowledge": // book
      return (
        <svg {...c}>
          <rect x="4" y="3" width="12" height="14" rx="1.5" />
          <path d="M7.5 3v14" />
        </svg>
      );
    case "secrets": // key
      return (
        <svg {...c}>
          <circle cx="7" cy="7" r="3.2" />
          <path d="M9.3 9.3 16 16M13.5 13.5l2-2M15.5 15.5l1.5-1.5" />
        </svg>
      );
    case "chat": // single speech bubble
      return (
        <svg {...c}>
          <rect x="3" y="4" width="14" height="10" rx="3" />
          <path d="M7 14v3l3-3" />
        </svg>
      );
    case "runs": // play in circle
      return (
        <svg {...c}>
          <circle cx="10" cy="10" r="7" />
          <path d="M8.5 7 14 10l-5.5 3z" fill="currentColor" />
        </svg>
      );
    case "conversations": // two bubbles
      return (
        <svg {...c}>
          <rect x="2.5" y="3" width="11" height="8" rx="2" />
          <path d="M6 14.5h7.5a2 2 0 0 0 2-2V7" />
        </svg>
      );
    case "tasks": // checklist
      return (
        <svg {...c}>
          <path d="M3 6 4.6 7.6 7.5 4.5M10 6h7M3 13 4.6 14.6 7.5 11.5M10 13h7" />
        </svg>
      );
    case "settings": // gear
      return (
        <svg {...c}>
          <circle cx="10" cy="10" r="3" />
          <path d="M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18M4.3 4.3l1.8 1.8M13.9 13.9l1.8 1.8M15.7 4.3l-1.8 1.8M6.1 13.9l-1.8 1.8" />
        </svg>
      );
  }
};

// Top icon group (AI STUDIO) + a divider + a views group; "vibe" is active.
const RAIL_TOP: RailIconName[] = [
  "vibe",
  "flows",
  "tools",
  "knowledge",
  "secrets",
  "chat",
];
const RAIL_VIEWS: RailIconName[] = ["runs", "conversations", "tasks"];

export const PlivoAppShell: React.FC<PlivoAppShellProps> = ({
  agentName,
  agentStatus = "Unsaved",
  activeTab = "Flow",
  tabs = [
    "Flow",
    "Conversation Goal",
    "Agent Runs",
    "Simulations",
    "Event Callbacks",
    "Settings",
    "Knowledge Base",
    "Secrets",
    "Tools",
    "Voice Configuration",
  ],
  canvas,
  canvasToolbar = false,
  chatPanel,
  overlay,
  highlightActiveTab = false,
  tabCursor,
  buddyCursorFrame,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        fontFamily: `${INTER_FAMILY}, ${SORA_FAMILY}, sans-serif`,
        color: "#0f1117",
        fontSize: 14,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          height: 56,
          borderBottom: "1px solid #eef0f4",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 20,
        }}
      >
        <div style={{ marginRight: 8 }}>
          <PlivoLogoSvg width={64} />
        </div>
        <button style={pill("#f4f5f7", "#6b7280")}>☰</button>
        <div style={{ color: "#6b7280", fontSize: 13 }}>
          Data Region: <span style={{ color: "#0f1117", fontWeight: 600 }}>US</span>
        </div>
        <div style={pill("#f4f5f7", "#0f1117", 12)}>Professional Plan</div>
        <div style={{ flex: 1 }} />
        <div style={pill("#ecfdf5", "#059669")}>● Available</div>
        <div style={pill("#f4f5f7", "#0f1117")}>🎧 Human Specialist</div>
        <div
          style={{
            ...(buddyCursorFrame != null
              ? pill("#fdf4ff", "#cd3ef9")
              : pill("#f4f5f7", "#0f1117")),
            ...(buddyCursorFrame != null
              ? { border: "1px solid #cd3ef9", fontWeight: 600, position: "relative" }
              : {}),
          }}
        >
          👤 Ask Buddy
          {buddyCursorFrame != null ? (
            <ClickCursor clickAtFrame={buddyCursorFrame} approach="br" offset={{ x: 4, y: 2 }} />
          ) : null}
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#fbbf24",
          }}
        />
      </div>

      {/* Page header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #eef0f4",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ color: "#6b7280", fontSize: 18 }}>‹</span>
        <div style={{ fontSize: 20, fontWeight: 600, color: "#0f1117" }}>
          {agentName}
        </div>
        <div
          style={
            agentStatus === "Published"
              ? { ...pill("#ecfdf5", "#059669"), fontWeight: 600 }
              : pill("#f4f5f7", "#6b7280")
          }
        >
          {agentStatus === "Published" ? "● Live" : agentStatus}
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            ...pill("#ffffff", "#7c3aed"),
            border: "1px solid #cd3ef9",
          }}
        >
          🤖 Vibe Agent
        </div>
        <span style={{ color: "#6b7280", fontSize: 18 }}>⋮</span>
        <div style={pill("#ffffff", "#6b7280")}>▷ Test agent</div>
        <div style={pill("#ffffff", "#6b7280")}>Save as draft</div>
        <div style={pill("#0f1117", "#ffffff")}>Publish</div>
      </div>

      {/* Tab bar */}
      <div
        style={{
          padding: "0 24px",
          borderBottom: "1px solid #eef0f4",
          display: "flex",
          gap: 28,
          height: 44,
          alignItems: "center",
        }}
      >
        {tabs.map((t) => {
          const isActive = t === activeTab;
          const spotlight = isActive && highlightActiveTab;
          return (
            <div
              key={t}
              style={{
                position: "relative",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: spotlight ? "#cd3ef9" : isActive ? "#0f1117" : "#6b7280",
                borderBottom: spotlight
                  ? "2px solid #cd3ef9"
                  : isActive
                    ? "2px solid #0f1117"
                    : "2px solid transparent",
                paddingBottom: 8,
                marginTop: 8,
                ...(spotlight
                  ? {
                      background: "#fdf4ff",
                      borderRadius: "6px 6px 0 0",
                      padding: "2px 10px 8px",
                      marginLeft: -10,
                      marginRight: -10,
                    }
                  : {}),
              }}
            >
              {t}
              {tabCursor && tabCursor.label === t ? (
                <ClickCursor
                  clickAtFrame={tabCursor.clickAtFrame}
                  approach="br"
                  offset={{ x: 6, y: 2 }}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Body: sidebar + canvas + chat */}
      <div style={{ flex: 1, display: "flex", minHeight: 0, position: "relative" }}>
        {/* Left sidebar — the real AI Agents nav, collapsed to its icon rail. */}
        <div
          style={{
            width: 56,
            borderRight: "1px solid #eef0f4",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 14,
            paddingBottom: 12,
            gap: 6,
            color: "#9ca3af",
          }}
        >
          {RAIL_TOP.map((name) => {
            const active = name === "vibe";
            return (
              <div
                key={name}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: active ? "#cd3ef9" : "#9ca3af",
                  background: active ? "#fdf4ff" : "transparent",
                }}
              >
                <RailIcon name={name} />
              </div>
            );
          })}
          <div
            style={{
              width: 24,
              height: 1,
              background: "#eef0f4",
              margin: "6px 0",
            }}
          />
          {RAIL_VIEWS.map((name) => (
            <div
              key={name}
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
              }}
            >
              <RailIcon name={name} />
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
            }}
          >
            <RailIcon name="settings" />
          </div>
        </div>

        {/* Canvas */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage:
              "radial-gradient(#e5e7eb 1px, transparent 1px)",
            backgroundSize: "16px 16px",
            position: "relative",
          }}
        >
          {canvas}
          {/* Flow-canvas bottom toolbar (matches the real product). */}
          {canvasToolbar ? (
            <div
              style={{
                position: "absolute",
                left: 16,
                bottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#ffffff",
                border: "1px solid #eef0f4",
                borderRadius: 10,
                padding: "6px 10px",
                boxShadow: "0 2px 8px rgba(15,17,23,0.06)",
                color: "#6b7280",
                fontSize: 13,
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#cd3ef9" }}>✦</span> Vibe Agent
              </span>
              <span style={{ width: 1, height: 16, background: "#eef0f4", margin: "0 4px" }} />
              <span>−</span>
              <span style={{ color: "#0f1117", fontWeight: 600 }}>62%</span>
              <span>+</span>
              <span style={{ width: 1, height: 16, background: "#eef0f4", margin: "0 4px" }} />
              <span>↶</span>
              <span>↷</span>
              <span>⊡</span>
              <span style={{ width: 1, height: 16, background: "#eef0f4", margin: "0 4px" }} />
              <span>⚲ Global Prompt</span>
            </div>
          ) : null}
        </div>

        {/* Right chat panel */}
        {chatPanel ? (
          <div
            style={{
              width: 480,
              borderLeft: "1px solid #eef0f4",
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {chatPanel}
          </div>
        ) : null}

        {/* Overlay layer (e.g. success toast) */}
        {overlay}
      </div>
    </div>
  );
};

const pill = (bg: string, color: string, fontSize = 13): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 12px",
  borderRadius: 8,
  backgroundColor: bg,
  color,
  fontSize,
  fontWeight: 500,
  whiteSpace: "nowrap",
});
