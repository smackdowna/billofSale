import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addState,
  createForm,
  deleteForm,
  getAllForms,
  getFormById,
  getFormsByState,
  returnFormName,
  returnState,
} from "../controllers/formController.js";
import multipleUpload from "../middlewares/multipleUpload.js";
import singleUpload from "../middlewares/multer.js";
const router = express.Router();

router.route("/uploadForm").post(isAuthenticated, singleUpload, createForm);
router.route("/state").post(isAuthenticated, multipleUpload, addState);
router.route("/forms").get(getAllForms);
router.route("/forms/state/:state").get(getFormsByState);
router.route("/forms/states").get(returnState);
router.route("/forms/formName").get(returnFormName);
router.route("/forms/:id").get(getFormById);
router.route("/forms/:id").delete(isAuthenticated, deleteForm);

export default router;
