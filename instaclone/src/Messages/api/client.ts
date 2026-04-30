import createClient from "openapi-fetch";
import type { paths as ChatsApiPaths } from "./chats";
import { customFetch } from "../../Common/api/customFetch";

export const chatsApiClient = createClient<ChatsApiPaths>({
  baseUrl: "http://localhost:3000/",
  fetch: customFetch,
});