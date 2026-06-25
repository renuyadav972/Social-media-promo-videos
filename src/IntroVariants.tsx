import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";
import { PlivoLogoSvg } from "./PlivoLogoSvg";

// Two candidate animations for the "Introducing Vibe Agent" intro beat, so we
// can compare which reads better. The winner gets folded into VibePromoMerged.

const CREAM_BG = "radial-gradient(120% 95% at 50% 0%, #fbfaf8 0%, #f6f5f3 55%, #efeeea 100%)";
const GRAD = "linear-gradient(95deg, #cd3ef9 0%, #9333ea 100%)";
const NAME_STYLE: React.CSSProperties = {
  fontSize: 80,
  fontWeight: 600,
  letterSpacing: -2.6,
  // lineHeight 1.0 + background-clip:text clips the "g" descender — give it room.
  lineHeight: 1.25,
  paddingBottom: 4,
};
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE_OUT = { easing: Easing.out(Easing.cubic), ...CLAMP } as const;

const Eyebrow: React.FC<{ o: number; y?: number }> = ({ o, y = 0 }) => (
  <div style={{ opacity: o, transform: `translateY(${y}px)`, fontSize: 22, fontWeight: 600, letterSpacing: 7, color: "#9ca3af", textTransform: "uppercase", marginBottom: 20 }}>
    Introducing
  </div>
);
const ByPlivo: React.FC<{ o: number; y?: number }> = ({ o, y = 0 }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 22, opacity: o, transform: `translateY(${y}px)` }}>
    <span style={{ fontSize: 26, fontWeight: 400, color: "#0f1117", opacity: 0.55 }}>from</span>
    <PlivoLogoSvg width={140} />
  </div>
);

// ===== Option 1 — staggered rise + gradient shimmer =====
export const IntroShimmer: React.FC = () => {
  const frame = useCurrentFrame();
  const eyebrowO = interpolate(frame, [4, 18], [0, 1], EASE_OUT);
  const eyebrowY = interpolate(frame, [4, 18], [12, 0], EASE_OUT);
  const riseVibe = interpolate(frame, [14, 34], [0, 1], EASE_OUT);
  const riseAgent = interpolate(frame, [22, 42], [0, 1], EASE_OUT);
  const word = (r: number): React.CSSProperties => ({
    display: "inline-block",
    transform: `translateY(${(1 - r) * 28}px)`,
    filter: `blur(${(1 - r) * 9}px)`,
    opacity: r,
    backgroundImage: GRAD,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  });
  const shinePos = interpolate(frame, [44, 84], [170, -70], EASE_OUT);
  const shineO = interpolate(frame, [44, 54, 78, 88], [0, 1, 1, 0], CLAMP);
  const byO = interpolate(frame, [42, 58], [0, 1], EASE_OUT);
  const byY = interpolate(frame, [42, 58], [10, 0], EASE_OUT);
  return (
    <AbsoluteFill style={{ background: CREAM_BG, justifyContent: "center", alignItems: "center", fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif` }}>
      <div style={{ textAlign: "center" }}>
        <Eyebrow o={eyebrowO} y={eyebrowY} />
        <div style={{ position: "relative", display: "inline-block", ...NAME_STYLE }}>
          <span style={word(riseVibe)}>Vibe</span>{" "}
          <span style={word(riseAgent)}>Agent</span>
          <div
            style={{
              position: "absolute",
              inset: 0,
              ...NAME_STYLE,
              opacity: shineO,
              backgroundImage: "linear-gradient(100deg, transparent 42%, rgba(255,255,255,0.9) 50%, transparent 58%)",
              backgroundSize: "260% 100%",
              backgroundPositionX: `${shinePos}%`,
              backgroundRepeat: "no-repeat",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              pointerEvents: "none",
            }}
          >
            Vibe Agent
          </div>
        </div>
        <ByPlivo o={byO} y={byY} />
      </div>
    </AbsoluteFill>
  );
};

// ===== Option 2 — scale-up with glow + sparkle =====
export const IntroGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const outFade = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], CLAMP);
  const eyebrowO = interpolate(frame, [4, 18], [0, 1], EASE_OUT);
  const s = spring({ frame: frame - 14, fps, config: { damping: 14, stiffness: 110 }, durationInFrames: 26 });
  const nameO = interpolate(frame, [14, 26], [0, 1], EASE_OUT);
  const nameScale = 0.62 + s * 0.38;
  const glowO = interpolate(frame, [16, 34, 62, 84], [0, 0.95, 0.55, 0.4], CLAMP);
  const glowScale = interpolate(frame, [16, 52], [0.5, 1.15], EASE_OUT);
  const sparkleS = spring({ frame: frame - 30, fps, config: { damping: 9, stiffness: 150 }, durationInFrames: 20 });
  const sparkleO = interpolate(frame, [30, 38, 72, 88], [0, 1, 1, 0.75], CLAMP);
  const byO = interpolate(frame, [42, 58], [0, 1], EASE_OUT);
  return (
    <AbsoluteFill style={{ background: CREAM_BG, justifyContent: "center", alignItems: "center", fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif` }}>
      <div style={{ position: "relative", textAlign: "center", opacity: outFade }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "54%",
            width: 660,
            height: 320,
            transform: `translate(-50%, -50%) scale(${glowScale})`,
            background: "radial-gradient(ellipse at center, rgba(205,62,249,0.5) 0%, rgba(205,62,249,0) 70%)",
            opacity: glowO,
            filter: "blur(22px)",
            pointerEvents: "none",
          }}
        />
        <Eyebrow o={eyebrowO} />
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              opacity: nameO,
              transform: `scale(${nameScale})`,
              ...NAME_STYLE,
              backgroundImage: GRAD,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Vibe Agent
          </div>
          <div style={{ position: "absolute", top: -20, right: -34, opacity: sparkleO, transform: `scale(${0.4 + sparkleS}) rotate(${sparkleS * 20}deg)` }}>
            <svg width="48" height="48" viewBox="0 0 20 20" fill="none">
              <path d="M10 1 12 8 19 10 12 12 10 19 8 12 1 10 8 8Z" fill="#cd3ef9" />
            </svg>
          </div>
        </div>
        <ByPlivo o={byO} />
      </div>
    </AbsoluteFill>
  );
};
