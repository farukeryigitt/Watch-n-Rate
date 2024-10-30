const express = require("express");
const authController = require("../Controllers/authController.js");
const identifier = require("../Middlewares/identify.js")
const router = express.Router();

router.post("/signup" , authController.signup);
router.post("/signin" , authController.signin);
router.post("/signout" ,identifier.identifier ,authController.signout);

router.patch("/change-password" , identifier.identifier ,authController.changepassword);
router.patch("/send-forgot-password-code" ,authController.sendforgotcode);
router.patch("/verify-forgot-password-code" ,authController.verifyforgotpasswordcode);

module.exports=router;
