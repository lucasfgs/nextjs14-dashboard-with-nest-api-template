import Page, { ELayout } from "@/components/pages/dashboard/page";
import PageContent from "@/components/pages/dashboard/page/content";
import {
  PageHeader,
  PageHeaderTitle,
} from "@/components/pages/dashboard/page/header";
import RoleForm from "@/components/pages/dashboard/roles/role-form";

import Hydration from "./hydration";

export default async function Roles() {
  return (
    <Hydration>
      <Page layout={ELayout.Compact} className="relative">
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
