export interface SignInResultParams {
  sub: number;
  profileId: number;
  email: string;
}

export interface SignInParams {
  email: string;
  password: string;
}
