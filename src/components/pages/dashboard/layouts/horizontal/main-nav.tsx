"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useCanAccess } from "@/utils/hooks/useCanAccess";
import { EPermission, EPermissionType } from "@/configs/permissions";

export const navLinks = [
  {
    label: "Home",
    href: "/dashboard",
  },
  {
    label: "Users",
    href: "/dashboard/users",
    permission: { type: EPermission.USERS, action: EPermissionType.READ },
    match: (pathname: string) => pathname.includes("/users"),
  },
  {
    label: "Roles",
    href: "/dashboard/roles",
    permission: { type: EPermission.ROLES, action: EPermissionType.READ },
    match: (pathname: string) => pathname.includes("/roles"),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    permission: { type: EPermission.SETTINGS, action: EPermissionType.READ },
    match: (pathname: string) => pathname.includes("/settings"),
  },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "hidden md:flex items-center space-y-4 md:space-y-0 md:space-x-6 lg:space-x-8",
        className
      )}
      {...props}
    >
      {/* Logo + Text */}
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

      {/* Nav Links */}
      {navLinks.map((link) => {
        // Permission check
        if (link.permission) {
          const canAccess = useCanAccess(
            link.permission.type,
            link.permission.action
          );
          if (!canAccess) return null;
        }
        const isActive = link.match
          ? link.match(pathname)
          : pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-lg md:text-sm font-medium transition-colors hover:text-primary",
              isActive ? "" : "text-muted-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
