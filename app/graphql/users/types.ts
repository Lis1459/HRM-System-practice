import type { UserListItem } from "~/types/user";
import type { AuthInput } from "../auth/types";
import type { UserRole } from "~/types/auth";

export type CreateUserInput = {
  auth: AuthInput;
  profile: {
    first_name: string;
    last_name: string;
  };
  cvsIds: [string];
  departmentId: number;
  positionId: number;
  role: UserRole;
};

export type UpdateUserInput = {
  userId: string;
  departmentId?: number;
  positionId?: number;
  role: UserRole;
};

export type UpdateProfileInput = {
  userId: string;
  first_name: string;
  last_name: string;
};

export type UsersListQuery = {
  users: UserListItem[];
};

export type CreateUserMutation = {
  createUser: UserListItem;
};

export type UpdateUserMutation = {
  updateUser: {
    id: string;
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
};

export type UpdateProfileMutation = {
  updateProfile: UpdateProfileInput;
};
