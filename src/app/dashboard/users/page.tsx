import Page, { ELayout } from "@/components/pages/dashboard/page";
import PageContent from "@/components/pages/dashboard/page/content";
import {
  PageHeader,
  PageHeaderOptions,
  PageHeaderTitle,
} from "@/components/pages/dashboard/page/header";
import NewUser from "@/components/pages/dashboard/users/new-user";
import UserTable from "@/components/pages/dashboard/users/user-table";
import { EPermission, EPermissionType } from "@/configs/permissions";

import Hydration from "./hydration";

export default async function Users() {
  return (
    <Hydration>
      <Page
        layout={ELayout.Compact}
        permission={{
          name: EPermission.USERS,
          type: EPermissionType.READ,
        }}
        className="relative"
      >
        <PageHeader>
          <PageHeaderTitle>Users</PageHeaderTitle>
          <PageHeaderOptions>
            <NewUser />
          </PageHeaderOptions>
        </PageHeader>
        <PageContent>
          <UserTable />
        </PageContent>
      </Page>
    </Hydration>
  );
}
