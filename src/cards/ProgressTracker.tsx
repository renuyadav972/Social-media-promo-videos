import React from "react";
import { useCurrentFrame } from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "../fonts";

// Code-driven progress tracker. Each step has a `completeAtFrame` — before
// that frame the step is pending; after, it's done. The first non-completed
// step is marked "active". Title and step labels are props, so adding/
// removing/reordering steps takes seconds.

export type ProgressStep = {
  label: string;
  completeAtFrame: number;
};

export type ProgressTrackerProps = {
  title: string;
  subtitle?: string;
  steps: ProgressStep[];
};

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  title,
  subtitle,
  steps,
}) => {
  const frame = useCurrentFrame();
  const totalDone = steps.filter((s) => frame >= s.completeAtFrame).length;
  const activeIdx = steps.findIndex((s) => frame < s.completeAtFrame);

  return (
    <div
      style={{
        background: "#f9fafb",
        border: "1px solid #eef0f4",
        borderRadius: 12,
        padding: 16,
        fontFamily: `${INTER_FAMILY}, ${SORA_FAMILY}, sans-serif`,
        color: "#0f1117",
        fontSize: 14,
        maxWidth: 420,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 600,
          fontSize: 14,
          marginBottom: 8,
        }}
      >
        <span>≣</span>
        <span>{title}</span>
        <span style={{ color: "#6b7280", fontWeight: 500 }}>
          {totalDone}/{steps.length}
        </span>
        <span style={{ marginLeft: "auto", color: "#9ca3af" }}>▴</span>
      </div>
      {subtitle ? (
        <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 12 }}>
          {subtitle}
        </div>
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {steps.map((s, i) => {
          const done = frame >= s.completeAtFrame;
          const active = !done && i === activeIdx;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: done ? "#9ca3af" : active ? "#0f1117" : "#6b7280",
                fontWeight: active ? 600 : 400,
                textDecoration: done ? "line-through" : "none",
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: done
                    ? "1.5px solid #059669"
                    : active
                      ? "1.5px solid #0f1117"
                      : "1.5px solid #d1d5db",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  color: done ? "#059669" : active ? "#0f1117" : "#d1d5db",
                  background: "#ffffff",
                  flexShrink: 0,
                }}
              >
                {done ? "✓" : active ? "→" : ""}
              </span>
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
