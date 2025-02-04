import type { NavItem } from "@/types/nav";

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[];
}

export interface SidebarNavItem extends NavItem {
  icon?: string;
}
