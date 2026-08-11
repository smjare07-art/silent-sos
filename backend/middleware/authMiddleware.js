import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (
  req,
  res,
  next
) => {
  try {
    let token = null;

    /*
      Primary authentication:
      HttpOnly cookie
    */

    if (req.cookies?.accessToken) {
      token =
        req.cookies.accessToken;
    }

    /*
      Optional Bearer token fallback
      for Postman/API testing
    */

    if (
      !token &&
      req.headers.authorization?.startsWith(
        "Bearer "
      )
    ) {
      token =
        req.headers.authorization.split(
          " "
        )[1];
    }

    /*
      No authentication token
    */

    if (!token) {
      return res.status(401).json({
        success: false,
        code: "NO_TOKEN",
        message:
          "Authentication required.",
      });
    }

    /*
      Verify JWT
    */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    /*
      IMPORTANT:
      generateToken.js stores:

      {
        userId: user._id
      }

      Therefore use decoded.userId,
      NOT decoded.id.
    */

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN_PAYLOAD",
        message:
          "Invalid authentication session.",
      });
    }

    /*
      Find authenticated user
    */

    const user =
      await User.findById(
        decoded.userId
      ).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        code: "USER_NOT_FOUND",
        message:
          "User associated with this session no longer exists.",
      });
    }

    /*
      Check account status
    */

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_DISABLED",
        message:
          "Your account is currently disabled.",
      });
    }

    /*
      Attach authenticated user
      to request
    */

    req.user = user;

    next();

  } catch (error) {

    /*
      Expired JWT
    */

    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        code: "TOKEN_EXPIRED",
        message:
          "Your session has expired. Please log in again.",
      });
    }

    /*
      Invalid JWT
    */

    if (
      error.name ===
      "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN",
        message:
          "Invalid authentication token.",
      });
    }

    next(error);
  }
};

export default protect;