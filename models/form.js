import mongoose from "mongoose";

const schema = new mongoose.Schema({
  formName: {
    type: String,
    required: [true, "Please Enter Form name"],
    index: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter Description"],
  },
  state: {
    type: String,
    required: [true, "Please Enter your doctor experience in years"],
  },

  forms: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
    index: true,
  },
});

export const Forms = mongoose.model("Forms", schema);
