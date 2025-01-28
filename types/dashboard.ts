import type { NavItem } from "@/types/nav"

export interface DashboardConfig {
  mainNav: NavItem[]
  sidebarNav: SidebarNavItem[]
}

export interface SidebarNavItem extends NavItem {
  icon?: string
}

