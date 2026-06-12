import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SORA_FAMILY } from "./fonts";

const FONT_STACK = `${SORA_FAMILY}, sans-serif`;

// Opening hook, voice-led. Beat A: the "old way" as one horizontal line
// (Spec · Team · Weeks) revealed as the narration lists them. Beat B: the hook.
const BULLETS = [
  { text: "Spec", at: 62 },
  { text: "Team", at: 78 },
  { text: "Weeks", at: 94 },
];

export const TaglineIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const beatBStart = 112;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const ease = { easing: Easing.inOut(Easing.cubic), ...clamp };

  const aOpacity = interpolate(
    frame,
    [0, 12, beatBStart - 16, beatBStart],
    [0, 1, 1, 0],
    ease,
  );

  const fadeOutStart = durationInFrames - 14;
  const bOpacity = interpolate(
    frame,
    [beatBStart, beatBStart + 14, fadeOutStart, durationInFrames],
    [0, 1, 1, 0],
    ease,
  );
  const bScale = interpolate(
    frame,
    [beatBStart, beatBStart + 14, fadeOutStart, durationInFrames],
    [0.97, 1, 1, 1.02],
    ease,
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f6f5f3",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONT_STACK,
      }}
    >
      {/* Beat A: the old way, on one line */}
      <div style={{ position: "absolute", opacity: aOpacity, textAlign: "center" }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 6,
            color: "#9ca3af",
            textTransform: "uppercase",
            marginBottom: 22,
          }}
        >
          The old way
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
          }}
        >
          {BULLETS.map((b, i) => {
            const reveal = interpolate(frame, [b.at, b.at + 12], [0, 1], {
              easing: Easing.out(Easing.cubic),
              ...clamp,
            });
            return (
              <React.Fragment key={i}>
                {i > 0 ? (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#cd3ef9",
                      opacity: reveal * 0.9,
                    }}
                  />
                ) : null}
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 600,
                    color: "#0f1117",
                    letterSpacing: -1,
                    opacity: reveal,
                    transform: `translateY(${(1 - reveal) * 6}px)`,
                  }}
                >
                  {b.text}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Beat B: the hook */}
      <div
        style={{
          position: "absolute",
          opacity: bOpacity,
          transform: `scale(${bScale})`,
          textAlign: "center",
          padding: "0 160px",
          maxWidth: 1300,
        }}
      >
        <div
          style={{
            fontSize: 50,
            fontWeight: 600,
            color: "#0f1117",
            lineHeight: 1.18,
            letterSpacing: -1,
          }}
        >
          What if all you needed was just a{" "}
          <span style={{ color: "#cd3ef9" }}>simple prompt</span>?
        </div>
      </div>
    </AbsoluteFill>
  );
};
