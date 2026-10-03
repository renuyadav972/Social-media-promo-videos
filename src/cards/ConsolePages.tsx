import React from "react";
import { NewConsoleShell, PageHeader } from "./NewConsoleShell";
import { Ico } from "./consoleIcons";
import { ClickCursor } from "./ClickCursor";
import { SORA_FAMILY, INTER_FAMILY } from "../fonts";

// ============================================================================
// Clean recreations of the Plivo console Home and AI Agents pages, used for the
// opening of the Call Scheduling Agent tutorial. Built from the user's real
// screenshots but stripped of personal data (name, Auth ID, credits) and
// clutter (the Agents list shows a single agent instead of many).
// ============================================================================

const INK = "#1f2430";
const SUB = "#6b7280";
const HAIR = "#ececef";

// ---- AI Agents list (one agent + Create Agent) ---------------------------
const FilterChip: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 40, padding: "0 15px", border: `1px solid ${HAIR}`, borderRadius: 10, fontSize: 14, color: SUB, fontWeight: 500 }}>
    <span style={{ color: "#b6bcc7", display: "inline-flex" }}><Ico name="plus" size={14} /></span>
    {label}
  </div>
);
const Th: React.FC<{ w: number | string; children?: React.ReactNode }> = ({ w, children }) => (
  <div style={{ flex: `0 0 ${typeof w === "number" ? `${w}px` : w}`, width: typeof w === "number" ? w : undefined }}>{children}</div>
);

export const AgentsPage: React.FC<{ createCursorFrame?: number }> = ({ createCursorFrame }) => (
  <NewConsoleShell activeNav="Agents" topBar="live">
    <PageHeader title="Agents" subtitle="Manage agents for your organization" />
    {/* toolbar */}
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 30px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, height: 40, padding: "0 15px", border: `1px solid ${HAIR}`, borderRadius: 10, width: 320, color: "#9aa0ac", fontSize: 14.5 }}>
        <Ico name="search" size={16} /> Search by name...
      </div>
      <FilterChip label="Status" />
      <FilterChip label="Trigger" />
      <FilterChip label="Created By" />
      <span style={{ flex: 1 }} />
      <div style={{ display: "inline-flex", alignItems: "center", gap: 9, height: 40, padding: "0 17px", border: `1px solid ${HAIR}`, borderRadius: 10, fontSize: 14.5, fontWeight: 600, color: INK }}>
        <Ico name="download" size={16} /> Import Agent
      </div>
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 9, height: 40, padding: "0 20px", borderRadius: 10, background: "#1f2430", color: "#fff", fontSize: 14.5, fontWeight: 600 }}>
        <Ico name="plus" size={16} /> Create Agent
        {createCursorFrame != null ? <ClickCursor clickAtFrame={createCursorFrame} approach="tr" offset={{ x: 34, y: 18 }} /> : null}
      </div>
    </div>
    {/* table */}
    <div style={{ padding: "22px 30px 0", fontFamily: `${INTER_FAMILY}, sans-serif` }}>
      <div style={{ display: "flex", alignItems: "center", fontSize: 14, fontWeight: 600, color: SUB, padding: "0 6px 14px", borderBottom: `1px solid ${HAIR}` }}>
        <Th w={320}>Name</Th>
        <Th w={130}>Status</Th>
        <Th w={190}>Trigger</Th>
        <Th w={170}>Created By</Th>
        <Th w={200}>Knowledge Bases</Th>
        <Th w="auto">Updated At</Th>
      </div>
      <div style={{ display: "flex", alignItems: "center", padding: "22px 6px", borderBottom: `1px solid ${HAIR}`, fontSize: 15 }}>
        <Th w={320}><span style={{ fontWeight: 600, color: INK }}>Call Scheduling Agent</span></Th>
        <Th w={130}>
          <span style={{ background: "#e7f8ee", color: "#15a34a", fontSize: 13, fontWeight: 600, padding: "4px 13px", borderRadius: 7 }}>Active</span>
        </Th>
        <Th w={190}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, color: INK }}>
            <span style={{ color: "#15a34a", display: "inline-flex" }}><Ico name="phone" size={17} /></span> Voice Call
          </span>
        </Th>
        <Th w={170} />
        <Th w={200} />
        <Th w="auto"><span style={{ color: SUB }}>Sep 8, 2026 5:32 PM</span></Th>
      </div>
    </div>
  </NewConsoleShell>
);

// ---- Home (clean, no name / Auth ID / credits) ---------------------------
const StartCard: React.FC<{ eyebrow: string; sub: string; rows: { title: string; sub: string }[] }> = ({ eyebrow, sub, rows }) => (
  <div style={{ flex: 1, background: "#fff", border: `1px solid ${HAIR}`, borderRadius: 14, padding: "22px 22px 8px" }}>
    <div style={{ fontSize: 16, fontWeight: 700, color: INK }}>{eyebrow}</div>
    <div style={{ fontSize: 13.5, color: SUB, marginTop: 4, marginBottom: 16 }}>{sub}</div>
    {rows.map((r) => (
      <div key={r.title} style={{ display: "flex", alignItems: "center", gap: 13, border: `1px solid ${HAIR}`, borderRadius: 11, padding: "13px 15px", marginBottom: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "#f4f5f7", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14.5, fontWeight: 600, color: INK }}>{r.title}</div>
          <div style={{ fontSize: 12.5, color: SUB }}>{r.sub}</div>
        </div>
        <span style={{ color: "#c2c6ce", fontSize: 16 }}>›</span>
      </div>
    ))}
  </div>
);

export const HomePage: React.FC = () => (
  <NewConsoleShell activeNav="Home" topBar="live">
    <div style={{ padding: "34px 40px", fontFamily: `${INTER_FAMILY}, sans-serif` }}>
      <div style={{ fontSize: 27, fontWeight: 700, color: INK, letterSpacing: -0.4, fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif` }}>Welcome back 👋</div>
      <div style={{ fontSize: 15, color: SUB, marginTop: 6, marginBottom: 30 }}>Let's get you started.</div>
      <div style={{ display: "flex", gap: 22 }}>
        <StartCard eyebrow="Build your first use case" sub="Seamlessly integrate your communication logic." rows={[{ title: "AI Agents", sub: "Answer calls with a voice agent" }, { title: "Applications", sub: "Create and manage applications" }]} />
        <StartCard eyebrow="Deploy" sub="Launch your services across channels." rows={[{ title: "Buy Phone Number", sub: "Numbers for Voice and SMS" }, { title: "WhatsApp", sub: "WABA profiles and templates" }]} />
        <StartCard eyebrow="Monitor performance" sub="Track performance in realtime." rows={[{ title: "Logs", sub: "View call and messaging logs" }, { title: "Alerting", sub: "Configure alerts and notifications" }]} />
      </div>
    </div>
  </NewConsoleShell>
);
