import React from "react";
import { useCurrentFrame } from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "../fonts";

// The simulation results table. Each row has a `passAtFrame` — before that
// frame the row shows Running; after, it shows High quality. Edit the array
// and rows reflow instantly.

export type ScenarioRow = {
  name: string;
  passAtFrame: number;
  // When true, the row shows a red "Failed" state before passAtFrame instead
  // of the neutral "Running" spinner — used in the self-improvement beat to
  // show a failing test being fixed and flipping to High quality.
  startsFailed?: boolean;
  // The goal this scenario checks (shown in the Goal Status column).
  goal?: string;
  // Conversation Quality shown once passed (default "High").
  quality?: "High" | "Medium" | "Low";
};

export type TestScenariosTableProps = {
  rows: ScenarioRow[];
};

export const TestScenariosTable: React.FC<TestScenariosTableProps> = ({
  rows,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #eef0f4",
        borderRadius: 12,
        overflow: "hidden",
        fontFamily: `${INTER_FAMILY}, ${SORA_FAMILY}, sans-serif`,
        color: "#0f1117",
        fontSize: 14,
        width: "100%",
        maxWidth: 820,
      }}
    >
      {/* Header tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: "12px 16px",
          borderBottom: "1px solid #eef0f4",
          alignItems: "center",
        }}
      >
        <div
          style={{
            padding: "6px 12px",
            background: "#f4f5f7",
            borderRadius: 8,
            fontSize: 13,
            color: "#0f1117",
          }}
        >
          Test Scenarios
        </div>
        <div
          style={{
            padding: "6px 12px",
            background: "#0f1117",
            color: "#ffffff",
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          Simulation Results
        </div>
        <div
          style={{
            padding: "6px 12px",
            border: "1px dashed #d1d5db",
            borderRadius: 8,
            fontSize: 13,
            color: "#6b7280",
            marginLeft: 8,
          }}
        >
          + Keywords
        </div>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.4fr 1.4fr 0.8fr",
          padding: "12px 16px",
          color: "#6b7280",
          fontSize: 12,
          fontWeight: 600,
          textTransform: "none",
          borderBottom: "1px solid #f4f5f7",
        }}
      >
        <div>Test Scenarios</div>
        <div>Goal Status</div>
        <div>Conversation Quality</div>
        <div>Debug</div>
      </div>

      {/* Rows */}
      {rows.map((r, i) => {
        const passed = frame >= r.passAtFrame;
        return (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.4fr 1.4fr 0.8fr",
              padding: "14px 16px",
              alignItems: "center",
              borderBottom:
                i === rows.length - 1 ? "none" : "1px solid #f4f5f7",
              fontSize: 13,
            }}
          >
            <div>{r.name}</div>
            <div>
              {passed ? (
                <span style={{ color: "#059669", fontWeight: 600 }}>✓ Achieved</span>
              ) : r.startsFailed ? (
                <span style={{ color: "#ef4444" }}>✕ Not achieved</span>
              ) : (
                <span style={{ color: "#6b7280" }}>↻ Running</span>
              )}
            </div>
            <div
              style={{
                color: passed
                  ? (r.quality ?? "High") === "Medium"
                    ? "#d97706"
                    : "#059669"
                  : r.startsFailed
                    ? "#ef4444"
                    : "#6b7280",
                fontWeight: passed ? 600 : 400,
              }}
            >
              {passed ? (r.quality ?? "High") : r.startsFailed ? "Low" : "↻ Running"}
            </div>
            <div>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "#f4f5f7",
                  color: "#6b7280",
                  fontSize: 12,
                }}
              >
                {"</> JSON ▾"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
