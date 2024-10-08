import { redirect } from "next/navigation";

import { EPermission, EPermissionType } from "@/configs/permissions";
import { cn } from "@/lib/utils";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { isAllowed } from "@/utils/isAllowed";

export enum ELayout {
  Full,
  Compact,
}

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  layout: ELayout;
  permission?: {
    name: EPermission;
    type: EPermissionType;
  };
}

export default async function Page({
  children,
  className,
  layout,
  permission,
  ...props
}: PageProps) {
  const authenticatedUser = await getAuthenticatedUser();

  if (
    permission &&
    !isAllowed({
      authenticatedUserPermissions: authenticatedUser?.permissions,
      permissionName: permission.name,
      permissionType: permission.type,
    })
  ) {
    redirect("/dashboard");
  }

  return (
    <div
      className={cn(
        `flex-1 space-y-4 p-8 pt-6 ${
          layout === ELayout.Compact && "mx-auto w-full max-w-7xl"
        }`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
