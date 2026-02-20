import { defineNuxtPlugin } from "nuxt/app";
import type { IClientHttp } from "~/infra/interfaces/config";
import AuthService from "~/infra/interfaces/services/auth";
import BadgeService from "~/infra/interfaces/services/badge";
import ClassService from "~/infra/interfaces/services/class";
import CourseService from "~/infra/interfaces/services/course";
import MaterialService from "~/infra/interfaces/services/material";
import PhaseService from "~/infra/interfaces/services/phase";
import PointService from "~/infra/interfaces/services/point";
import UserService from "~/infra/interfaces/services/user";
import VideoService from "~/infra/interfaces/services/video";

export default defineNuxtPlugin(()=>{

  const httpClientServices: IClientHttp = {
		user: new UserService(),
		badge: new BadgeService(),
		class: new ClassService(),
		point: new PointService(),
		phase: new PhaseService(),
		video: new VideoService(),
		material: new MaterialService(),
		course: new CourseService(),
		auth: new AuthService(),
	};

  return {
		provide: {
			httpClient: httpClientServices,
		},
	};
})