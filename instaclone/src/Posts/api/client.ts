import createClient from "openapi-fetch";
import type { paths as PostsApiPaths } from "./posts";
import { customFetch } from "../../Common/api/customFetch";

export const postsApiClient = createClient<PostsApiPaths>({
  baseUrl: "http://localhost:8000",
  fetch: customFetch,
});