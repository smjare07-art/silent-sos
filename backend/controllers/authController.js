import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import setAuthCookie from "../utils/setAuthCookie.js";
import crypto from "crypto";

import {
  getEmailTransporter,
} from "../config/email.js";

import passwordResetEmail from "../templates/passwordResetEmail.js";
export const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const normalizedPhone = phone.trim();

    /* Check existing user */

    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: normalizedPhone },
      ],
    });

    if (existingUser) {
      res.status(409);

      if (existingUser.email === normalizedEmail) {
        throw new Error(
          "An account with this email already exists."
        );
      }

      throw new Error(
        "An account with this phone number already exists."
      );
    }

    /* Create user */

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password,
    });

    const token = generateToken(user._id);
    setAuthCookie(res, token);
    res.status(201).json({
      success: true,
      message: "Account created successfully.",

      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
        },

        
      },
    });
  } catch (error) {
    next(error);
  }
};
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordCorrect =
      await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is currently disabled.",
      });
    }

    user.lastLogin = new Date();

    await user.save({
      validateBeforeSave: false,
    });

    const token = generateToken(user._id);

    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login successful.",

      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (
  req,
  res,
  next
) => {
  try {
    const isProduction =
      process.env.NODE_ENV ===
      "production";

    res.clearCookie(
      "accessToken",
      {
        httpOnly: true,

        secure:
          isProduction,

        sameSite:
          isProduction
            ? "none"
            : "lax",

        path: "/",
      }
    );

    res.status(200).json({
      success: true,
      message:
        "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};
export const getMe = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req,
  res,
  next
) => {
  try {
    const { email } = req.body;

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    /*
      Always return the same response.

      This prevents attackers from
      discovering registered emails.
    */

    const successResponse = {
      success: true,

      message:
        "If an account exists for this email, a password reset link has been sent.",
    };

    const user =
      await User.findOne({
        email: normalizedEmail,
        isActive: true,
      });

    if (!user) {
      return res
        .status(200)
        .json(successResponse);
    }

    /*
      Generate cryptographically secure
      random reset token.

      Raw token goes ONLY into email.
    */

    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    /*
      Store only SHA-256 hash
      in MongoDB.
    */

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    /*
      Reset link valid for
      15 minutes.
    */

    user.passwordResetToken =
      hashedToken;

    user.passwordResetExpires =
      new Date(
        Date.now() +
          15 * 60 * 1000
      );

    await user.save({
      validateBeforeSave: false,
    });

    /*
      Frontend reset page.

      Development:
      http://localhost:5173

      Production:
      FRONTEND_URL from .env
    */

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:5173";

    const resetUrl =
      `${frontendUrl}/reset-password/${resetToken}`;

    const template =
      passwordResetEmail({
        userName: user.name,
        resetUrl,
        expiresInMinutes: 15,
      });

    try {
      const transporter =
        getEmailTransporter();

      await transporter.sendMail({
        /*
          IMPORTANT:
          Actual sender shown to recipient.
        */

        from: {
          name:
            process.env.EMAIL_FROM_NAME ||
            "Silent SOS",

          address:
            process.env.EMAIL_FROM_ADDRESS ||
            "silentsos.alerts@gmail.com",
        },

        /*
          User who requested
          password reset.
        */

        to: user.email,

        subject:
          template.subject,

        text:
          template.text,

        html:
          template.html,
      });
    } catch (emailError) {
      /*
        Email failed.

        Remove token so an unusable
        reset token is not left
        in the database.
      */

      user.passwordResetToken =
        null;

      user.passwordResetExpires =
        null;

      await user.save({
        validateBeforeSave: false,
      });

      console.error(
        "Password reset email failed:",
        emailError.message
      );

      return next(
        new Error(
          "Unable to send password reset email. Please try again later."
        )
      );
    }

    return res
      .status(200)
      .json(successResponse);
  } catch (error) {
    next(error);
  }
};


export const resetPassword = async (
  req,
  res,
  next
) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,

        message:
          "Password reset token is required.",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,

        message:
          "New password is required.",
      });
    }

    /*
      Hash token received from URL.

      MongoDB contains only the
      SHA-256 version of the token.
    */

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    /*
      Find user with matching token
      AND valid expiry.

      passwordResetToken and
      passwordResetExpires use
      select:false in User model,
      so explicitly select them.
    */

    const user =
      await User.findOne({
        passwordResetToken:
          hashedToken,

        passwordResetExpires: {
          $gt: new Date(),
        },

        isActive: true,
      }).select(
        "+passwordResetToken +passwordResetExpires"
      );

    if (!user) {
      return res.status(400).json({
        success: false,

        message:
          "Password reset link is invalid or has expired.",
      });
    }

    /*
      Assign new password.

      User model pre-save middleware
      will automatically bcrypt-hash it.
    */

    user.password =
      password;

    /*
      Token becomes single-use.
    */

    user.passwordResetToken =
      null;

    user.passwordResetExpires =
      null;

    await user.save();

    /*
      Do NOT automatically log the user in.

      After a security-sensitive password
      reset, require normal login.
    */

    res.status(200).json({
      success: true,

      message:
        "Password reset successfully. You can now sign in with your new password.",
    });
  } catch (error) {
    next(error);
  }
};