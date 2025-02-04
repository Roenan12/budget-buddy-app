import type { DashboardConfig } from "@/types/dashboard";
import type { NavItem } from "@/types/nav";

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard",
    },
    {
      title: "Budgets",
      href: "/dashboard/budgets",
      icon: "DollarSign",
    },
    {
      title: "Expenses",
      href: "/dashboard/expenses",
      icon: "CreditCard",
    },
  ],
};
