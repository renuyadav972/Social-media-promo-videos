import React from "react";
import {
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "../fonts";

// Top-right success/info toast (e.g. "Agent Flow saved as draft").
// `appearAtFrame` is the moment it slides in; it stays until `disappearAtFrame`
// (or until the composition ends if not set).

export type StatusToastProps = {
  title: string;
  body?: string;
  variant?: "success" | "info" | "warning";
  appearAtFrame: number;
  disappearAtFrame?: number;
  // Play a success chime when the toast appears.
  chime?: boolean;
};

const VARIANT_STYLES: Record<
  NonNullable<StatusToastProps["variant"]>,
  { dot: string; ring: string; title: string }
> = {
  success: { dot: "#10b981", ring: "#a7f3d0", title: "#065f46" },
  info: { dot: "#3b82f6", ring: "#bfdbfe", title: "#1e3a8a" },
  warning: { dot: "#f59e0b", ring: "#fde68a", title: "#92400e" },
};

export const StatusToast: React.FC<StatusToastProps> = ({
  title,
  body,
  variant = "success",
  appearAtFrame,
  disappearAtFrame,
  chime = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const styles = VARIANT_STYLES[variant];

  const chimeNode = chime ? (
    <Sequence from={appearAtFrame} durationInFrames={50} layout="none">
      <Audio src={staticFile("sfx/success.m4a")} volume={0.5} />
    </Sequence>
  ) : null;

  const exitAt = disappearAtFrame ?? durationInFrames;
  if (frame < appearAtFrame || frame > exitAt) return chimeNode;

  const opacity = interpolate(
    frame,
    [appearAtFrame, appearAtFrame + 10, exitAt - 10, exitAt],
    [0, 1, 1, 0],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const translateY = interpolate(
    frame,
    [appearAtFrame, appearAtFrame + 12],
    [-12, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <>
      {chimeNode}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          opacity,
          transform: `translateY(${translateY}px)`,
        background: "#ffffff",
        border: `1px solid ${styles.ring}`,
        borderRadius: 10,
        padding: "12px 16px",
        boxShadow: "0 8px 24px rgba(15, 17, 23, 0.12)",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        fontFamily: `${INTER_FAMILY}, ${SORA_FAMILY}, sans-serif`,
        minWidth: 280,
        maxWidth: 360,
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: styles.dot,
          marginTop: 6,
          flexShrink: 0,
        }}
      />
      <div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: styles.title,
          }}
        >
          {title}
        </div>
        {body ? (
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
            {body}
          </div>
        ) : null}
      </div>
      </div>
    </>
  );
};
