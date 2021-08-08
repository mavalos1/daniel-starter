export enum ROLES {
  ADMIN,
  USER,
}

export type RolesType = keyof typeof ROLES;
