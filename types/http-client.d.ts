import type { IClientHttp } from "~/infra/interfaces/config";

declare module "#app" {
  interface NuxtApp {
    $httpClient: IClientHttp;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $httpClient: IClientHttp;
  }
}

export {};
