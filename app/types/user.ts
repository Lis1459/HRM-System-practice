import type { UserRole } from "./auth";

export type UserListItem = {
  id: string;
  email: string;
  profile: {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    avatar: string;
  };
  department: {
    id: number;
    name: string;
  };
  position: {
    id: number;
    name: string;
  };
  role: UserRole;
};
