import type { FetchOptions } from "ofetch";
import { fetchInstance } from "./baseAPI";

export default abstract class ClientService<T> {
  protected address: string;
  protected fetchInstance = fetchInstance;

  constructor(
    protected name: string,
    address: string
  ) {
    this.address = address;
  }

  protected async get<R>(
    url: string,
    options?: FetchOptions<"json">
  ): Promise<R> {
    return this.fetchInstance<R>(url, {
      method: "GET",
      ...options,
    });
  }

  protected async post<R>(
    url: string,
    body?: any,
    options?: FetchOptions<"json">
  ): Promise<R> {
    return this.fetchInstance<R>(url, {
      method: "POST",
      body,
      ...options,
    });
  }
}