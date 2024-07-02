import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Forms } from "../models/form.js";
import getDataUri from "../utils/dataUri.js";
import { deleteImage, uploadImage } from "../utils/imageUploadHandler.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const getAllForms = catchAsyncError(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(Forms.find(), req.query)
    .search()
    .filter();
  const resultPerPage = 10;
  let forms = await apiFeatures.query;
  let filteredFormsCount = await forms.length;
  apiFeatures.pagination(resultPerPage);
  res.status(200).json({
    success: true,
    forms,
    resultPerPage,
    filteredFormsCount,
  });
});

export const getFormById = catchAsyncError(async (req, res, next) => {
  const form = await Forms.findById(req.params.id);
  if (!form) return next(new ErrorHandler("Form not found", 404));
  res.status(200).json({
    success: true,
    form,
  });
});

export const createForm = catchAsyncError(async (req, res, next) => {
  const { name, description, state } = req.body;
  const files = req.files;

  const folder = "forms";
  const formFiles = [];

  if (!name || !description || !state) {
    return res.status(400).json({
      success: false,
      message: "Name, description and  state are required.",
    });
  }

  if (files && files.length > 0) {
    for (const file of files) {
      const fileUri = getDataUri(file);
      const upload = await uploadImage(
        fileUri.content,
        fileUri.fileName,
        folder
      );
      formFiles.push({
        public_id: upload.fileId,
        url: upload.url,
        thumbnailUrl: upload.thumbnailUrl,
      });
    }
  }

  const form = await Forms.create({
    formName: name,
    description,
    state,
    forms: formFiles,
  });

  res.status(201).json({
    success: true,
    data: form,
  });
});

export const deleteForm = catchAsyncError(async (req, res, next) => {
  const form = await Forms.findById(req.params.id);
  if (!form) return next(new ErrorHandler("Form not found", 404));
  const files = form.forms;
  for (const file of files) {
    await deleteImage(file.public_id);
  }
  await form.deleteOne();
  res.status(200).json({
    success: true,
    form: form,
    message: "Form deleted successfully",
  });
});
export const getFormsByState = catchAsyncError(async (req, res, next) => {
  const { state } = req.params;
  const form = await Forms.find({ state });
  if (!form) return next(new ErrorHandler("Form not found", 404));
  res.status(200).json({
    success: true,
    form,
  });
});
export const returnFormName = catchAsyncError(async (req, res, next) => {
  const form = await Forms.find().select("_id formName");
  if (!form) return next(new ErrorHandler("Form not found", 404));
  res.status(200).json({
    success: true,
    form,
  });
});
export const returnState = catchAsyncError(async (req, res, next) => {
  try {
    const states = await Forms.find().distinct("state");
    console.log("states" + states);
    if (!states) return next(new ErrorHandler("States not found", 404));
    res.status(200).json({
      success: true,
      states,
    });
  } catch (error) {
    console.log("Error getting states:", error);
  }
});
