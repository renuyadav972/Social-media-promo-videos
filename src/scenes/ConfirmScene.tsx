import React from "react";
import { PlivoAppShell } from "../cards/PlivoAppShell";
import { VibeQuestionCard } from "../cards/VibeQuestionCard";
import { SORA_FAMILY, INTER_FAMILY } from "../fonts";

// Native recreation of the Confirm moment (replaces clips/03-confirm.mp4
// so the camera frames the question card perfectly with no scroll-away).
//
// The right panel renders a brief agent-rules paragraph (so the viewer
// senses Vibe was writing the plan) followed by the "Vibe Agent needs
// your input" card. All copy is local — edit here to change what Vibe asks.

export const ConfirmScene: React.FC = () => {
  return (
    <PlivoAppShell
      agentName="Lead Qualification for Plivo"
      agentStatus="Unsaved"
      activeTab="Flow"
      canvas={
        <div
          style={{
            width: 220,
            padding: "12px 20px",
            borderRadius: 12,
            border: "1px dashed #d1d5db",
            color: "#9ca3af",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          ⊕ Select Trigger
        </div>
      }
      chatPanel={
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "20px 20px",
            gap: 14,
            overflow: "hidden",
            fontFamily: `${INTER_FAMILY}, ${SORA_FAMILY}, sans-serif`,
            color: "#0f1117",
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          {/* Top: chat panel header dots */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              color: "#9ca3af",
              fontSize: 16,
              gap: 12,
              marginBottom: 4,
            }}
          >
            <span>⋯</span>
            <span>✕</span>
          </div>

          {/* Agent-written rules (preamble before the question card). */}
          <div style={{ color: "#0f1117" }}>
            · Stay focused on lead qualification and product / service interest.
            <br />
            · Do not pressure the caller; respect refusals and do-not-contact
            requests.
            <br />
            · Treat email, phone, company details, and business needs as
            confidential lead information.
          </div>

          {/* The question card — staggered to feel like it just appeared. */}
          <VibeQuestionCard
            header="Vibe Agent needs your input"
            question="Should I build this lead qualification call flow using the plan above?"
            options={[
              {
                title: "Approve",
                description:
                  "Build the flow as planned with the default BANT scoring model and API submission.",
                emphasized: true,
              },
              {
                title: "Revise",
                description:
                  "I want to change the flow, scoring, API behavior, or call handling before you build.",
              },
            ]}
            appearAtFrame={18}
          />
        </div>
      }
    />
  );
};
