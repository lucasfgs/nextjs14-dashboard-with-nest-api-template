import Page, { ELayout } from "@/components/pages/dashboard/page";
import { EPermission, EPermissionType } from "@/configs/permissions";
import { Roles } from "@/components/pages/dashboard/roles/_page";

import Hydration from "./hydration";

export default async function RolesPage() {
  return (
    <Hydration>
      <Page
        layout={ELayout.Compact}
        className="relative"
        permission={{
          name: EPermission.ROLES,
          type: EPermissionType.READ,
        }}
      >
        <Roles />
      </Page>
    </Hydration>
  );
}
