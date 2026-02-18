import { defineNuxtPlugin } from "nuxt/app";
import type { IClientHttp } from "~/infra/interfaces/config";
import AuthService from "~/infra/interfaces/services/auth";
import BadgeService from "~/infra/interfaces/services/badge";
import ClassService from "~/infra/interfaces/services/class";
import PhaseService from "~/infra/interfaces/services/phase";
import PointService from "~/infra/interfaces/services/point";
import UserService from "~/infra/interfaces/services/user";

export default defineNuxtPlugin(()=>{

  const httpClientServices: IClientHttp = {
		user: new UserService(),
		badge: new BadgeService(),
		class: new ClassService(),
		point: new PointService(),
		phase: new PhaseService(),
		auth: new AuthService(),
	};

  return {
		provide: {
			httpClient: httpClientServices,
		},
	};
})