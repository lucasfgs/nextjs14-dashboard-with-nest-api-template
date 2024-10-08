import { TPermission } from "@/components/providers/authentication";
import { EPermission, EPermissionType } from "@/configs/permissions";

interface IsAllowedProps {
  authenticatedUserPermissions?: TPermission[];
  permissionName?: EPermission;
  permissionType?: EPermissionType;
}

export function isAllowed({
  authenticatedUserPermissions,
  permissionName,
  permissionType,
}: IsAllowedProps): boolean {
  if (!authenticatedUserPermissions || !permissionName || !permissionType)
    return false;

  const permission = authenticatedUserPermissions.find(
    (p) => p.name.toLowerCase() === permissionName.toLowerCase()
  );
  if (!permission) return false;

  return permission[permissionType];
}
