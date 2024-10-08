"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCanAccess } from "@/utils/hooks/useCanAccess";
import { EPermission, EPermissionType } from "@/configs/permissions";

import { PageHeader, PageHeaderOptions, PageHeaderTitle } from "../page/header";
import PageContent from "../page/content";

import RoleTable from "./role-table";

export function Roles() {
  const canCreateRole = useCanAccess(EPermission.ROLES, EPermissionType.CREATE);

  return (
    <>
      <PageHeader>
        <PageHeaderTitle>Roles</PageHeaderTitle>
        <PageHeaderOptions>
          {canCreateRole && (
            <Link href={`/dashboard/roles/add`}>
              <Button>New Role</Button>
            </Link>
          )}
        </PageHeaderOptions>
      </PageHeader>
      <PageContent>
        <RoleTable />
      </PageContent>
    </>
  );
}
