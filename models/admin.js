import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  email: {
    type: String,
    required: [true, "Please Enter your email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your password"],
  },
  role: {
    type: String,
    default: "admin",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

schema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const Admin = mongoose.model("Admin", schema);
