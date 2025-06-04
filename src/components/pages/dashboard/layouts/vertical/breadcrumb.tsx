import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export function DashboardBreadcrumb({ className }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  let path = "/dashboard";
  const lastSegment = segments[segments.length - 1];

  return (
    <Breadcrumb className={cn("py-2", className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.slice(1).map((segment, idx) => {
          path += "/" + segment;
          const isLast = idx === segments.length - 2;
          return (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast || segment === "edit" ? (
                  <BreadcrumbPage
                    className={`capitalize ${
                      segment !== "edit" && "font-semibold"
                    }`}
                  >
                    {decodeURIComponent(segment)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={path} className="capitalize">
                      {decodeURIComponent(segment)}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
