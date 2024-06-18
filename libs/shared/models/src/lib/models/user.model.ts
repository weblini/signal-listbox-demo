export interface User {
  id: number;
  name: string;
  permissions: UserAction[];
}

export type UserAction = 'edit' | 'create';
