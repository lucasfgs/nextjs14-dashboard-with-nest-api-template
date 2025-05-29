import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useCanAccess } from "@/utils/hooks/useCanAccess";
import { EPermission, EPermissionType } from "@/configs/permissions";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const canSeeUsers = useCanAccess(EPermission.USERS, EPermissionType.READ);
  const canSeeRoles = useCanAccess(EPermission.ROLES, EPermissionType.READ);
  const canSeeSettings = useCanAccess(
    EPermission.SETTINGS,
    EPermissionType.READ
  );

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
      <Link
        href="/dashboard"
        className={cn(
          "text-lg md:text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard" ? "" : "text-muted-foreground"
        )}
      >
        Home
      </Link>

      {canSeeUsers && (
        <Link
          href="/dashboard/users"
          className={cn(
            "text-lg md:text-sm font-medium transition-colors hover:text-primary",
            pathname.includes("/users") ? "" : "text-muted-foreground"
          )}
        >
          Users
        </Link>
      )}
      {canSeeRoles && (
        <Link
          href="/dashboard/roles"
          className={cn(
            "text-lg md:text-sm font-medium transition-colors hover:text-primary",
            pathname.includes("/roles") ? "" : "text-muted-foreground"
          )}
        >
          Roles
        </Link>
      )}
      {canSeeSettings && (
        <Link
          href="/dashboard/settings"
          className={cn(
            "text-lg md:text-sm font-medium transition-colors hover:text-primary",
            pathname.includes("/settings") ? "" : "text-muted-foreground"
          )}
        >
          Settings
        </Link>
      )}
    </nav>
  );
}
