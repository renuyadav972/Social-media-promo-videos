import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "../fonts";
import { ClickCursor } from "./ClickCursor";

// A faithful recreation of the Vibe Agent chat feed: streaming "thinking +
// action" messages that append at the bottom while older ones scroll up
// (bottom-anchored flex column + overflow hidden), a Progress tracker card,
// a "Generating…" status bar, and the composer — matching the real product.

export type FeedMsg =
  | { kind: "thought"; label: string; at: number }
  | { kind: "action"; label: string; at: number; doneAt?: number }
  | { kind: "text"; text: React.ReactNode; at: number }
  | { kind: "tracker"; at: number; counter: string; subtitle: string; steps: { label: string; doneAt: number }[] }
  | { kind: "link"; label: string; at: number; clickAt?: number };

const Check: React.FC = () => <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>;
const Spinner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <span
      style={{
        display: "inline-block",
        width: 13,
        height: 13,
        borderRadius: "50%",
        border: "2px solid #e5e7eb",
        borderTopColor: "#6b7280",
        transform: `rotate(${(frame * 16) % 360}deg)`,
        verticalAlign: "middle",
        flexShrink: 0,
      }}
    />
  );
};

// Each row fades + grows in (height reveal) so the feed pushes up smoothly.
const Row: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = interpolate(frame, [at, at + 12], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ opacity: t, maxHeight: t * 360, overflow: "hidden", transform: `translateY(${(1 - t) * 6}px)`, flexShrink: 0 }}>
      {children}
    </div>
  );
};

const Msg: React.FC<{ m: FeedMsg }> = ({ m }) => {
  const frame = useCurrentFrame();
  if (m.kind === "thought") {
    return (
      <Row at={m.at}>
        <div style={{ color: "#9ca3af", fontSize: 13.5, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11 }}>▾</span>
          <span>🧠</span> {m.label}
        </div>
      </Row>
    );
  }
  if (m.kind === "action") {
    const done = m.doneAt != null && frame >= m.doneAt;
    const running = m.doneAt != null && !done;
    return (
      <Row at={m.at}>
        <div style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: running ? "#6b7280" : "#0f1117" }}>{m.label}{running ? "…" : ""}</span>
          {running ? <Spinner /> : <Check />}
        </div>
      </Row>
    );
  }
  if (m.kind === "text") {
    return (
      <Row at={m.at}>
        <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>{m.text}</div>
      </Row>
    );
  }
  if (m.kind === "link") {
    return (
      <Row at={m.at}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <span style={{ color: "#a21caf", textDecoration: "underline", fontWeight: 600, fontSize: 14 }}>{m.label}</span>
          {m.clickAt != null ? (
            <ClickCursor clickAtFrame={m.clickAt} approach="tl" offset={{ x: Math.min(190, m.label.length * 7), y: 16 }} />
          ) : null}
        </div>
      </Row>
    );
  }
  // tracker
  return (
    <Row at={m.at}>
      <div style={{ border: "1px solid #eef0f4", borderRadius: 10, padding: "12px 14px", background: "#fbfbfc" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 13.5 }}>
          <span>⊟</span> Progress tracker <span style={{ color: "#9ca3af", fontWeight: 500 }}>{m.counter}</span>
        </div>
        <div style={{ fontSize: 13, color: "#6b7280", margin: "6px 0 10px" }}>{m.subtitle}</div>
        {m.steps.map((s, i) => {
          const done = frame >= s.doneAt;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: done ? "#9ca3af" : "#0f1117", textDecoration: done ? "line-through" : "none", marginTop: 5 }}>
              <span style={{ color: done ? "#059669" : "#9ca3af" }}>{done ? "✓" : "○"}</span>
              {s.label}
            </div>
          );
        })}
      </div>
    </Row>
  );
};

export const AgentChatPanel: React.FC<{
  messages: FeedMsg[];
  generatingUntil?: number;
  composer?: string;
}> = ({ messages, generatingUntil, composer = "Describe the agentic flow you want to build..." }) => {
  const frame = useCurrentFrame();
  const generating = generatingUntil == null || frame < generatingUntil;
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", color: "#0f1117", fontFamily: `${INTER_FAMILY}, ${SORA_FAMILY}, sans-serif`, minHeight: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid #eef0f4" }}>
        <span style={{ fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ color: "#cd3ef9" }}>✦</span> Vibe Agent
        </span>
        <span style={{ color: "#9ca3af" }}>✕</span>
      </div>
      {/* Streaming feed: bottom-anchored so new messages push older ones up. */}
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 11, padding: "14px 18px" }}>
        {messages.map((m, i) => (
          <Msg key={i} m={m} />
        ))}
      </div>
      {generating ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderTop: "1px solid #eef0f4", color: "#6b7280", fontSize: 13.5 }}>
          <span>Generating...</span>
          <Spinner />
        </div>
      ) : null}
      <div style={{ padding: "10px 14px" }}>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px 14px", color: "#9ca3af", fontSize: 13.5, minHeight: 46, position: "relative" }}>
          {composer}
          <div style={{ position: "absolute", right: 10, bottom: 8, width: 28, height: 28, borderRadius: "50%", background: "#0f1117" }} />
        </div>
      </div>
    </div>
  );
};
