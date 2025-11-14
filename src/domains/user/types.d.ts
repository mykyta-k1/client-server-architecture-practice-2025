declare namespace Domain {
  export type User = {
    email: string;
    username: string;
    passwordHash: string;
    isPrivileged: boolean;
  };

  export interface UserEntity extends User {
    id?: string;
  }

  export type UserConstructorFields = {
    id?: string;
    email: string;
    username: string;
    passwordHash: string;
  };
}
