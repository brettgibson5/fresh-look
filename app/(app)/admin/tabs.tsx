"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart3,
  CheckSquare,
  ClipboardCheck,
  ClipboardList,
  History,
  PackageOpen,
  Settings,
  Wrench,
} from "lucide-react";
import { AppIconGrid } from "@/components/app-icon-grid";

const GROWERS_ICONS = [
  { label: "Analytics", href: "/analytics", icon: BarChart3, color: "#3b82f6" },
  { label: "Quality Control", href: "/quality-control-form", icon: ClipboardCheck, color: "#10b981" },
  { label: "Packout", href: "/packout", icon: PackageOpen, color: "#f59e0b" },
  { label: "Settings", href: "/settings", icon: Settings, color: "#6b7280" },
];

const PACKING_ICONS = [
  { label: "Packing Checklist", href: "/packing-checklist", icon: CheckSquare, color: "#3b82f6" },
  { label: "Operations", href: "/operations", icon: Wrench, color: "#8b5cf6" },
  { label: "Quality Control Form", href: "/quality-control-form", icon: ClipboardList, color: "#10b981" },
  { label: "History", href: "/history", icon: History, color: "#6b7280" },
];

const TABS = [
  { key: "growers", label: "Growers" },
  { key: "packing", label: "Packing Employee" },
  { key: "admin", label: "Admin" },
];

type AdminTabsProps = {
  adminContent: ReactNode;
};

export function AdminTabs({ adminContent }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState("growers");

  return (
    <div>
      <div className="flex gap-0 border-b border-border">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={[
                "px-5 py-2.5 text-sm font-semibold border-t border-l border-r rounded-t-md -mb-px transition-colors",
                isActive
                  ? "bg-card border-border text-foreground"
                  : "bg-muted/40 border-transparent text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {activeTab === "growers" && <AppIconGrid icons={GROWERS_ICONS} />}
        {activeTab === "packing" && <AppIconGrid icons={PACKING_ICONS} />}
        {activeTab === "admin" && adminContent}
      </div>
    </div>
  );
}
