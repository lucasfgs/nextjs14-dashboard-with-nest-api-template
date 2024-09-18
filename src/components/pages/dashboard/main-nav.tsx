import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  console.log("pathname: ", pathname);

  return (
    <nav
      className={cn(
        "hidden md:flex items-center space-y-4 md:space-y-0 md:space-x-4 lg:space-x-6",
        className
      )}
      {...props}
    >
      <Link
        href="/dashboard"
        className={cn(
          "text-lg md:text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard" ? "" : "text-muted-foreground"
        )}
      >
        Overview
      </Link>
      <Link
        href="/dashboard"
        className={cn(
          "text-lg md:text-sm font-medium transition-colors hover:text-primary",
          pathname.includes("/customers") ? "" : "text-muted-foreground"
        )}
      >
        Customers
      </Link>
      <Link
        href="/dashboard"
        className={cn(
          "text-lg md:text-sm font-medium transition-colors hover:text-primary",
          pathname.includes("/products") ? "" : "text-muted-foreground"
        )}
      >
        Products
      </Link>
      <Link
        href="/dashboard/users"
        className={cn(
          "text-lg md:text-sm font-medium transition-colors hover:text-primary",
          pathname.includes("/users") ? "" : "text-muted-foreground"
        )}
      >
        Users
      </Link>
      <Link
        href="/dashboard"
        className={cn(
          "text-lg md:text-sm font-medium transition-colors hover:text-primary",
          pathname.includes("/settings") ? "" : "text-muted-foreground"
        )}
      >
        Settings
      </Link>
    </nav>
  );
}
