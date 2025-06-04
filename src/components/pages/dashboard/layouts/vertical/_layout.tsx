"use client";

import React from "react";

import { ThemeSwitcher } from "@/components/ui/theme-switcher";

import { DashboardBreadcrumb } from "./breadcrumb";
import { MainNav } from "./main-nav";
import { Search } from "./search";
import Transition from "./_transition";
import { UserNav } from "./user-nav";
import HamburgerMenu from "./hamburger-menu";

export default function VerticalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Transition>
      <div className="flex min-h-svh">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r bg-background">
          <div className="flex-1 overflow-auto py-4">
            <MainNav className="flex flex-col space-y-2 px-2 " />
          </div>
          <div className="border-t p-4">
            <UserNav />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <div className="flex h-16 items-center px-8">
            <div className="flex justify-start md:hidden">
              <HamburgerMenu />
            </div>
            <DashboardBreadcrumb className="hidden md:block" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <ThemeSwitcher />
            </div>
          </div>
          <div>{children}</div>
        </main>
      </div>
    </Transition>
  );
}
