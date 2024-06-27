import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Forms } from "../models/form.js";
import getDataUri from "../utils/dataUri.js";
import { uploadImage } from "../utils/imageUploadHandler.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const getAllForms = catchAsyncError(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(Forms.find(), req.query);
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
  try {
    const { name, description, state } = req.body;
    const files = req.files;
    
    const folder = "forms";
    const formFiles = [];

    if (!name || !description || !state) {
      return res.status(400).json({
        success: false,
        message: "Name, description, and state are required.",
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
  } catch (error) {
    console.error("Error creating form:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
