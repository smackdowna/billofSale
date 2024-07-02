import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createForm,
  getAllForms,
  getFormById,
  getFormsByState,
  returnState,
} from "../controllers/formController.js";
import multipleUpload from "../middlewares/multipleUpload.js";
const router = express.Router();

router.route("/uploadForm").post(isAuthenticated, multipleUpload, createForm);
router.route("/forms").get(getAllForms);
router.route("/forms/state/:state").get(getFormsByState);
router.route("/forms/states").get(returnState);
router.route("/forms/:id").get(getFormById);
export default router;
