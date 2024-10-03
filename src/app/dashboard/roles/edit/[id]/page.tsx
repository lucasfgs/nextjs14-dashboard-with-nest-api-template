import PageContent from "@/components/pages/dashboard/page/content";
import {
  PageHeader,
  PageHeaderTitle,
} from "@/components/pages/dashboard/page/header";
import RoleForm from "@/components/pages/dashboard/roles/role-form";
import Page, { ELayout } from "@/components/pages/dashboard/page";

import Hydration from "./hydration";

interface RoleProps {
  params: {
    id: string;
  };
}

const Role = async ({ params }: RoleProps) => {
  return (
    <Hydration id={Number(params.id)}>
      <Page layout={ELayout.Compact} className="relative">
        <PageHeader>
          <PageHeaderTitle>Edit Role</PageHeaderTitle>
        </PageHeader>
        <PageContent>
          <RoleForm roleId={Number(params.id)} />
        </PageContent>
      </Page>
    </Hydration>
  );
};

export default Role;
