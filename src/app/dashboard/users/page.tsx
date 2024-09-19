"use client";

import Page from "@/components/pages/dashboard/page";
import PageContent from "@/components/pages/dashboard/page/content";
import {
  PageHeader,
  PageHeaderOptions,
  PageHeaderTitle,
} from "@/components/pages/dashboard/page/header";
import UserTable from "@/components/pages/dashboard/users/user-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <PageContent>
          <Tabs defaultValue="users">
            <div className="overflow-scroll sm:overflow-auto">
              <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="users" className="space-y-4">
              <UserTable />
            </TabsContent>
            <TabsContent value="roles" className="space-y-4">
              Roles
            </TabsContent>
            <TabsContent value="permissions" className="space-y-4">
              Permissions
            </TabsContent>
          </Tabs>
        </PageContent>
      </Page>
    </>
  );
}