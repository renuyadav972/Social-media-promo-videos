import React from "react";
import {
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "../fonts";

// Node + edge graph that mocks the Plivo agent flow canvas.
// Layout uses absolute pixel positions on a canvas of CANVAS_W × CANVAS_H so
// you can place nodes precisely. Edges are SVG paths drawn behind the nodes.
// Each node and edge has its own `appearAtFrame` for staggered reveals.

export type FlowNodeVariant = "trigger" | "purple" | "red" | "default";

export type FlowNode = {
  id: string;
  label: string;
  sublabel?: string;
  variant?: FlowNodeVariant;
  x: number; // top-left, in canvas pixels
  y: number;
  width?: number;
  appearAtFrame: number;
};

export type FlowEdge = {
  from: string;
  to: string;
  label?: string;
  appearAtFrame: number;
};

export type AgentFlowDiagramProps = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  canvasWidth?: number;
  canvasHeight?: number;
};

const DEFAULT_NODE_WIDTH = 170;
const NODE_HEIGHT = 64;

const variantStyle = (variant: FlowNodeVariant): React.CSSProperties => {
  switch (variant) {
    case "trigger":
      return { border: "1.5px solid #d1d5db", background: "#ffffff" };
    case "purple":
      return {
        border: "1.5px solid #cd3ef9",
        background: "#ffffff",
        boxShadow: "0 1px 0 rgba(205, 62, 249, 0.15)",
      };
    case "red":
      return { border: "1.5px solid #ef4444", background: "#ffffff" };
    default:
      return { border: "1.5px solid #e5e7eb", background: "#ffffff" };
  }
};

const variantBadge = (variant: FlowNodeVariant): React.CSSProperties => {
  switch (variant) {
    case "trigger":
      return { color: "#6b7280", background: "#f4f5f7" };
    case "purple":
      return { color: "#cd3ef9", background: "#fdf4ff" };
    case "red":
      return { color: "#ef4444", background: "#fef2f2" };
    default:
      return { color: "#6b7280", background: "#f4f5f7" };
  }
};

const badgeLabel = (variant: FlowNodeVariant) => {
  switch (variant) {
    case "trigger":
      return "Trigger";
    case "purple":
      return "AI";
    case "red":
      return "End";
    default:
      return "Action";
  }
};

export const AgentFlowDiagram: React.FC<AgentFlowDiagramProps> = ({
  nodes,
  edges,
  canvasWidth = 880,
  canvasHeight = 560,
}) => {
  const frame = useCurrentFrame();
  const nodesById = React.useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n])),
    [nodes],
  );

  return (
    <div
      style={{
        position: "relative",
        width: canvasWidth,
        height: canvasHeight,
        fontFamily: `${INTER_FAMILY}, ${SORA_FAMILY}, sans-serif`,
        color: "#0f1117",
      }}
    >
      {/* Edges drawn first so they sit behind nodes. */}
      <svg
        width={canvasWidth}
        height={canvasHeight}
        style={{ position: "absolute", inset: 0 }}
      >
        {edges.map((e, i) => {
          const from = nodesById[e.from];
          const to = nodesById[e.to];
          if (!from || !to) return null;
          const fromWidth = from.width ?? DEFAULT_NODE_WIDTH;
          const toWidth = to.width ?? DEFAULT_NODE_WIDTH;
          const x1 = from.x + fromWidth / 2;
          const y1 = from.y + NODE_HEIGHT;
          const x2 = to.x + toWidth / 2;
          const y2 = to.y;
          // Orthogonal "elbow" connector with rounded corners (matches the real
          // Plivo flow canvas): straight down from the parent to a branch bus,
          // across, then straight down to the child — not a smooth S-curve.
          const midY = Math.min(y1 + 38, y2 - 14);
          const r = Math.min(9, Math.abs(x2 - x1) / 2, Math.abs(y2 - midY));
          let path: string;
          if (Math.abs(x2 - x1) < 1.5) {
            path = `M ${x1} ${y1} L ${x2} ${y2}`;
          } else {
            const dir = x2 > x1 ? 1 : -1;
            path =
              `M ${x1} ${y1} L ${x1} ${midY - r} ` +
              `Q ${x1} ${midY} ${x1 + dir * r} ${midY} ` +
              `L ${x2 - dir * r} ${midY} ` +
              `Q ${x2} ${midY} ${x2} ${midY + r} ` +
              `L ${x2} ${y2}`;
          }
          const reveal = interpolate(
            frame,
            [e.appearAtFrame, e.appearAtFrame + 18],
            [0, 1],
            {
              easing: Easing.inOut(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );
          return (
            <g key={i} opacity={reveal}>
              <path
                d={path}
                stroke="#cbd5e1"
                strokeWidth={1.5}
                fill="none"
                strokeLinecap="round"
                pathLength={1}
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: 1 - reveal,
                }}
              />
              {e.label ? (
                <foreignObject
                  x={x2 - 90}
                  y={midY - 13}
                  width={180}
                  height={28}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "#6b7280",
                      background: "#ffffff",
                      padding: "2px 8px",
                      borderRadius: 6,
                      display: "inline-block",
                      border: "1px solid #eef0f4",
                    }}
                  >
                    {e.label}
                  </div>
                </foreignObject>
              ) : null}
            </g>
          );
        })}
      </svg>

      {/* Nodes on top. */}
      {nodes.map((n) => {
        const variant = n.variant ?? "default";
        const reveal = interpolate(
          frame,
          [n.appearAtFrame, n.appearAtFrame + 12],
          [0, 1],
          {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        const translateY = (1 - reveal) * 8;
        // A purple glow that flares as the node lands, then fades — so the
        // eye follows the flow being assembled one node at a time.
        const glow = interpolate(
          frame,
          [n.appearAtFrame, n.appearAtFrame + 28],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const base = variantStyle(variant);
        return (
          <div
            key={n.id}
            style={{
              position: "absolute",
              left: n.x,
              top: n.y,
              width: n.width ?? DEFAULT_NODE_WIDTH,
              minHeight: NODE_HEIGHT,
              borderRadius: 10,
              padding: "8px 12px",
              opacity: reveal,
              transform: `translateY(${translateY}px)`,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              ...base,
              boxShadow:
                glow > 0.01
                  ? `0 0 0 ${2.5 * glow}px rgba(205, 62, 249, ${0.32 * glow}), 0 6px 18px rgba(205, 62, 249, ${0.16 * glow})`
                  : (base.boxShadow as string | undefined),
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                padding: "2px 6px",
                borderRadius: 4,
                alignSelf: "flex-start",
                ...variantBadge(variant),
              }}
            >
              {badgeLabel(variant)}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>
              {n.label}
            </div>
            {n.sublabel ? (
              <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.3 }}>
                {n.sublabel}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
