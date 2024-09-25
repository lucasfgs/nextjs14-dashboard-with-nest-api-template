import Link from "next/link";

import Page, { ELayout } from "@/components/pages/dashboard/page";
import PageContent from "@/components/pages/dashboard/page/content";
import {
  PageHeader,
  PageHeaderOptions,
  PageHeaderTitle,
} from "@/components/pages/dashboard/page/header";
import RoleTable from "@/components/pages/dashboard/roles/role-table";
import { Button } from "@/components/ui/button";

import Hydration from "./hydration";

export default async function Roles() {
  return (
    <Hydration>
      <Page layout={ELayout.Compact} className="relative">
        <PageHeader>
          <PageHeaderTitle>Roles</PageHeaderTitle>
          <PageHeaderOptions>
            <Link href={`/dashboard/roles/add`}>
              <Button>New Role</Button>
            </Link>
          </PageHeaderOptions>
        </PageHeader>
        <PageContent>
          <RoleTable />
        </PageContent>
      </Page>
    </Hydration>
  );
}
