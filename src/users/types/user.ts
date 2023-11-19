import { RoleName } from '@prisma/client';

export interface FindUserParams {
  id: number;
  profileId: number;
  email: string;
  name: string;
  nickname: string;
  age: number;
  cpf: string;
  roles: RoleName[];
}
