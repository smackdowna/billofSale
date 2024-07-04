import mongoose from "mongoose";
const stateSchema = new mongoose.Schema({
  stateName: {
    type: String,
    required: [true, "Please Enter State"],
  },
  forms: [
    {
      fileId: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      thumbnailUrl: {
        type: String,
      },
    },
  ],
});
export const State = mongoose.model("State", stateSchema);
