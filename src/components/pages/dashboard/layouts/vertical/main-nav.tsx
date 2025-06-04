"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, Users, Activity } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCanAccess } from "@/utils/hooks/useCanAccess";
import { EPermission, EPermissionType } from "@/configs/permissions";

export const navLinks = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
    match: (pathname: string) => pathname === "/dashboard",
  },
  {
    label: "Users",
    href: "/dashboard/users",
    permission: { type: EPermission.USERS, action: EPermissionType.READ },
    icon: Users,
    match: (pathname: string) => pathname.includes("/users"),
  },
  {
    label: "Roles",
    href: "/dashboard/roles",
    permission: { type: EPermission.ROLES, action: EPermissionType.READ },
    icon: Activity,
    match: (pathname: string) => pathname.includes("/roles"),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    permission: { type: EPermission.SETTINGS, action: EPermissionType.READ },
    icon: Settings,
    match: (pathname: string) => pathname.includes("/settings"),
  },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Logo */}
      <div className="flex flex-col items-center py-6">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 transition duration-200 ease-in-out opacity-85 hover:opacity-100"
        >
          {/* <Image
          src="/logo.png"
          alt="Template Logo"
          width={32}
          height={32}
          className="h-8 w-8"
        /> */}
          <span className="text-xl font-bold">LOGO</span>
        </Link>
      </div>
      <ul className="flex flex-col gap-1">
        {navLinks.map((item) => {
          if (item.permission) {
            const canAccess = useCanAccess(
              item.permission.type,
              item.permission.action
            );
            if (!canAccess) return null;
          }
          const isActive = item.match
            ? item.match(pathname)
            : pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-primary font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-primary"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
