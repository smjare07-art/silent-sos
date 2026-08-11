const setAuthCookie = (res, token) => {
  const isProduction =
    process.env.NODE_ENV === "production";

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
};

export default setAuthCookie;