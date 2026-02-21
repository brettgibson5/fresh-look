"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

type ModelObject = {
  name: string;
  fields: string[];
};

type ViewItem = {
  name: string;
  notes: string;
};

type FeatureItem = {
  id: string;
  title: string;
  description: string;
  portal?: string;
  device?: string;
  tasks?: string[];
  dataModels?: ModelObject[] | string[];
  views?: ViewItem[];
  notes?: string;
};

type TabItem = {
  key: string;
  label: string;
  sublabel: string;
  color: string;
  items: FeatureItem[];
};

const estimates: Record<string, number> = {
  "project-setup": 2,
  "ux-wireframes": 6,
  "api-design": 2,
  "db-schema": 4,
  auth: 5,
  "user-settings": 2,
  "admin-interface": 6,
  "email-notifications": 2,
  "pdf-parser-infra": 6,
  "supabase-rls": 2,
  "file-storage": 2,
  "error-logging": 1,
  "deployment-cicd": 1,
  "paid-feature-gating": 2,
  "qc-report": 18,
  "data-submission": 14,
  "grower-dashboard": 20,
  "bc-schedule": 22,
  "grower-lookup": 6,
  "history-analysis": 20,
  sanitation: 6,
  checklist: 6,
  safety: 5,
  inventory: 12,
  "grower-history": 18,
  "form-submissions": 20,
  labor: 14,
};

const allTabs: TabItem[] = [
  {
    key: "infra",
    label: "⚙️ Foundation",
    sublabel: "Setup & Infrastructure",
    color: "#8b5cf6",
    items: [
      {
        id: "project-setup",
        title: "Project Setup",
        description:
          "Repo, framework scaffold (Next.js), Vercel hosting, environment config.",
        tasks: [
          "Init repo & branch strategy",
          "Scaffold Next.js app",
          "Vercel project + domain setup",
          "Env variable config (prod)",
        ],
      },
      {
        id: "ux-wireframes",
        title: "UX Wireframes",
        description:
          "Low-fi wireframes for every major view before writing code. Prevents expensive rework. Figma or similar.",
        tasks: [
          "B&C Employee portal flow map",
          "Grower portal flow map",
          "QC Report form (iPad)",
          "Schedule window (pop-out)",
          "Grower dashboard + modals",
        ],
      },
      {
        id: "api-design",
        title: "API Design",
        description:
          "Map all Supabase queries and Edge Function endpoints before building. Decide what's direct client vs Edge Function.",
        tasks: [
          "Endpoint inventory (all reads/writes)",
          "Edge Function candidates (PDF parse, email trigger)",
          "Response shape + error format standards",
        ],
      },
      {
        id: "db-schema",
        title: "Database Schema & Migrations",
        description:
          "Full schema in Supabase/Postgres — tables, relationships, indexes, enums. Seed scripts for master data.",
        tasks: [
          "ERD of all tables + relationships",
          "Enum types (defects, file types, roles, companies)",
          "Supabase migrations configured",
          "Seed scripts (growers, lots, defect types)",
        ],
      },
      {
        id: "auth",
        title: "Authentication & Authorization",
        description:
          "Supabase Auth with role-based routing. Single sign-in sends users to the correct portal by role.",
        tasks: [
          "Supabase Auth + email/password + magic link",
          "Role assignment on user creation",
          "Portal routing by role (employee vs grower)",
          "Password reset + new grower invite flow",
        ],
      },
      {
        id: "supabase-rls",
        title: "Row-Level Security (RLS)",
        description:
          "Growers must only see their own data. RLS policies per table — design this from day one, not retroactively.",
        tasks: [
          "Grower-scoped RLS on all relevant tables",
          "Employee / manager / admin policy tiers",
          "RLS testing across all user roles",
        ],
      },
      {
        id: "user-settings",
        title: "User Settings & Account Management",
        description:
          "Profile edit, password change, email notification preferences. Growers: view subscription tier.",
        tasks: [
          "Profile edit page",
          "Password change flow",
          "Email notification preferences",
          "Grower subscription tier display",
        ],
      },
      {
        id: "admin-interface",
        title: "Admin Interface (CRUD)",
        description:
          "Internal panel to manage master data — growers, lots, users, defect types, distribution companies — without touching the DB directly.",
        tasks: [
          "Grower CRUD",
          "Lot CRUD",
          "User management (create, assign role, reset password)",
          "Defect type + distribution company management",
          "File upload log + parse status viewer",
        ],
      },
      {
        id: "email-notifications",
        title: "Email Notifications",
        description:
          "Transactional emails via Resend. New pack record → grower email with dashboard link. Auth emails.",
        tasks: [
          "Resend setup + branded templates",
          "New PackRecord trigger → grower email",
          "Auth emails (welcome, reset, invite)",
          "Edge Function trigger from DB insert",
        ],
      },
      {
        id: "pdf-parser-infra",
        title: "PDF Parser Infrastructure",
        description:
          "Highest technical risk in the project. Unitec + Famous PDFs must parse reliably into structured DB rows, with manual correction when they don't.",
        tasks: [
          "Get sample Unitec + Famous files early",
          "Unitec parser (Edge Function)",
          "Famous parser (Edge Function)",
          "Parse validation + error flagging",
          "Manual correction queue UI",
          "Re-parse after correction",
        ],
      },
      {
        id: "file-storage",
        title: "File Storage",
        description:
          "Supabase Storage for uploaded PDFs and QC photos. Access policies and upload UX.",
        tasks: [
          "Storage buckets (pdfs, qc-photos)",
          "Access policies per bucket",
          "Photo upload from iPad (camera + file picker)",
          "PDF upload with progress indicator",
        ],
      },
      {
        id: "error-logging",
        title: "Error Logging & Monitoring",
        description:
          "Sentry for frontend + Edge Function errors. Know when parsing breaks before growers do.",
        tasks: [
          "Sentry setup",
          "Error alerts to dev email/Slack",
          "Uptime monitoring",
        ],
      },
      {
        id: "deployment-cicd",
        title: "Deployment",
        description:
          "Vercel production deploy with automated deploys on merge to main.",
        tasks: [
          "Vercel production environment",
          "Auto-deploy on merge to main",
          "DB migration on deploy strategy",
        ],
      },
      {
        id: "paid-feature-gating",
        title: "Paid Feature Gating",
        description:
          "Subscription flag gates grower paid add-ons. Manual DB toggle for now, Stripe later.",
        tasks: [
          "Subscription flag on Grower model",
          "Feature gate component (lock UI + upgrade prompt)",
          "Admin toggle for manual control",
        ],
      },
    ],
  },
  {
    key: "mvp",
    label: "!!! MVP",
    sublabel: "Must ship by May 30",
    color: "#ef4444",
    items: [
      {
        id: "qc-report",
        title: "Quality Control Reporting",
        portal: "B&C Employee",
        device: "iPad primary",
        description:
          "iPad-optimized form for logging fruit lot assessments with photo capture and defect tracking.",
        tasks: [
          "Grower/lot autocomplete search",
          "Auto-populate form fields from grower DB",
          "Traceability section (auto-fill + manual overrides)",
          "Sample size, brix, color, pressure, temp inputs",
          "Defect searchable dropdown (common + custom)",
          "Per-defect count input + auto % calc",
          "Camera / photo upload per defect",
          "Total defect summary calculations",
          "Submit → Supabase + trigger grower notification",
          "Draft save (don't lose work on iPad)",
        ],
        dataModels: [
          {
            name: "QCReport",
            fields: [
              "id, created_at, submitted_by (FK→User)",
              "grower_id (FK→Grower), lot_id (FK→Lot)",
              "sample_size, brix, color, pressure, temperature",
              "crew_boss, notes",
              "status: draft | submitted",
            ],
          },
          {
            name: "QCDefect",
            fields: [
              "id, qc_report_id (FK→QCReport)",
              "defect_name (from enum or custom)",
              "count, percentage (auto-calc: count/sample_size)",
              "photo_url",
            ],
          },
        ],
        views: [
          {
            name: "Grower/Lot Search",
            notes: "Autocomplete search → auto-populates form fields",
          },
          {
            name: "Traceability Section",
            notes:
              "Auto-filled: date, time, inspector, grower info. Manual: crew boss, notes",
          },
          {
            name: "QC Assessment Form",
            notes: "Sample size, brix, color, pressure, temp inputs",
          },
          {
            name: "Defect Entry",
            notes:
              "Searchable dropdown + count input + auto % calc + camera trigger per defect",
          },
          {
            name: "Submit + Confirmation",
            notes: "Submits to Supabase, triggers grower portal notification",
          },
        ],
        notes:
          "Defects enum: Rot, Insect Damage, Open Suture, Split Pit, Scarring, Puncture, Limb Rub, Russetting, Denting, Staining, Mechanical Damage, Soft, Sunburn, Silvering + user-addable.",
      },
      {
        id: "data-submission",
        title: "Data Submission Page",
        portal: "B&C Employee",
        device: "Desktop (shed computers)",
        description:
          "Upload hub for daily PDFs from Unitec and Famous software. The data backbone — QC, Grower Dashboard, and History all depend on this.",
        tasks: [
          "Upload dashboard UI (grid of upload slots)",
          "Unitec PDF drag-and-drop upload",
          "Famous software PDF upload",
          "Parse status badges (pending/success/error)",
          "Parse error correction UI (manual fix rows)",
          "B&C Schedule CSV import (bridge)",
          "Sales distribution form entry",
          "Throughput log manual entry form",
          "Re-parse trigger after correction",
        ],
        dataModels: [
          {
            name: "FileUpload",
            fields: [
              "id, uploaded_at, uploaded_by (FK→User)",
              "file_type: unitec_pdf | famous_pdf | bc_schedule | sales_distribution | throughput",
              "file_url (Supabase storage)",
              "parse_status: pending | processing | success | error",
              "parse_errors (jsonb)",
            ],
          },
          {
            name: "ParsedUnitecData",
            fields: [
              "id, file_upload_id",
              "pack_date, lot_id (FK→Lot)",
              "size_30_pct … size_72_pct",
              "total_lbs_received, total_lbs_packed, cull_lbs",
            ],
          },
          {
            name: "ParsedFamousData",
            fields: [
              "id, file_upload_id",
              "pack_date, lot_id (FK→Lot)",
              "boxes_packed, box_equivalent_25lb",
            ],
          },
        ],
        views: [
          {
            name: "Upload Dashboard",
            notes:
              "Grid of upload slots per file type with last upload timestamp + parse status badge",
          },
          {
            name: "PDF Upload (Unitec + Famous)",
            notes: "Drag-and-drop → parse → populate downstream tables",
          },
          {
            name: "Parse Error View",
            notes:
              "Offending rows shown with manual correction fields before DB commit",
          },
          {
            name: "Distribution + Throughput Forms",
            notes:
              "Manual entry for sales distribution and daily throughput logs",
          },
        ],
        notes:
          "Highest technical risk. Build robust error/correction UI from day one. Supabase Edge Functions for parser.",
      },
      {
        id: "grower-dashboard",
        title: "Grower Dashboard",
        portal: "Grower Portal",
        device: "Phone / Tablet / Desktop",
        description:
          "Grower-facing view of 10 most recent packouts with expandable modals. Core daily touchpoint.",
        tasks: [
          "Dashboard home: 10 recent packs table",
          "Packout color badge (≥25/19-24/<19)",
          "QC modal: defect bar graph + brix/temp/pressure + photos",
          "Sizing modal: size 30–72 percentages",
          "Box distribution modal: bar graph by company",
          "Lot detail page (full season history for one lot)",
          "Search bar for all varieties",
          "Responsive design (phone/tablet/desktop)",
          "Email trigger on new PackRecord",
        ],
        dataModels: [
          {
            name: "PackRecord",
            fields: [
              "id, pack_date, lot_id (FK→Lot), grower_id (FK→Grower)",
              "packout (≥25 good / 19-24 avg / <19 poor)",
              "total_boxes, cull_pct",
              "qc_report_id (FK→QCReport)",
              "sizing_report_id (FK→SizingReport)",
            ],
          },
          {
            name: "SizingReport",
            fields: [
              "id, pack_record_id",
              "size_30_pct through size_72_pct (from Unitec)",
            ],
          },
          {
            name: "BoxDistribution",
            fields: [
              "id, pack_record_id",
              "company: MountainviewFruitSales | FamilyTreeFarms | FruitGuys | TwoDumbFarmers | FarmersMarket | MexicoProgram | Wawona",
              "box_count, percentage (auto-calc)",
            ],
          },
        ],
        views: [
          {
            name: "Dashboard Home",
            notes:
              "Search bar + 10 recent packs: Lot#, Grower Code, Ranch, Variety, Packout badge, #Boxes, Cull%, 3 modal links",
          },
          {
            name: "QC Modal",
            notes:
              "Defect bar graph high→low %, brix/temp/pressure sidebar, photos below",
          },
          {
            name: "Sizing Modal",
            notes: "Size 30–72 with % per size from Unitec parse",
          },
          {
            name: "Box Distribution Modal",
            notes: "Bar graph by company: % + actual box count",
          },
          {
            name: "Lot Detail Page",
            notes:
              "Full season history: all pack dates + totals (boxes/acre, avg boxes/tree, total QC/sizing/dist.)",
          },
        ],
        notes:
          "Grower sees only their own lots via RLS. Email trigger on new PackRecord insert.",
      },
    ],
  },
  {
    key: "high",
    label: "!! High",
    sublabel: "Before July 30",
    color: "#f97316",
    items: [
      {
        id: "bc-schedule",
        title: "B&C Schedule Window",
        portal: "B&C Employee",
        device: "Desktop (pop-out window)",
        description:
          "Real-time packing schedule with 3 tabs. Always-on operational tool for the floor manager.",
        tasks: [
          "Pop-out window in separate browser context",
          "Schedule tab: Start/End timestamp buttons",
          "Live P/hr calculation (pallets / elapsed time)",
          "Historical P/hr avg display",
          "Lot list with estimates vs actuals columns",
          "CS inventory bubble (click to expand modal)",
          "Receiving tab: auto-loaded lots + smart pallet dropdown",
          "Add Lot & Hx tab: lot search + estimate entry",
          "Predicted estimate calculator from history",
          "Tomorrow's schedule submission",
        ],
        dataModels: [
          {
            name: "PackDay",
            fields: [
              "id, pack_date, start_time, end_time",
              "total_pallets_in_cs",
            ],
          },
          {
            name: "PackDayLot",
            fields: [
              "id, pack_day_id, lot_id",
              "grower_estimate, alt_estimate",
              "pallets_packed, pallets_total, pallets_to_cs, pallets_from_cs, pallets_mexico",
              "notes",
            ],
          },
          {
            name: "ReceivingEntry",
            fields: [
              "id, pack_day_id, lot_id, timestamp",
              "pallets_bins_count",
            ],
          },
          {
            name: "ColdStorageInventory",
            fields: ["id, lot_id, location, pallet_count, date_received"],
          },
        ],
        views: [
          {
            name: "Schedule Tab",
            notes: "Start/End timestamps, live P/hr, lot list, CS bubble",
          },
          {
            name: "Receiving Tab",
            notes:
              "Auto-loaded lots, smart pallet count dropdown (last-used at top)",
          },
          {
            name: "Add Lot & Hx Tab",
            notes: "Search → auto-fill → estimate entry → submit to tomorrow",
          },
          {
            name: "CS Inventory Modal",
            notes: "Grower, lot, variety, pallets, location, days in CS",
          },
        ],
        notes: "Pop-out for dual-monitor. P/hr = pallets / (now - start_time).",
      },
      {
        id: "grower-lookup",
        title: "Grower Look Up",
        portal: "B&C Employee",
        device: "Desktop",
        description:
          "Internal search to pull any grower's pack history by name, lot, variety, code, ranch, or date.",
        tasks: [
          "Multi-field search bar (name/lot/variety/code/ranch/date)",
          "Results list with key pack metrics",
          "Grower-variety detail expanded view",
          "Mexico lot → show mother lot reference",
        ],
        dataModels: ["Uses existing: Grower, Lot, PackRecord, BoxDistribution"],
        views: [
          {
            name: "Search Bar",
            notes:
              "Search by grower name, lot#, variety, grower code, ranch, date",
          },
          {
            name: "Grower-Variety Detail",
            notes:
              "Pack date, total pallets, packout, Mexico flag, boxes by company",
          },
        ],
        notes: "Mexico lots should display their 'mother lot' reference.",
      },
      {
        id: "history-analysis",
        title: "History, Estimates & Efficiency Analysis",
        portal: "B&C Employee",
        device: "Desktop",
        description:
          "Analytics hub: seasonal volume graph + line efficiency metrics. No smoothing.",
        tasks: [
          "Point plot graph (no smoothing)",
          "Filter controls (grower/lot/variety/commodity)",
          "Year toggle (individual years + historical avg)",
          "Hover tooltip (volume, hours, boxes)",
          "Click day → detail modal",
          "Downloadable detail spreadsheet (PDF/CSV)",
          "Efficiency dashboard (yesterday's KPIs)",
          "Throughput cards (Receiving, Destacker, Line, Lot Change, Breakdowns)",
          "Season OT hours running total",
        ],
        dataModels: [
          {
            name: "ThroughputLog",
            fields: [
              "id, log_date, type: receiving|destacker|line|lotchange|breakdown",
              "duration_minutes, count, notes",
            ],
          },
        ],
        views: [
          {
            name: "Volume Graph",
            notes:
              "Point plot, X=date Y=volume. Filters, toggles, hover tooltips, click for detail modal.",
          },
          {
            name: "Day Detail Modal",
            notes:
              "Row/column: varieties, lot#s, growers, pallets received, boxes packed",
          },
          {
            name: "Efficiency Dashboard",
            notes:
              "Yesterday: boxes, cull%, adj. efficiency, OT hours. Season OT total.",
          },
          {
            name: "Throughput Cards",
            notes:
              "Receiving, Destacker, Line, Lot Change, Breakdowns — daily + season view",
          },
        ],
        notes: "2025 season only for efficiency comparison for now.",
      },
    ],
  },
  {
    key: "low",
    label: "! Later",
    sublabel: "Months out",
    color: "#6b7280",
    items: [
      {
        id: "sanitation",
        title: "Sanitation Tab",
        portal: "B&C Employee",
        description:
          "Checklist-style sanitation task completion submitted to management. Scope still being defined.",
        tasks: [
          "Define checklist items with client",
          "Checklist form UI",
          "Submission + manager review flow",
        ],
      },
      {
        id: "checklist",
        title: "Check List Tab",
        portal: "B&C Employee",
        description:
          "Pre-op checklists (pest traps, work orders, corrective actions, bathroom cleaning) submitted to management.",
        tasks: [
          "Pre-op checklist form builder",
          "Submission to manager flow",
          "Corrective action flagging",
        ],
      },
      {
        id: "safety",
        title: "Safety Report Tab",
        portal: "B&C Employee",
        description: "Safety incident reporting. Scope still being defined.",
        tasks: [
          "Define report fields with client",
          "Form UI",
          "Record keeping + history view",
        ],
      },
      {
        id: "inventory",
        title: "Inventory",
        portal: "B&C Employee",
        description:
          "Master inventory tracking. Blocked on packout parsing strategy discussion.",
        tasks: [
          "Define inventory categories with client",
          "Packout parsing strategy agreed",
          "Inventory dashboard UI",
        ],
      },
      {
        id: "grower-history",
        title: "Grower History & True Yield Analysis",
        portal: "Grower Portal (paid)",
        description:
          "Paid. Grower-specific analytics graph + True Yield spreadsheet with soil/tissue/field health data.",
        tasks: [
          "Graph clone scoped to grower's lots",
          "Unitec lbs vs box equivalents toggle",
          "Volume markers (high/low 3-day windows)",
          "Hover tooltips + day detail modal",
          "True Yield spreadsheet view (harvest dates + totals)",
          "PDF/CSV download",
          "Historical comparison view (YoY by lot)",
        ],
      },
      {
        id: "form-submissions",
        title: "Form Submissions (Farm Events)",
        portal: "Grower Portal (paid)",
        description:
          "Paid. Log pruning, bloom stages, thinning, sprays, irrigation, maintenance, soil/tissue tests, nitrogen plan, labor compliance.",
        tasks: [
          "Tree assessment forms (pruning, bud, bloom, thinning)",
          "Spray logging + PCA PDF upload + parse",
          "Irrigation tracking + 10-day alert",
          "Maintenance records + overdue flags",
          "Drip line repair log + overdue flags",
          "Soil/tissue test ingestion + parsing",
          "Nitrogen management calculator",
          "Labor compliance e-form with photo",
          "Location-based ranch suggestion",
        ],
      },
      {
        id: "labor",
        title: "Employee & Labor Management",
        portal: "Grower Portal (paid)",
        description:
          "Paid. Contract labor hours, OT tracking, speed rate (job/acre), compliance checklists.",
        tasks: [
          "Labor dashboard overview",
          "Hours + OT tracking per crew",
          "Speed rate (job/acre) calculation + historical compare",
          "Labor compliance checklist with photo upload",
          "Lot/variety/crew modal detail view",
        ],
      },
    ],
  },
];

const PROGRESS_ROW_ID = "default";

type SyncState = "loading" | "ready" | "error";

function parseChecked(value: unknown): Record<string, boolean> {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce<
    Record<string, boolean>
  >((acc, [key, raw]) => {
    acc[key] = Boolean(raw);
    return acc;
  }, {});
}

function areCheckedEqual(
  left: Record<string, boolean>,
  right: Record<string, boolean>,
) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every((key) => left[key] === right[key]);
}

function totalHours(items: FeatureItem[]) {
  return items.reduce((sum, item) => sum + (estimates[item.id] || 0), 0);
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 9px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        border: `1px solid ${color}`,
        color,
        background: `${color}18`,
      }}
    >
      {text}
    </span>
  );
}

function HourBadge({ hours, color }: { hours: number; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 9px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 700,
        background: `${color}18`,
        border: `1px solid ${color}40`,
        color,
      }}
    >
      ⏱ ~{hours}h
    </span>
  );
}

function ProgressBar({
  pct,
  color,
  height = 6,
}: {
  pct: number;
  color: string;
  height?: number;
}) {
  return (
    <div
      style={{
        background: "#1e293b",
        borderRadius: "4px",
        height,
        overflow: "hidden",
        flex: 1,
      }}
    >
      <div
        style={{
          width: `${Math.min(pct, 100)}%`,
          height: "100%",
          background: color,
          borderRadius: "4px",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
}

function FieldList({ fields }: { fields: string[] }) {
  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#94a3b8",
        lineHeight: "1.9",
      }}
    >
      {fields.map((field, index) => (
        <div
          key={`${field}-${index}`}
          style={{ paddingLeft: "8px", borderLeft: "2px solid #1e293b" }}
        >
          {field}
        </div>
      ))}
    </div>
  );
}

function ViewRow({ view }: { view: ViewItem }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "7px 0",
        borderBottom: "1px solid #1e293b",
      }}
    >
      <div
        style={{
          width: "170px",
          flexShrink: 0,
          color: "#e2e8f0",
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        {view.name}
      </div>
      <div style={{ color: "#64748b", fontSize: "12px", lineHeight: "1.5" }}>
        {view.notes}
      </div>
    </div>
  );
}

function TaskChecklist({
  itemId,
  tasks,
  checked,
  onToggle,
  color,
}: {
  itemId: string;
  tasks: string[];
  checked: Record<string, boolean>;
  onToggle: (key: string) => void;
  color: string;
}) {
  if (!tasks?.length) return null;

  const done = tasks.filter(
    (_, index) => checked[`${itemId}-task-${index}`],
  ).length;

  return (
    <div style={{ marginTop: "14px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            color,
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Tasks
        </div>
        <span style={{ color: "#64748b", fontSize: "11px" }}>
          {done}/{tasks.length}
        </span>
        <ProgressBar pct={(done / tasks.length) * 100} color={color} />
      </div>

      {tasks.map((task, index) => {
        const key = `${itemId}-task-${index}`;
        const isDone = !!checked[key];

        return (
          <div
            key={key}
            onClick={() => onToggle(key)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              padding: "6px 8px",
              borderRadius: "5px",
              cursor: "pointer",
              background: isDone ? `${color}0d` : "transparent",
              marginBottom: "2px",
              transition: "background 0.15s",
            }}
          >
            <div
              style={{
                width: "15px",
                height: "15px",
                borderRadius: "3px",
                flexShrink: 0,
                marginTop: "2px",
                border: `2px solid ${isDone ? color : "#334155"}`,
                background: isDone ? color : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
              }}
            >
              {isDone ? (
                <span
                  style={{ color: "#fff", fontSize: "9px", fontWeight: 900 }}
                >
                  ✓
                </span>
              ) : null}
            </div>
            <span
              style={{
                fontSize: "12px",
                lineHeight: "1.5",
                color: isDone ? "#475569" : "#cbd5e1",
                textDecoration: isDone ? "line-through" : "none",
              }}
            >
              {task}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function isModelObjectArray(
  models: FeatureItem["dataModels"],
): models is ModelObject[] {
  return (
    Array.isArray(models) &&
    models.length > 0 &&
    typeof models[0] === "object" &&
    models[0] !== null &&
    "name" in models[0]
  );
}

function isStringModelArray(
  models: FeatureItem["dataModels"],
): models is string[] {
  return (
    Array.isArray(models) && models.length > 0 && typeof models[0] === "string"
  );
}

function FeatureCard({
  item,
  accentColor,
  checked,
  onToggle,
}: {
  item: FeatureItem;
  accentColor: string;
  checked: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const hours = estimates[item.id];
  const taskList = item.tasks || [];
  const done = taskList.filter(
    (_, index) => checked[`${item.id}-task-${index}`],
  ).length;
  const pct = taskList.length > 0 ? (done / taskList.length) * 100 : 0;
  const allDone = taskList.length > 0 && done === taskList.length;

  return (
    <div
      style={{
        background: allDone ? "#071a0f" : "#0f172a",
        border: `1px solid ${open ? `${accentColor}70` : allDone ? "#14532d" : "#1e293b"}`,
        borderRadius: "8px",
        marginBottom: "8px",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "13px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textAlign: "left",
        }}
      >
        <span
          style={{
            color: accentColor,
            fontSize: "15px",
            width: "16px",
            flexShrink: 0,
          }}
        >
          {open ? "▾" : "▸"}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                color: allDone ? "#86efac" : "#f1f5f9",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              {item.title}
            </span>
            {allDone ? <span>✅</span> : null}
            {item.portal ? (
              <Badge text={item.portal} color={accentColor} />
            ) : null}
            {item.device ? <Badge text={item.device} color="#475569" /> : null}
            {hours ? <HourBadge hours={hours} color={accentColor} /> : null}
          </div>

          <div style={{ color: "#64748b", fontSize: "12px", marginTop: "3px" }}>
            {item.description}
          </div>

          {taskList.length > 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "5px",
              }}
            >
              <ProgressBar pct={pct} color={accentColor} height={4} />
              <span
                style={{ color: "#475569", fontSize: "11px", flexShrink: 0 }}
              >
                {done}/{taskList.length}
              </span>
            </div>
          ) : null}
        </div>
      </button>

      {open ? (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #1e293b" }}>
          <TaskChecklist
            itemId={item.id}
            tasks={taskList}
            checked={checked}
            onToggle={onToggle}
            color={accentColor}
          />

          {isModelObjectArray(item.dataModels) ? (
            <div style={{ marginTop: "14px" }}>
              <div
                style={{
                  color: accentColor,
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Data Models
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
                  gap: "8px",
                }}
              >
                {item.dataModels.map((model) => (
                  <div
                    key={model.name}
                    style={{
                      background: "#0a0f1e",
                      border: "1px solid #1e293b",
                      borderRadius: "6px",
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        color: "#93c5fd",
                        fontWeight: 700,
                        fontSize: "12px",
                        marginBottom: "6px",
                      }}
                    >
                      📦 {model.name}
                    </div>
                    <FieldList fields={model.fields} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {isStringModelArray(item.dataModels) ? (
            <div
              style={{
                marginTop: "8px",
                color: "#64748b",
                fontSize: "11px",
                fontStyle: "italic",
              }}
            >
              Uses: {item.dataModels.join(", ")}
            </div>
          ) : null}

          {item.views?.length ? (
            <div style={{ marginTop: "14px" }}>
              <div
                style={{
                  color: accentColor,
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                UI Views
              </div>
              {item.views.map((view, index) => (
                <ViewRow key={`${view.name}-${index}`} view={view} />
              ))}
            </div>
          ) : null}

          {item.notes ? (
            <div
              style={{
                marginTop: "10px",
                background: "#1e293b50",
                borderRadius: "6px",
                padding: "8px 12px",
                color: "#94a3b8",
                fontSize: "11px",
              }}
            >
              <strong style={{ color: "#cbd5e1" }}>Notes: </strong>
              {item.notes}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default function ProgressPage() {
  const supabase = useMemo(() => createClient(), []);
  const dbHydratedRef = useRef(false);
  const hasShownConnectedToastRef = useRef(false);
  const [activeTab, setActiveTab] = useState("infra");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [syncState, setSyncState] = useState<SyncState>("loading");

  useEffect(() => {
    let cancelled = false;

    async function loadFromDatabase() {
      setSyncState("loading");

      const { data, error } = await supabase
        .from("progress_tracker_state")
        .select("checked")
        .eq("id", PROGRESS_ROW_ID)
        .maybeSingle();

      if (cancelled) {
        return;
      }

      if (error) {
        dbHydratedRef.current = true;
        setSyncState("error");
        toast.error("Could not load progress from database.");
        return;
      }

      if (!data) {
        const { error: seedError } = await supabase
          .from("progress_tracker_state")
          .upsert(
            {
              id: PROGRESS_ROW_ID,
              checked: {},
            },
            { onConflict: "id" },
          );

        dbHydratedRef.current = true;

        if (seedError) {
          setSyncState("error");
          toast.error("Could not initialize progress state in database.");
          return;
        }

        setSyncState("ready");
        if (!hasShownConnectedToastRef.current) {
          toast.success("Progress tracker connected to database.");
          hasShownConnectedToastRef.current = true;
        }
        return;
      }

      const remoteChecked = parseChecked(data.checked);
      setChecked((prev) =>
        areCheckedEqual(prev, remoteChecked) ? prev : remoteChecked,
      );

      dbHydratedRef.current = true;
      setSyncState("ready");
      if (!hasShownConnectedToastRef.current) {
        toast.success("Progress tracker connected to database.");
        hasShownConnectedToastRef.current = true;
      }
    }

    void loadFromDatabase();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  useEffect(() => {
    if (!dbHydratedRef.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      void (async () => {
        const { error } = await supabase.from("progress_tracker_state").upsert(
          {
            id: PROGRESS_ROW_ID,
            checked,
          },
          { onConflict: "id" },
        );

        if (error) {
          setSyncState("error");
          toast.error("Could not save progress to database.");
          return;
        }

        setSyncState("ready");
      })();
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [checked, supabase]);

  function handleToggle(key: string) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const current = allTabs.find((tab) => tab.key === activeTab) ?? allTabs[0];
  const allItems = allTabs.flatMap((tab) => tab.items);
  const totalHrs = allItems.reduce(
    (sum, item) => sum + (estimates[item.id] || 0),
    0,
  );

  const allTaskKeys = allItems.flatMap((item) =>
    (item.tasks || []).map((_, index) => `${item.id}-task-${index}`),
  );
  const doneTasks = allTaskKeys.filter((key) => checked[key]).length;
  const globalPct =
    allTaskKeys.length > 0
      ? Math.round((doneTasks / allTaskKeys.length) * 100)
      : 0;

  const tabTotal = totalHours(current.items);
  const tabTaskKeys = current.items.flatMap((item) =>
    (item.tasks || []).map((_, index) => `${item.id}-task-${index}`),
  );
  const tabDone = tabTaskKeys.filter((key) => checked[key]).length;
  const tabPct =
    tabTaskKeys.length > 0
      ? Math.round((tabDone / tabTaskKeys.length) * 100)
      : 0;

  const syncLabel =
    syncState === "loading"
      ? "Syncing"
      : syncState === "error"
        ? "Sync error"
        : "Synced";

  const syncColor =
    syncState === "error"
      ? "#ef4444"
      : syncState === "loading"
        ? "#f59e0b"
        : "#22c55e";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060b14",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        color: "#e2e8f0",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #0f1f3d 100%)",
          borderBottom: "1px solid #1e3a5f",
          padding: "18px 24px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          <div>
            <div
              style={{
                color: "#3b82f6",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "3px",
              }}
            >
              FreshLookAg × B&C Packing
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 800,
                color: "#f1f5f9",
                letterSpacing: "-0.02em",
              }}
            >
              App Architecture & Progress Tracker
            </h1>
            <p
              style={{ margin: "3px 0 0", color: "#64748b", fontSize: "12px" }}
            >
              Data models · UI views · Infrastructure · Checklist
            </p>
          </div>

          <div
            style={{
              background: "#0f172a",
              border: "1px solid #1e3a5f",
              borderRadius: "10px",
              padding: "10px 16px",
              minWidth: "200px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  color: "#94a3b8",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Overall Progress
              </span>
              <span
                style={{ color: "#f1f5f9", fontSize: "20px", fontWeight: 800 }}
              >
                {globalPct}%
              </span>
            </div>
            <ProgressBar pct={globalPct} color="#3b82f6" height={8} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "5px",
              }}
            >
              <span style={{ color: "#64748b", fontSize: "11px" }}>
                {doneTasks}/{allTaskKeys.length} tasks done
              </span>
              <span style={{ color: "#64748b", fontSize: "11px" }}>
                ~{totalHrs}h total scope
              </span>
            </div>
            <div
              style={{
                marginTop: "6px",
                display: "flex",
                justifyContent: "flex-end",
                fontSize: "11px",
                fontWeight: 700,
                color: syncColor,
              }}
            >
              {syncLabel}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "2px", flexWrap: "wrap" }}>
          {allTabs.map((tab) => {
            const tabKeys = tab.items.flatMap((item) =>
              (item.tasks || []).map((_, index) => `${item.id}-task-${index}`),
            );
            const tabDoneCount = tabKeys.filter((key) => checked[key]).length;
            const tabProgress =
              tabKeys.length > 0
                ? Math.round((tabDoneCount / tabKeys.length) * 100)
                : 0;
            const tabHours = totalHours(tab.items);
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: isActive ? `${tab.color}20` : "transparent",
                  borderTop: `1px solid ${isActive ? tab.color : "transparent"}`,
                  borderLeft: `1px solid ${isActive ? tab.color : "transparent"}`,
                  borderRight: `1px solid ${isActive ? tab.color : "transparent"}`,
                  borderBottom: "none",
                  borderRadius: "6px 6px 0 0",
                  color: isActive ? tab.color : "#64748b",
                  padding: "8px 14px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  transition: "all 0.15s",
                }}
              >
                {tab.label}
                <span
                  style={{ marginLeft: "5px", fontSize: "10px", opacity: 0.7 }}
                >
                  ~{tabHours}h
                </span>
                {tabProgress > 0 ? (
                  <span
                    style={{
                      marginLeft: "4px",
                      fontSize: "10px",
                      color: tab.color,
                    }}
                  >
                    {tabProgress}%
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "18px 24px", maxWidth: "1060px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "14px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 12px",
              borderRadius: "20px",
              background: `${current.color}15`,
              border: `1px solid ${current.color}40`,
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: current.color,
              }}
            />
            <span
              style={{
                color: current.color,
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {current.label}
            </span>
            <span style={{ color: "#94a3b8", fontSize: "12px" }}>
              {current.sublabel}
            </span>
            <span style={{ color: "#475569", fontSize: "11px" }}>
              · {current.items.length} sections
            </span>
          </div>

          {tabTotal > 0 ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 11px",
                borderRadius: "20px",
                background: "#1e293b",
                border: "1px solid #334155",
              }}
            >
              <span style={{ fontSize: "11px" }}>⏱</span>
              <span
                style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 700 }}
              >
                ~{tabTotal}h
              </span>
            </div>
          ) : null}

          {tabTaskKeys.length > 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: 1,
                minWidth: "140px",
              }}
            >
              <ProgressBar pct={tabPct} color={current.color} />
              <span
                style={{ color: "#64748b", fontSize: "11px", flexShrink: 0 }}
              >
                {tabDone}/{tabTaskKeys.length} · {tabPct}%
              </span>
            </div>
          ) : null}
        </div>

        {current.items.map((item) => (
          <FeatureCard
            key={item.id}
            item={item}
            accentColor={current.color}
            checked={checked}
            onToggle={handleToggle}
          />
        ))}

        {activeTab === "infra" ? (
          <div
            style={{
              marginTop: "16px",
              background: "#0a1628",
              border: "1px solid #1e3a5f",
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "12px",
              color: "#64748b",
              lineHeight: "1.7",
            }}
          >
            <div
              style={{
                color: "#93c5fd",
                fontWeight: 700,
                marginBottom: "6px",
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Recommended Stack
            </div>
            <div>
              <strong style={{ color: "#cbd5e1" }}>Frontend:</strong> Next.js
              (App Router) ·{" "}
              <strong style={{ color: "#cbd5e1" }}>Backend:</strong> Supabase
              (Auth, Postgres, Storage, Edge Functions) ·{" "}
              <strong style={{ color: "#cbd5e1" }}>Deploy:</strong> Vercel
            </div>
            <div style={{ marginTop: "3px" }}>
              <strong style={{ color: "#cbd5e1" }}>Email:</strong> Resend ·{" "}
              <strong style={{ color: "#cbd5e1" }}>Errors:</strong> Sentry ·{" "}
              <strong style={{ color: "#cbd5e1" }}>Payments (later):</strong>{" "}
              Stripe
            </div>
            <div style={{ marginTop: "3px" }}>
              <strong style={{ color: "#cbd5e1" }}>Key risk:</strong> PDF
              parsing (Unitec). Get sample files before committing to schema.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
