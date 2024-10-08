import Page, { ELayout } from "@/components/pages/dashboard/page";
import PageContent from "@/components/pages/dashboard/page/content";
import {
  PageHeader,
  PageHeaderTitle,
} from "@/components/pages/dashboard/page/header";
import RoleForm from "@/components/pages/dashboard/roles/role-form";
import { EPermission, EPermissionType } from "@/configs/permissions";

import Hydration from "./hydration";

export default async function RolesAdd() {
  return (
    <Hydration>
      <Page
        layout={ELayout.Compact}
        className="relative"
        permission={{
          name: EPermission.ROLES,
          type: EPermissionType.CREATE,
        }}
      >
        <PageHeader>
          <PageHeaderTitle>Create Role</PageHeaderTitle>
        </PageHeader>
        <PageContent>
          <RoleForm />
        </PageContent>
      </Page>
    </Hydration>
  );
}
