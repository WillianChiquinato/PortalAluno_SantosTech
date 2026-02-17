import type { IUser } from "./services/user";

export interface LoginResponse {
  token: string;
  user: IUser;
}