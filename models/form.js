import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    formName: {
      type: String,
      required: [true, "Please Enter Form name"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Please Enter Description"],
    },
    metaDescription: {
      type: String,
      required: [true, "Please Enter Meta Description"],
    },
    thumbnail: [
      {
        fileId: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    forms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        default: [],
      },
    ],
  },
  { timestamps: true },
);
schema.index({ formName: "text", description: "text" });
export const Forms = mongoose.model("Forms", schema);
