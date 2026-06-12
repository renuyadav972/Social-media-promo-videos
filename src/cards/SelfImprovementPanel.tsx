import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "../fonts";

// Self-improvement checklist — items appear with a spinner, then flip to a
// green check when their fix lands. Mirrors the "Tightening support
// boundaries / Improving transfer capture / Saving test fixes" sequence
// from the Loom.

export type ImprovementItem = {
  label: string;
  appearAtFrame: number;
  // When set, the spinner flips to a green check at this frame. Omit to
  // leave the item spinning (e.g. "Rerunning failed tests...").
  doneAtFrame?: number;
};

export type SelfImprovementPanelProps = {
  items: ImprovementItem[];
  title?: string;
};

export const SelfImprovementPanel: React.FC<SelfImprovementPanelProps> = ({
  items,
  title,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        fontFamily: `${INTER_FAMILY}, ${SORA_FAMILY}, sans-serif`,
        color: "#0f1117",
        fontSize: 14,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 420,
      }}
    >
      {title ? (
        <div style={{ fontWeight: 600, fontSize: 14, color: "#0f1117" }}>
          {title}
        </div>
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((it, i) => {
          // Always render every row (reserve its space) and just fade it in, so
          // appearing items don't shove the layout and cause a "shake".
          const done = it.doneAtFrame != null && frame >= it.doneAtFrame;
          const appear = interpolate(
            frame,
            [it.appearAtFrame, it.appearAtFrame + 8],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#0f1117",
                opacity: appear,
              }}
            >
              <span>{it.label}</span>
              {done ? (
                <span style={{ color: "#059669", fontWeight: 700 }}>✓</span>
              ) : (
                <span
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "2px solid #d1d5db",
                    borderTopColor: "#6b7280",
                    animation: "none",
                    transform: `rotate(${(frame * 18) % 360}deg)`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
