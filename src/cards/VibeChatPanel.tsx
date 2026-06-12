import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "../fonts";

// A code-driven recreation of the right-side Vibe Agent chat panel. Each
// message has a `revealAtFrame` so messages stagger in on a precise timeline
// instead of relying on a screen recording. Edit prop arrays and the panel
// reflows immediately — no re-recording needed.

export type ChatMessage =
  | {
      kind: "user";
      text: string;
      revealAtFrame: number;
    }
  | {
      // Like "user", but the text types in letter-by-letter between
      // typeStartFrame and typeEndFrame — used for the "yes" confirmation.
      kind: "user-typed";
      text: string;
      revealAtFrame: number;
      typeStartFrame: number;
      typeEndFrame: number;
    }
  | {
      kind: "agent";
      text: string;
      revealAtFrame: number;
    }
  | {
      kind: "thinking";
      durationLabel: string; // "Thought for 3 seconds"
      revealAtFrame: number;
    }
  | {
      kind: "check";
      text: string; // "Finding voice components"
      revealAtFrame: number;
      done?: boolean; // true → green check, false → spinner
    }
  | {
      kind: "status";
      text: string; // "Generating..."
      revealAtFrame: number;
    };

export type VibeChatPanelProps = {
  messages: ChatMessage[];
  // Optional prompt-typer at the bottom — what the user is currently typing
  // into the composer (animated in via a frame range).
  composerText?: string;
  composerStartFrame?: number;
  composerEndFrame?: number;
};

export const VibeChatPanel: React.FC<VibeChatPanelProps> = ({
  messages,
  composerText,
  composerStartFrame,
  composerEndFrame,
}) => {
  const frame = useCurrentFrame();

  const typedComposer = React.useMemo(() => {
    if (!composerText || composerStartFrame == null || composerEndFrame == null)
      return composerText ?? "";
    const progress = interpolate(
      frame,
      [composerStartFrame, composerEndFrame],
      [0, composerText.length],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    return composerText.slice(0, Math.floor(progress));
  }, [composerText, composerStartFrame, composerEndFrame, frame]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        fontFamily: `${INTER_FAMILY}, ${SORA_FAMILY}, sans-serif`,
        color: "#0f1117",
        fontSize: 14,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "12px 20px",
          color: "#9ca3af",
          gap: 12,
          fontSize: 16,
        }}
      >
        <span>⋯</span>
        <span>✕</span>
      </div>

      {/* Scroll body */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          padding: "8px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {messages.map((m, i) => {
          if (frame < m.revealAtFrame) return null;
          if (m.kind === "user") {
            return (
              <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    background: "#eff2f9",
                    color: "#0f1117",
                    padding: "10px 14px",
                    borderRadius: 12,
                    maxWidth: 340,
                    fontSize: 14,
                    lineHeight: 1.4,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.text}
                </div>
              </div>
            );
          }
          if (m.kind === "user-typed") {
            const progress = interpolate(
              frame,
              [m.typeStartFrame, m.typeEndFrame],
              [0, m.text.length],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            const typed = m.text.slice(0, Math.floor(progress));
            const cursorVisible = Math.floor(frame / 12) % 2 === 0;
            return (
              <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    background: "#eff2f9",
                    color: "#0f1117",
                    padding: "10px 14px",
                    borderRadius: 12,
                    maxWidth: 340,
                    fontSize: 14,
                    lineHeight: 1.4,
                    whiteSpace: "pre-wrap",
                    minWidth: 32,
                  }}
                >
                  {typed}
                  {progress < m.text.length ? (
                    <span
                      style={{
                        display: "inline-block",
                        width: 2,
                        height: 14,
                        background: "#0f1117",
                        verticalAlign: "middle",
                        marginLeft: 1,
                        opacity: cursorVisible ? 1 : 0,
                      }}
                    />
                  ) : null}
                </div>
              </div>
            );
          }
          if (m.kind === "agent") {
            return (
              <div
                key={i}
                style={{
                  color: "#0f1117",
                  fontSize: 14,
                  lineHeight: 1.5,
                  maxWidth: 380,
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>
            );
          }
          if (m.kind === "thinking") {
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#6b7280",
                  fontSize: 13,
                }}
              >
                <span>▾</span>
                <span style={{ fontSize: 14 }}>🧠</span>
                <span>{m.durationLabel}</span>
              </div>
            );
          }
          if (m.kind === "check") {
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "#6b7280",
                  fontSize: 14,
                  marginLeft: 16,
                }}
              >
                <span>·</span>
                <span style={{ color: "#0f1117" }}>{m.text}</span>
                {m.done ? (
                  <span style={{ color: "#059669" }}>✓</span>
                ) : (
                  <span style={{ color: "#9ca3af" }}>◌</span>
                )}
              </div>
            );
          }
          if (m.kind === "status") {
            return (
              <div
                key={i}
                style={{
                  background: "#f9fafb",
                  border: "1px solid #eef0f4",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "#6b7280",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <span>{m.text}</span>
                <span style={{ marginLeft: "auto", color: "#9ca3af" }}>↻</span>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Composer */}
      <div style={{ padding: "12px 16px" }}>
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "12px 14px",
            color: typedComposer ? "#0f1117" : "#9ca3af",
            fontSize: 14,
            display: "flex",
            alignItems: "flex-start",
            minHeight: 56,
            position: "relative",
          }}
        >
          <span style={{ whiteSpace: "pre-wrap" }}>
            {typedComposer || "Describe the agentic flow you want to build..."}
          </span>
          {typedComposer ? (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 16,
                background: "#0f1117",
                marginLeft: 2,
                opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0,
              }}
            />
          ) : null}
          <div
            style={{
              position: "absolute",
              right: 10,
              bottom: 8,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#0f1117",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            ↑
          </div>
        </div>
      </div>
    </div>
  );
};
