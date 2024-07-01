import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  email: {
    type: String,
    required: [true, "Please Enter your email"],
  },
  website: {
    type: String,
  },
  formId: {
    type: mongoose.Schema.ObjectId,
    ref: "Form",
    required: true,
  },
  comment: {
    type: String,
    required: [true, "Please Enter your comment"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
export const Comments = mongoose.model("Comments", schema);
