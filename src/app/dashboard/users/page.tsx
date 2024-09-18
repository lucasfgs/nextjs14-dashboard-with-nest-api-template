import Page from "@/components/pages/dashboard/page";
import PageContent from "@/components/pages/dashboard/page/content";
import {
  PageHeader,
  PageHeaderOptions,
  PageHeaderTitle,
} from "@/components/pages/dashboard/page/header";
import { Button } from "@/components/ui/button";

export default function Users() {
  return (
    <>
      <Page>
        <PageHeader>
          <PageHeaderTitle>Users</PageHeaderTitle>
          <PageHeaderOptions>
            <Button>New User</Button>
          </PageHeaderOptions>
        </PageHeader>
        <PageContent>Content</PageContent>
      </Page>
    </>
  );
}
