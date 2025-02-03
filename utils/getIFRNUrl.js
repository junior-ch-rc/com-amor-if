export const getIFRNUrl = (from) => {
  const rootUrl = process.env.NEXT_PUBLIC_REACT_APP_OAUTH2_LOGIN_URI;

  const options = {
    redirect_uri: process.env.NEXT_PUBLIC_REACT_APP_OAUTH2_REDIRECT_URI,
    client_id: process.env.NEXT_PUBLIC_REACT_APP_OAUTH2_CLIENT_ID,
    response_type: "code",
    grant_type: "authorization-code",
    state: from,
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};
