import createClient from "openapi-fetch";
import type { paths as UserApiPaths } from "./users";
import { customFetch } from "../../Common/api/customFetch";

export const userApiBasePath = "http://localhost:8080"

export const userApiClient = createClient<UserApiPaths>({
  baseUrl: userApiBasePath,
  fetch: customFetch,
});