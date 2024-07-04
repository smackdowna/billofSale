import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Forms } from "../models/form.js";
import { State } from "../models/state.js";
import getDataUri from "../utils/dataUri.js";
import { deleteImage, uploadImage } from "../utils/imageUploadHandler.js";
import ApiFeatures from "../utils/apiFeatures.js";

// export const returnFormName = catchAsyncError(async (req, res, next) => {
//   const form = await Forms.find().select("_id formName");
//   if (!form) return next(new ErrorHandler("Form not found", 404));
//   res.status(200).json({
//     success: true,
//     form,
//   });
// });
// export const returnState = catchAsyncError(async (req, res, next) => {
//   try {
//     const states = await Forms.find().distinct("state");
//     console.log("states" + states);
//     if (!states) return next(new ErrorHandler("States not found", 404));
//     res.status(200).json({
//       success: true,
//       states,
//     });
//   } catch (error) {
//     console.log("Error getting states:", error);
//   }
// });

export const createForm = catchAsyncError(async (req, res, next) => {
  const { formName, description, metaDescription } = req.body;
  if (!formName || !description || !metaDescription) {
    return res.status(400).json({
      success: false,
      message: "Name, description and  metadescription are required.",
    });
  }
  const form = await Forms.create({
    formName,
    description,
    metaDescription,
  });
  res.status(201).json({
    success: true,
    data: form,
  });
});

export const addState = catchAsyncError(async (req, res, next) => {
  const { formId, stateName } = req.body;
  const files = req.files;
  if (!formId) {
    return res.status(400).json({
      success: false,
      message: "Form Id is required !",
    });
  }

  let form = await Forms.findById(formId);
  if (!form) {
    return res.status(400).json({
      success: false,
      message: `From with the id ${formId} is not found!`,
    });
  }
  const folder = "forms";
  const formFiles = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const fileUri = getDataUri(file);
      const upload = await uploadImage(
        fileUri.content,
        fileUri.fileName,
        folder,
      );
      formFiles.push({
        fileId: upload.fileId,
        url: upload.url,
        thumbnailUrl: upload.thumbnailUrl,
      });
    }
  }
  const state = await State.create({
    stateName,
    forms: formFiles,
  });
  form.forms.push(state._id);
  await form.save();
  res.status(201).json({
    success: true,
    data: state,
    form: form,
  });
});
export const getAllForms = catchAsyncError(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(Forms.find().populate("forms"), req.query)
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
//get speicfic form by id
export const getFormById = catchAsyncError(async (req, res, next) => {
  const form = await Forms.findById(req.params.id).populate("forms");
  if (!form) return next(new ErrorHandler("Form not found", 404));
  console.log(form.forms._id);
  res.status(200).json({
    success: true,
    form,
  });
});

//delete api
export const deleteForm = catchAsyncError(async (req, res, next) => {
  const form = await Forms.findById(req.params.id).populate("forms");
  if (!form) return next(new ErrorHandler("Form not found", 404));
  async function DeleteForms(forms) {
    for (const currentState of forms) {
      for (const file of currentState.forms) {
        await deleteImage(file.fileId);
        await State.findByIdAndDelete(currentState._id);
      }
    }
  }
  DeleteForms(form.forms);
  await form.deleteOne();
  res.status(200).json({
    success: true,
    form: form,
    message: "Form deleted successfully",
  });
});

export const getFormsByState = catchAsyncError(async (req, res, next) => {
  const { state } = req.params;

  // Find states by name
  const stateDocs = await State.find({ stateName: state });
  console.log(stateDocs);
  if (stateDocs.length === 0) {
    return next(new ErrorHandler("State not found", 404));
  }

  let forms = [];
  for (const stateDoc of stateDocs) {
    const formData = await Forms.find({ stateId: stateDoc._id }).populate(
      "forms",
    );
    console.log(formData);
    if (formData.length > 0) {
      forms = forms.concat(formData);
    }
  }
  if (forms.length === 0) {
    return next(new ErrorHandler("Forms not found for the given state", 404));
  }

  res.status(200).json({
    success: true,
    forms,
  });
});
