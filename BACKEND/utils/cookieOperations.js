export const setCookies = (res, token) => {
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
  res.cookie("token", token, options);
};

export const getCookies = (req) => {
  return req.cookies.token;
};

export const clearCookies = (res) => {
  res.clearCookie("token");
};