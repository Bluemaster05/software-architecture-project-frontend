import createClient from "openapi-fetch";
import type { paths as UserApiPaths } from "./users";
import { customFetch } from "../../Common/api/customFetch";

export const userApiClient = createClient<UserApiPaths>({
  baseUrl: "http://localhost:8080",
  fetch: customFetch,
});