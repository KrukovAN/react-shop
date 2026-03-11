import type { ZitadelConfig } from "@zitadel/react";

type ZitadelEnv = ImportMetaEnv & {
  readonly VITE_ZITADEL_AUTHORITY_URI: string;
  readonly VITE_ZITADEL_CLIENT_ID: string;
  readonly VITE_ZITADEL_PROJECT_ID: string;
  readonly VITE_ZITADEL_REDIRECT_URI: string;
  readonly VITE_ZITADEL_POST_LOGOUT_REDIRECT_URI: string;
};

const env = import.meta.env as ZitadelEnv;
const projectId = env.VITE_ZITADEL_PROJECT_ID;
const authorityBase = env.VITE_ZITADEL_AUTHORITY_URI.replace(/\/+$/g, "");
const redirectUri = env.VITE_ZITADEL_REDIRECT_URI;
const postLogoutRedirectUri = env.VITE_ZITADEL_POST_LOGOUT_REDIRECT_URI;
const zitadelApiAudienceScope = "urn:zitadel:iam:org:project:id:zitadel:aud";
const zitadelProjectAudienceScope = `urn:zitadel:iam:org:project:id:${projectId}:aud`;
const zitadelRolesScope = "urn:zitadel:iam:org:projects:roles";

const authConfig: ZitadelConfig = {
  authority: env.VITE_ZITADEL_AUTHORITY_URI,
  client_id: env.VITE_ZITADEL_CLIENT_ID,
  redirect_uri: redirectUri,
  post_logout_redirect_uri: postLogoutRedirectUri,
  response_type: "code",
  scope: `openid profile email offline_access ${zitadelApiAudienceScope} ${zitadelProjectAudienceScope} ${zitadelRolesScope}`,
};

export { authConfig, authorityBase, projectId, redirectUri };
