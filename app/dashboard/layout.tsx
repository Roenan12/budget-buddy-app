"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardNav } from "@/components/DashboardNav";
import { Footer } from "@/components/Footer";
import { UserNav } from "@/components/UserNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { dashboardConfig } from "@/config/dashboard";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Icons } from "@/components/Icons";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r bg-background md:block">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="font-bold">Budget Buddy</span>
          </Link>
        </div>
        <DashboardNav items={dashboardConfig.sidebarNav} />
      </aside>
      <div className="flex w-full flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center space-x-4">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="flex h-16 items-center border-b px-6">
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2"
                    >
                      <Icons.logo className="h-6 w-6" />

                      <span className="font-bold">Budget Buddy</span>
                    </Link>
                  </div>
                  <DashboardNav items={dashboardConfig.sidebarNav} />
                </SheetContent>
              </Sheet>
              <span className="md:hidden font-bold flex items-center">
                <Icons.logo className="h-6 w-6 mr-2" />
                Budget Buddy
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-6xl p-6">{children}</div>
        </main>
        <Footer className="border-t" />
      </div>
    </div>
  );
}
