import express from "express";
import { getmyprofile, login, logout, register } from "../controllers/adminController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

//register
router.route("/register").post(register);

//login
router.route("/login").post(login);

//logout
router.route("/logout").get(logout);

//get my profile
router.route("/me").get(isAuthenticated,getmyprofile);


export default router;
