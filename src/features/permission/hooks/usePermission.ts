import { useCallback } from "react";
import useAuth from "@/hooks/useAuth";
import { RolesType } from "../types";

export type UsePermissionProps = {
  role: RolesType;
  checkAccess: (allowedRoles: { allowedRoles: RolesType[] }) => boolean;
};

const usePermission = (): UsePermissionProps => {
  const { user } = useAuth();

  if (!user) {
    throw new Error("User does not exist");
  }

  const checkAccess = useCallback(
    ({ allowedRoles }: { allowedRoles: RolesType[] }) => {
      if (allowedRoles && allowedRoles.length > 0) {
        return allowedRoles?.includes(user.role);
      }

      return true;
    },
    [user.role]
  );

  return { role: user.role, checkAccess };
};

export default usePermission;
