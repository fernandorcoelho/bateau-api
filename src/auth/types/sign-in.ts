import { RoleName } from '@prisma/client';

export interface SignInResultParams {
  access_token: string;
  name: string;
  nickname: string;
  age: number;
  cpf: string;
  roles: RoleName[];
}

export interface SignInParams {
  email: string;
  password: string;
}
