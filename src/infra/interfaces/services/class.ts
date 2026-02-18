import type { $Fetch, FetchOptions, FetchResponse } from "ofetch";
import ClientService from "~/infra/clientService";
import type { ApiResponse } from "~/infra/response/apiResponse";

export interface IClass {
  id: number;
  name: string;
}

export default class ClassService extends ClientService<any> {
  constructor() {
    super("Class", "api/Class");
  }
}