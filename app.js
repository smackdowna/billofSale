import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

config();

const app = express();

//using middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: [
      "http://localhost:3004",
      "https://bill-of-sales-frontend.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

//Importing and using Routes

import admin from "./routes/adminRoutes.js";
import form from "./routes/formRoutes.js";
import comment from "./routes/commentRoutes.js";
import ErrorMiddleware from "./middlewares/Error.js";

app.use("/api/v1", admin);
app.use("/api/v1", form);
app.use("/api/v1", comment);

export default app;

app.get("/", (req, res) =>
  res.send(`<h1>Welcome To Bill of Sale backend</h1>`)
);

app.use(ErrorMiddleware);
