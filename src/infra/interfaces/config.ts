import type AuthService from "./services/auth";
import type BadgeService from "./services/badge";
import type ClassService from "./services/class";
import type MaterialService from "./services/material";
import type PhaseService from "./services/phase";
import type PointService from "./services/point";
import type UserService from "./services/user";
import type VideoService from "./services/video";

export interface IClientHttp {
	user: UserService;
	video: VideoService;
	material: MaterialService;
	badge: BadgeService;
	class: ClassService;
	phase: PhaseService;
	point: PointService;
	auth: AuthService;
}