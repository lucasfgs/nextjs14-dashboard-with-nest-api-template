import { EPermission } from "./permissions";

export const navigation = [
  {
    title: "Overview",
    link: "/dashboard",
  },
  {
    title: "Users",
    link: "/dashboard/users",
    allowedPermissions: [EPermission.USERS],
  },
  {
    title: "Roles",
    link: "/dashboard/roles",
    allowedPermissions: [EPermission.ROLES],
  },
  {
    title: "Settings",
    link: "/dashboard/settings",
    allowedPermissions: [EPermission.SETTINGS],
  },
];
