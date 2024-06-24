    import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
    import ErrorHandler from "../utils/errorHandler.js";
    import { Admin } from "../models/admin.js";
    import { sendToken } from "../utils/sendToken.js";

    export const register = catchAsyncError(async (req, res, next) => {
      const { name, email, password } = req.body;

      if (!name || !email || !password)
        return next(new ErrorHandler("Please Enter All Field", 400));

      let user = await Admin.findOne({ email });

      if (user) return next(new ErrorHandler("user already exist", 409));

      user = await Admin.create({
        name,
        email,
        password,
      });

      sendToken(res, user, "Registered Successfully", 201);
    });

    //login
    export const login = catchAsyncError(async (req, res, next) => {
      const { email, password } = req.body;

      if (!email || !password)
        return next(new ErrorHandler("Please Enter All Field", 400));

      let user = await Admin.findOne({ email });

      if (!user) return next(new ErrorHandler("user doesn't exist", 409));

      if (password != user.password)
        return next(new ErrorHandler("Invalid email or password", 401));

      sendToken(res, user, `Welcome Back ${user.name}`, 200);
    });

    //logout
    export const logout = catchAsyncError(async (req, res, next) => {
      res
        .status(200)
        .cookie("token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .json({
          success: true,
          message: "Logged Out Successfully",
        });
    });

    //get my profile
    export const getmyprofile = catchAsyncError(async (req, res, next) => {
      const user = await Admin.findById(req.user.id);

      if (!user) return next(new ErrorHandler("user doesn't exist", 400));

      res.status(200).json({
        success: true,
        user,
      });
    });
