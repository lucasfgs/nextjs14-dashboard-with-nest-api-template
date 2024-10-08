import { useAuthentication } from "@/components/providers/authentication";
import { EPermission, EPermissionType } from "@/configs/permissions";

import { isAllowed } from "../isAllowed";

export function useCanAccess(
  roles: EPermission,
  type: EPermissionType
): boolean {
  const { permissions } = useAuthentication();

  return isAllowed({
    authenticatedUserPermissions: permissions || undefined,
    permissionName: roles,
    permissionType: type,
  });
}
