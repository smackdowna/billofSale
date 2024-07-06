import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Comments } from "../models/comment.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const postComment = catchAsyncError(async (req, res, next) => {
  const { name, email, website, formId, content } = req.body;
  if (!name || !email || !content || !formId) {
    return res.status(400).json({
      success: false,
      message: "Name, email,formID  and content are required.",
    });
  }
  const comment = await Comments.create({
    name,
    email,
    comment: content,
    website,
    formId,
  });
  res.status(201).json({
    success: true,
    comment,
  });
});

export const getAllComments = catchAsyncError(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(Comments.find(), req.query);
  const resultPerPage = 10;
  let comments = await apiFeatures.query;
  let filteredCommentsCount = await comments.length;
  apiFeatures.pagination(resultPerPage);
  res.status(200).json({
    success: true,
    comments,
    resultPerPage,
    filteredCommentsCount,
  });
});

export const getCommentById = catchAsyncError(async (req, res, next) => {
  const comment = await Comments.find({
    formId: req.params.id,
  });
  if (!comment) return next(new ErrorHandler("Comment not found", 404));
  res.status(200).json({
    success: true,
    comment,
  });
});

export const deleteComment = catchAsyncError(async (req, res, next) => {
  const comment = await Comments.find(req.params.id);
  if (!comment) return next(new ErrorHandler("Comment not found", 404));
  await comment.remove();
  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});
