import React from "react";
import { PlivoLogoSvg } from "../PlivoLogoSvg";
import { SORA_FAMILY, INTER_FAMILY } from "../fonts";
import { Ico } from "./consoleIcons";

// ============================================================================
// NewConsoleShell — a code-controlled mock of the REDESIGNED Plivo console
// (the "new" console in the old-vs-new comparison video). Light theme, a single
// grouped left sidebar (BUILD / DEPLOY / MONITOR), a slim top bar, and an
// optional account dropdown that holds every account/settings/billing item.
//
// The page body is passed as `children`. Everything that could change in the
// real product (active nav item, plan badge, which account-menu group is open)
// is a prop, so beats can be retimed or edited without touching the chrome.
// Brand purple #cd3ef9 is applied to the active nav state for hero punch.
// ============================================================================

// Brand purple is reserved for the Plivo logo only; the real console UI is
// otherwise neutral (near-black actions, faint-grey active nav, green status).
export const PURPLE = "#cd3ef9";
export const LINK = "#3b6cf0"; // muted blue used for inline links (Add Credits, etc.)
const INK = "#1f2430";
const SUB = "#6b7280";
const HAIR = "#ececef";
const ACTIVE_BG = "#f1f1f6"; // faint cool-grey active-nav pill (matches production)
const RAIL_BG = "#ffffff";
const CANVAS_BG = "#f7f7f9";

// ---- Line icons (crisp at rail size) -------------------------------------
type IconName =
  | "home"
  | "agents"
  | "sip"
  | "verify"
  | "applications"
  | "endpoints"
  | "phone"
  | "whatsapp"
  | "compliance"
  | "chatwidget"
  | "runs"
  | "logs"
  | "analytics"
  | "alerting";

const Icon: React.FC<{ name: IconName; size?: number }> = ({ name, size = 18 }) => {
  const c: React.SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "home":
      return (
        <svg {...c}>
          <path d="M3 8.5 10 3l7 5.5" />
          <path d="M5 8v8.5h10V8" />
        </svg>
      );
    case "agents": // little robot
      return (
        <svg {...c}>
          <rect x="4.5" y="6.5" width="11" height="8.5" rx="2.5" />
          <path d="M10 4v2.5" />
          <circle cx="10" cy="3.4" r="1" fill="currentColor" stroke="none" />
          <circle cx="8" cy="10.5" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="12" cy="10.5" r="0.6" fill="currentColor" stroke="none" />
          <path d="M2.8 9.5v2.5M17.2 9.5v2.5" />
        </svg>
      );
    case "sip": // stacked servers
      return (
        <svg {...c}>
          <rect x="3.5" y="4" width="13" height="5" rx="1.4" />
          <rect x="3.5" y="11" width="13" height="5" rx="1.4" />
          <circle cx="6.4" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
          <circle cx="6.4" cy="13.5" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "verify": // shield check
      return (
        <svg {...c}>
          <path d="M10 2.8 16 5v4.5c0 4-2.6 6.4-6 7.7-3.4-1.3-6-3.7-6-7.7V5z" />
          <path d="M7.4 9.8 9.3 11.7 12.9 8" />
        </svg>
      );
    case "applications": // code brackets
      return (
        <svg {...c}>
          <path d="M7.5 6 4 10l3.5 4M12.5 6 16 10l-3.5 4" />
        </svg>
      );
    case "endpoints": // plug / node
      return (
        <svg {...c}>
          <circle cx="10" cy="10" r="2.4" />
          <path d="M10 2.6v3M10 14.4v3M2.6 10h3M14.4 10h3" />
        </svg>
      );
    case "phone": // hash (numbers)
      return (
        <svg {...c}>
          <path d="M7 3 5.6 17M14.4 3 13 17M3.5 7.2h13M3 12.8h13" />
        </svg>
      );
    case "whatsapp": // chat bubble + dot tail
      return (
        <svg {...c}>
          <path d="M4 15.5 5 13a6.3 6.3 0 1 1 2.4 2.3z" />
        </svg>
      );
    case "compliance": // clipboard check
      return (
        <svg {...c}>
          <rect x="4.5" y="4" width="11" height="13" rx="1.8" />
          <path d="M7.5 4V3h5v1" />
          <path d="M7.6 10.4 9.1 11.9 12.6 8.4" />
        </svg>
      );
    case "chatwidget": // rounded speech bubble
      return (
        <svg {...c}>
          <path d="M4 5.5h12a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 16 13.5H9l-3.5 3v-3H4a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 4 5.5z" />
        </svg>
      );
    case "runs": // play in circle
      return (
        <svg {...c}>
          <circle cx="10" cy="10" r="7" />
          <path d="M8.5 7 14 10l-5.5 3z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "logs": // list lines
      return (
        <svg {...c}>
          <path d="M7 5.5h10M7 10h10M7 14.5h10" />
          <circle cx="3.6" cy="5.5" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="3.6" cy="10" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="3.6" cy="14.5" r="0.7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "analytics": // bar chart
      return (
        <svg {...c}>
          <path d="M3.5 16.5h13" />
          <rect x="5" y="9" width="2.4" height="5.5" rx="0.6" />
          <rect x="9" y="6" width="2.4" height="8.5" rx="0.6" />
          <rect x="13" y="11" width="2.4" height="3.5" rx="0.6" />
        </svg>
      );
    case "alerting": // bell
      return (
        <svg {...c}>
          <path d="M6 8.5a4 4 0 0 1 8 0c0 4 1.5 5 1.5 5h-11s1.5-1 1.5-5z" />
          <path d="M8.6 16a1.6 1.6 0 0 0 2.8 0" />
        </svg>
      );
  }
};

// ---- Nav model -----------------------------------------------------------
type NavItem = { label: string; icon: IconName };
type NavGroup = { title: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    title: "BUILD",
    items: [
      { label: "Agents", icon: "agents" },
      { label: "SIP Trunking", icon: "sip" },
      { label: "Verify", icon: "verify" },
      { label: "Applications", icon: "applications" },
      { label: "Endpoints", icon: "endpoints" },
    ],
  },
  {
    title: "DEPLOY",
    items: [
      { label: "Phone Numbers", icon: "phone" },
      { label: "WhatsApp", icon: "whatsapp" },
      { label: "Compliance", icon: "compliance" },
      { label: "Chat Widget", icon: "chatwidget" },
    ],
  },
  {
    title: "MONITOR",
    items: [
      { label: "Agent Runs", icon: "runs" },
      { label: "Logs", icon: "logs" },
      { label: "Analytics", icon: "analytics" },
      { label: "Alerting", icon: "alerting" },
    ],
  },
];

// Account dropdown items (the consolidated account/settings hub).
const ACCOUNT_ITEMS = [
  "Profile",
  "Team Setup",
  "Account Limits",
  "Sub accounts",
  "IP Whitelisting",
  "Geo Permissions",
  "Endpoints",
  "Messaging Settings",
  "Voice Settings",
  "SIP Trunking Settings",
  "Billing",
] as const;

export type NewConsoleShellProps = {
  // Which sidebar item is highlighted (matches a NavItem.label, or "Home").
  activeNav?: string;
  children: React.ReactNode;
  // Render the account dropdown open under the avatar.
  accountMenuOpen?: boolean;
  // Highlight a single account-menu item (e.g. "Billing").
  accountActiveItem?: string;
  // Expand the Billing sub-list inside the account menu.
  accountBillingExpanded?: boolean;
  // Dim/blur the whole shell slightly (used while it sits behind a transition).
  dim?: number;
  // When set, the main sidebar collapses to an icon rail and this secondary
  // panel opens next to it (matches the real Analytics flyout).
  secondaryNav?: { title: string; items: string[]; active: string };
};

// All nav icons in order, for the collapsed icon rail.
const ALL_RAIL: { label: string; icon: IconName }[] = [
  { label: "Home", icon: "home" },
  ...NAV_GROUPS.flatMap((g) => g.items),
];

const CollapsedRail: React.FC<{ activeNav: string }> = ({ activeNav }) => (
  <div style={{ width: 54, flexShrink: 0, borderRight: `1px solid ${HAIR}`, background: RAIL_BG, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: 4 }}>
    <div style={{ marginBottom: 12 }}>
      <svg width="20" height="20" viewBox="0 0 20 20"><path d="M4 3h3l6 7-6 7H4l6-7z" fill={PURPLE} /></svg>
    </div>
    {ALL_RAIL.map((it) => {
      const active = it.label === activeNav;
      return (
        <div key={it.label} style={{ width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: active ? INK : "#9aa0ac", background: active ? ACTIVE_BG : "transparent" }}>
          <Icon name={it.icon} />
        </div>
      );
    })}
  </div>
);

const SecondaryPanel: React.FC<{ nav: { title: string; items: string[]; active: string } }> = ({ nav }) => (
  <div style={{ width: 210, flexShrink: 0, borderRight: `1px solid ${HAIR}`, background: RAIL_BG, padding: "18px 12px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px 14px", fontSize: 15, fontWeight: 700, color: INK }}>
      <span style={{ color: "#9aa0ac", display: "inline-flex" }}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4 6 10l6 6" /></svg>
      </span>
      {nav.title}
    </div>
    {nav.items.map((it) => {
      const active = it === nav.active;
      return (
        <div key={it} style={{ display: "flex", alignItems: "center", gap: 9, height: 34, padding: "0 10px", borderRadius: 8, fontSize: 13.5, fontWeight: active ? 600 : 500, color: active ? INK : "#404654", background: active ? ACTIVE_BG : "transparent" }}>
          <span style={{ color: active ? "#3a4150" : "#9aa0ac", display: "inline-flex" }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3.5 16.5h13" strokeLinecap="round" /><rect x="5" y="9" width="2.2" height="5" rx="0.5" /><rect x="9" y="6" width="2.2" height="8" rx="0.5" /><rect x="13" y="11" width="2.2" height="3" rx="0.5" /></svg>
          </span>
          {it}
        </div>
      );
    })}
  </div>
);

const NavRow: React.FC<{ item: NavItem; active: boolean }> = ({ item, active }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 11,
      height: 34,
      padding: "0 10px",
      borderRadius: 8,
      color: active ? INK : "#404654",
      background: active ? ACTIVE_BG : "transparent",
      fontWeight: active ? 600 : 500,
      fontSize: 14,
    }}
  >
    <span style={{ display: "inline-flex", color: active ? "#3a4150" : "#8b91a0" }}>
      <Icon name={item.icon} />
    </span>
    {item.label}
  </div>
);

const TopPill: React.FC<{
  children: React.ReactNode;
  accent?: boolean;
  muted?: boolean;
}> = ({ children, accent, muted }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      height: 32,
      padding: "0 12px",
      borderRadius: 8,
      border: `1px solid ${accent ? PURPLE : "#e6e7ea"}`,
      background: accent ? "#fdf3ff" : "#ffffff",
      color: accent ? PURPLE : muted ? SUB : INK,
      fontSize: 13,
      fontWeight: 500,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

export const NewConsoleShell: React.FC<NewConsoleShellProps> = ({
  activeNav = "Home",
  children,
  accountMenuOpen = false,
  accountActiveItem,
  accountBillingExpanded = false,
  dim = 0,
  secondaryNav,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#ffffff",
        display: "flex",
        fontFamily: `${INTER_FAMILY}, ${SORA_FAMILY}, sans-serif`,
        color: INK,
        position: "relative",
        filter: dim > 0 ? `brightness(${1 - dim * 0.12})` : undefined,
      }}
    >
      {secondaryNav ? (
        <>
          <CollapsedRail activeNav={activeNav} />
          <SecondaryPanel nav={secondaryNav} />
        </>
      ) : (
      /* ---- Left sidebar ---- */
      <div
        style={{
          width: 234,
          flexShrink: 0,
          borderRight: `1px solid ${HAIR}`,
          background: RAIL_BG,
          display: "flex",
          flexDirection: "column",
          padding: "18px 14px 14px",
        }}
      >
        {/* Brand + region switcher */}
        <div style={{ padding: "0 6px 4px" }}>
          <PlivoLogoSvg width={84} />
        </div>
        <div
          style={{
            margin: "14px 6px 8px",
            height: 38,
            borderRadius: 9,
            border: `1px solid ${HAIR}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 10px",
            fontSize: 13,
            color: INK,
          }}
        >
          <span
            style={{
              width: 18,
              height: 13,
              borderRadius: 2,
              background:
                "linear-gradient(180deg,#b22234 0 33%,#fff 33% 66%,#3c3b6e 66% 100%)",
              flexShrink: 0,
            }}
          />
          <span style={{ fontWeight: 600 }}>plivo</span>
          <span style={{ flex: 1 }} />
          <span style={{ color: "#b8bcc6", fontSize: 11 }}>▾</span>
        </div>

        {/* Home (above the groups) */}
        <div style={{ marginTop: 4 }}>
          <NavRow item={{ label: "Home", icon: "home" }} active={activeNav === "Home"} />
        </div>

        {/* Grouped nav */}
        {NAV_GROUPS.map((g) => (
          <div key={g.title} style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 1.2,
                color: "#a3a8b4",
                padding: "0 10px 6px",
              }}
            >
              {g.title}
            </div>
            {g.items.map((it) => (
              <NavRow key={it.label} item={it} active={activeNav === it.label} />
            ))}
          </div>
        ))}
        <div style={{ flex: 1 }} />
      </div>
      )}

      {/* ---- Right column: top bar + page ---- */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <div
          style={{
            height: 56,
            flexShrink: 0,
            borderBottom: `1px solid ${HAIR}`,
            display: "flex",
            alignItems: "center",
            padding: "0 22px",
            gap: 14,
            background: "#ffffff",
          }}
        >
          <span style={{ color: "#9aa0ac", display: "inline-flex" }}><Ico name="menu" size={18} /></span>
          <div style={{ fontSize: 13, color: SUB }}>
            Data Region: <span style={{ color: INK, fontWeight: 600 }}>US</span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: INK,
              background: "#f1f2f4",
              borderRadius: 7,
              padding: "5px 10px",
              fontWeight: 500,
            }}
          >
            Professional Plan
          </div>
          <span style={{ flex: 1 }} />
          <TopPill>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a" }} />
            Available
            <span style={{ color: "#b8bcc6", fontSize: 10 }}>▾</span>
          </TopPill>
          <TopPill muted>
            <Ico name="headset" size={14} /> Human Specialist
          </TopPill>
          <TopPill>
            <span style={{ color: PURPLE, display: "inline-flex" }}>
              <Ico name="sparkle" size={14} />
            </span>{" "}
            Ask Buddy
          </TopPill>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#b9a06a,#8c7b4e)",
              flexShrink: 0,
            }}
          />
        </div>

        {/* Page body */}
        <div style={{ flex: 1, minHeight: 0, background: CANVAS_BG, overflow: "hidden" }}>
          {children}
        </div>
      </div>

      {/* ---- Account dropdown (overlay) ---- */}
      {accountMenuOpen ? (
        <div
          style={{
            position: "absolute",
            top: 58,
            right: 18,
            width: 248,
            background: "#ffffff",
            border: `1px solid ${HAIR}`,
            borderRadius: 12,
            boxShadow: "0 18px 44px rgba(20,18,30,0.18)",
            padding: "12px 8px 8px",
            zIndex: 30,
            fontSize: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "2px 10px 10px" }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#b9a06a,#8c7b4e)",
              }}
            />
            <span style={{ color: SUB, fontSize: 13 }}>renu+1@plivo.com</span>
          </div>
          <div style={{ height: 1, background: HAIR, margin: "0 6px 6px" }} />
          {ACCOUNT_ITEMS.map((label) => {
            const active = label === accountActiveItem;
            const expandable = label === "Billing" || label === "Geo Permissions";
            return (
              <React.Fragment key={label}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: 32,
                    padding: "0 10px",
                    borderRadius: 7,
                    color: active ? INK : "#3a4150",
                    background: active ? ACTIVE_BG : "transparent",
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {label}
                  <span style={{ flex: 1 }} />
                  {expandable ? (
                    <span style={{ color: "#b8bcc6", fontSize: 10 }}>
                      {label === "Billing" && accountBillingExpanded ? "▾" : "▸"}
                    </span>
                  ) : null}
                </div>
                {label === "Billing" && accountBillingExpanded
                  ? ["Overview", "Invoices & Receipts", "Payment Methods", "Plans & Pricing"].map(
                      (sub) => (
                        <div
                          key={sub}
                          style={{
                            height: 30,
                            display: "flex",
                            alignItems: "center",
                            padding: "0 10px 0 24px",
                            borderRadius: 7,
                            color: "#5b6270",
                            fontSize: 13,
                          }}
                        >
                          {sub}
                        </div>
                      ),
                    )
                  : null}
              </React.Fragment>
            );
          })}
          <div style={{ height: 1, background: HAIR, margin: "6px 6px" }} />
          <div style={{ height: 32, display: "flex", alignItems: "center", padding: "0 10px", color: "#dc2626", fontWeight: 500 }}>
            Logout
          </div>
        </div>
      ) : null}
    </div>
  );
};

// ---- Shared page-content building blocks (used by the beat scenes) --------

export const PageHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({
  title,
  subtitle,
  action,
}) => (
  <div style={{ display: "flex", alignItems: "flex-start", padding: "22px 26px 0" }}>
    <div>
      <div style={{ fontSize: 21, fontWeight: 700, color: INK, letterSpacing: -0.4, fontFamily: `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif` }}>
        {title}
      </div>
      {subtitle ? (
        <div style={{ fontSize: 13.5, color: SUB, marginTop: 5 }}>{subtitle}</div>
      ) : null}
    </div>
    <span style={{ flex: 1 }} />
    {action}
  </div>
);

export const DarkButton: React.FC<{ children: React.ReactNode; purple?: boolean }> = ({
  children,
  purple,
}) => (
  <div
    style={{
      height: 38,
      display: "inline-flex",
      alignItems: "center",
      padding: "0 16px",
      borderRadius: 8,
      background: purple ? PURPLE : "#1f2430",
      color: "#ffffff",
      fontSize: 14,
      fontWeight: 600,
    }}
  >
    {children}
  </div>
);

export const TABS_INK = INK;
export const TABS_SUB = SUB;
export const TABS_HAIR = HAIR;

// A horizontal tab row (underline style) — the consolidation device for the
// Logs / Compliance / Billing hubs.
export const TabRow: React.FC<{ tabs: string[]; active: string }> = ({ tabs, active }) => (
  <div
    style={{
      display: "flex",
      gap: 26,
      padding: "16px 26px 0",
      borderBottom: `1px solid ${HAIR}`,
    }}
  >
    {tabs.map((t) => {
      const on = t === active;
      return (
        <div
          key={t}
          style={{
            fontSize: 14,
            fontWeight: on ? 600 : 500,
            color: on ? INK : SUB,
            paddingBottom: 12,
            borderBottom: on ? `2px solid ${INK}` : "2px solid transparent",
          }}
        >
          {t}
        </div>
      );
    })}
  </div>
);
