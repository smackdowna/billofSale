import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

config({
  path: "./config/config.env",
});

const app = express();

//using middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

//Importing and using Routes

import admin from "./routes/adminRoutes.js";

import ErrorMiddleware from "./middlewares/Error.js";

app.use("/api/v1", admin);

export default app;

app.get("/", (req, res) =>
  res.send(`<h1>Welcome To Bill of Sale backend</h1>`)
);

app.use(ErrorMiddleware);
