// app.js
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const compression = require("compression");
const fs = require("fs").promises;
const Submission = require("./models/submission");

const path = require("path");
require("dotenv").config();

const errorHandler = require("./middleware/errorHandler");

const app = express();
const router = require("express-promise-router")();

// Define storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "./upload"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  express.static(path.join(__dirname, "../frontend/public"), {
    maxAge: 31557600000
  })
); // 1 year cache
app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
); // 1 year cache

// Routes
const indexController = require("./controllers/indexController");
const paymentController = require("./controllers/paymentController");
const downloadController = require("./controllers/downloadController");
const submitController = require("./controllers/submitController");

app.use("/", indexController);
app.use("/payment", paymentController);
app.use("/download-video", downloadController);
app.use(
  "/submit",
  submitController(
    multer({ storage: storage }).single("VideoUpload"),
    Submission
  )
);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
