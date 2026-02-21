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

export const GROWERS_ICONS = [
  { label: "Analytics", href: "/growers/analytics", icon: BarChart3, color: "#3b82f6" },
  { label: "Quality Control", href: "/growers/quality-control", icon: ClipboardCheck, color: "#10b981" },
  { label: "Packout", href: "/growers/packout", icon: PackageOpen, color: "#f59e0b" },
  { label: "Settings", href: "/settings", icon: Settings, color: "#6b7280" },
];

export const PACKING_ICONS = [
  { label: "Packing Checklist", href: "/packing-employee/packing-checklist", icon: CheckSquare, color: "#3b82f6" },
  { label: "Operations", href: "/packing-employee/operations", icon: Wrench, color: "#8b5cf6" },
  { label: "Quality Control Form", href: "/packing-employee/quality-control-form", icon: ClipboardList, color: "#10b981" },
  { label: "History", href: "/packing-employee/history", icon: History, color: "#6b7280" },
];
