import type AuthService from "./services/auth";
import type BadgeService from "./services/badge";
import type ClassService from "./services/class";
import type PhaseService from "./services/phase";
import type PointService from "./services/point";
import type UserService from "./services/user";

export interface IClientHttp {
	user: UserService;
	badge: BadgeService;
	class: ClassService;
	phase: PhaseService;
	point: PointService;
	auth: AuthService;
}