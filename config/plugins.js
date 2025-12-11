module.exports = ({env}) => ({
  'strapi-plugin-sso': {
    enabled: true,
    config: {
      OIDC_REDIRECT_URI: "https://healing-sunshine-c3087bad90.strapiapp.com/strapi-plugin-sso/oidc/callback",
      OIDC_CLIENT_ID: "oauthApp",
      OIDC_CLIENT_SECRET: "8u2L-E7RJ",
      OIDC_SCOPES: "openid profile email api-pa",
      OIDC_AUTHORIZATION_ENDPOINT: "https://demo251-pl.yourtechnicaldomain.com/panel/action/authorize/authorize",
      OIDC_TOKEN_ENDPOINT: "https://demo251-pl.yourtechnicaldomain.com/panel/action/authorize/access_token",
      OIDC_USER_INFO_ENDPOINT: "https://healing-sunshine-c3087bad90.strapiapp.com/api/user-info/oidc-data",
      OIDC_USER_INFO_ENDPOINT_WITH_AUTH_HEADER: true,
      OIDC_GRANT_TYPE: "authorization_code",
    },
  },
});