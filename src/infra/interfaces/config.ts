import type AuthService from "./services/auth";
import type UserService from "./services/user";

export interface IClientHttp {
	user: UserService;
	auth: AuthService;
}