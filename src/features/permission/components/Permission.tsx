import { RolesType } from "../types";
import usePermission from "../hooks/usePermission";
import Forbidden from "./Forbbiden";

export const POLICIES = {};

export type PermissionProps = {
  forbiddenFallback?: React.ReactNode;
} & (
  | {
      allowedRoles: RolesType[];
      policyCheck?: never;
    }
  | {
      allowedRoles?: never;
      policyCheck: boolean;
    }
);

const Permission: React.FC<PermissionProps> = ({
  policyCheck,
  allowedRoles,
  forbiddenFallback = Forbidden,
  children,
}) => {
  const { checkAccess } = usePermission();

  let canAccess = false;

  if (allowedRoles) {
    canAccess = checkAccess({ allowedRoles });
  }

  if (typeof policyCheck !== "undefined") {
    canAccess = policyCheck;
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};

export default Permission;
