import Router from "express";
import { changeCurrentPassword, currentUser, forgotPasswordRequest, login, logout, refreshAccessToken, registerUser, resendEmailVerification, resetForgotPassword, verifyEmail } from "../controllers/auth.controllers.js";
import { validate } from "../middleware/validator.middleware.js";
import { userChangeCurrentPasswordValidator, userLoginValidator, userRegisterValidator, userForgotPasswordValidator, userResetForgotPasswordValidator } from "../validators/index.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router()

//unsecure routes
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, login);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token/:verificationToken").get(refreshAccessToken);
router.route("/forgot-password").post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(), validate, resetForgotPassword);

//secure routes
router.route("/logout").post(verifyJWT,logout);
router.route("/current-user").post(verifyJWT,currentUser);
router.route("/change-password").post(verifyJWT, userChangeCurrentPasswordValidator(), validate, changeCurrentPassword);
router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification);

export default router;