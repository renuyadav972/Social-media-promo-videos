import React from "react";
import {
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "../fonts";
import { ClickCursor } from "./ClickCursor";

// A code-driven recreation of Vibe's "needs your input" question card.
// Used in the Confirm stage so the camera can frame the card precisely
// without any scroll-away from the source recording.
//
// All copy is prop-driven so the same card works for any future question
// Vibe asks (build prompt, regenerate flow, change voice, etc.).

export type QuestionOption = {
  // Bold label shown in the option box (e.g. "Approve").
  title: string;
  // Sub-description rendered under the label.
  description: string;
  // true = highlighted as the selected/recommended option.
  emphasized?: boolean;
};

export type VibeQuestionCardProps = {
  // Small caption above the question text ("Vibe Agent needs your input").
  header: string;
  // The actual question ("Should I build this lead qualification call flow…").
  question: string;
  options: QuestionOption[];
  // Optional free-text answer field placeholder ("Or type your own answer…").
  answerPlaceholder?: string;
  // When in the stage this card should appear, in frames.
  appearAtFrame?: number;
  // Index of the option the on-screen cursor should travel to and click.
  // When set together with `clickAtFrame`, a pointer animates onto that
  // option, presses at clickAtFrame, and the option flips to a selected
  // (purple) state — so a first-time viewer clearly sees "Approve" chosen.
  cursorOnOptionIndex?: number;
  clickAtFrame?: number;
};

export const VibeQuestionCard: React.FC<VibeQuestionCardProps> = ({
  header,
  question,
  options,
  answerPlaceholder = "Or type your own answer...",
  appearAtFrame = 0,
  cursorOnOptionIndex,
  clickAtFrame,
}) => {
  const frame = useCurrentFrame();
  if (frame < appearAtFrame) return null;

  const clicked = clickAtFrame != null && frame >= clickAtFrame;

  const reveal = interpolate(
    frame,
    [appearAtFrame, appearAtFrame + 14],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 12}px)`,
        background: "#ffffff",
        border: "1px solid #eef0f4",
        borderRadius: 12,
        padding: "18px 20px",
        fontFamily: `${INTER_FAMILY}, ${SORA_FAMILY}, sans-serif`,
        color: "#0f1117",
        boxShadow: "0 1px 0 rgba(15, 17, 23, 0.04)",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#0f1117",
          marginBottom: 8,
        }}
      >
        {header}
      </div>
      <div
        style={{
          fontSize: 14,
          color: "#0f1117",
          lineHeight: 1.45,
          marginBottom: 16,
        }}
      >
        {question}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((opt, i) => {
          const isCursorTarget = i === cursorOnOptionIndex;
          const isSelected = isCursorTarget && clicked;
          return (
            <div
              key={i}
              style={{
                position: "relative",
                background: isSelected
                  ? "#fdf4ff"
                  : opt.emphasized
                    ? "#f4f5f7"
                    : "#f9fafb",
                border: isSelected
                  ? "1.5px solid #cd3ef9"
                  : opt.emphasized
                    ? "1px solid #d1d5db"
                    : "1px solid #eef0f4",
                borderRadius: 10,
                padding: "12px 14px",
                boxShadow: isSelected
                  ? "0 0 0 3px rgba(205, 62, 249, 0.16)"
                  : "none",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: isSelected ? "#a21caf" : "#0f1117",
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {opt.title}
                {isSelected ? <span style={{ color: "#cd3ef9" }}>✓</span> : null}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  lineHeight: 1.4,
                }}
              >
                {opt.description}
              </div>
              {isCursorTarget && clickAtFrame != null ? (
                <ClickCursor clickAtFrame={clickAtFrame} approach="br" />
              ) : null}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 12,
          padding: "12px 14px",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          fontSize: 13,
          color: "#9ca3af",
        }}
      >
        {answerPlaceholder}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 12,
        }}
      >
        <div
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            background: clicked ? "#0f1117" : "#e5e7eb",
            color: clicked ? "#ffffff" : "#9ca3af",
            fontSize: 13,
            fontWeight: clicked ? 600 : 500,
          }}
        >
          Submit
        </div>
      </div>
    </div>
  );
};
