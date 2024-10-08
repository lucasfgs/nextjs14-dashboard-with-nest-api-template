"use client";

import { ThemeSwitcher } from "@/components/ui/theme-switcher";

import { MainNav } from "./main-nav";
import { Search } from "./search";
import Transition from "./_transition";
import { UserNav } from "./user-nav";
import HamburgerMenu from "./hamburger-menu";
import UpgradePlan from "./upgrade-plan";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Transition>
      <main className="flex-col md:flex relative min-h-svh">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="hidden ml-auto md:flex items-center space-x-4">
              <Search />
              <ThemeSwitcher />
              <UserNav />
            </div>
            <div className="flex md:hidden ml-auto">
              <HamburgerMenu />
            </div>
          </div>
        </div>
        {children}
        <UpgradePlan className="absolute left-2 bottom-2 max-w-xs" />
      </main>
    </Transition>
  );
}
