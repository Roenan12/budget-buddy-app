import { Footer } from "@/components/Footer";
import UserNav from "@/components/UserNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Icons } from "@/components/Icons";
import { Sidebar } from "@/components/Sidebar";
import type React from "react";
import { Toaster } from "@/components/ui/toaster";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex w-full flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-16 items-center md:justify-end justify-between px-4 md:px-6">
            <div className="flex items-center space-x-4 md:hidden">
              <Sidebar />
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="container mx-auto p-6">{children}</div>
          <Toaster />
        </main>
        <Footer className="border-t" />
      </div>
    </div>
  );
}
