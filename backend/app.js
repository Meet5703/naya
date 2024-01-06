const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const Submission = require("./models/submission");
const multer = require("multer");
const cors = require("cors");

require("dotenv").config();

const app = express();

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Middleware and static file serving setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
console.log("__dirname:", __dirname);
console.log("Views path:", path.join(__dirname, "../Frontend/public/"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../Frontend/public/"));
app.use("/videos", express.static(path.join(__dirname, "backend/upload")));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "backend/upload")); // Update the destination path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Define routes directly within app.js
app.get("/", async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.sendFile(path.join(__dirname, "../Frontend/public/index.html"));
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
app.get("/payment", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/public/payment.html"));
});

app.get("/download-video/:filename", (req, res) => {
  try {
    const videoFilename = req.params.filename;
    const videoPath = path.join(__dirname, "upload", videoFilename);

    if (fs.existsSync(videoPath)) {
      res.setHeader(
        "Content-disposition",
        "attachment; filename=" + videoFilename
      );
      res.setHeader("Content-type", "video/mp4");

      const videoStream = fs.createReadStream(videoPath);
      videoStream.pipe(res);
    } else {
      res.status(404).send("Video not found");
    }
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).send("Error downloading video");
  }
});

app.post("/submit", upload.single("VideoUpload"), async (req, res) => {
  console.log("Received POST request at /submit");
  try {
    // Retrieve form data
    const {
      Name,
      FatherName,
      MotherName,
      Address,
      email,
      ActingRole,
      MobileNumber,
      WhatsAppNumber,
    } = req.body;

    // Validate if any required fields are missing
    const requiredFields = [
      Name,
      FatherName,
      MotherName,
      Address,
      email,
      ActingRole,
      MobileNumber,
      WhatsAppNumber,
    ];
    if (requiredFields.some((field) => !field)) {
      return res.status(400).send("Missing required fields");
    }

    // Create a new Submission object
    const newSubmission = new Submission({
      Name,
      FatherName,
      MotherName,
      Address,
      email,
      ActingRole,
      MobileNumber,
      WhatsAppNumber,
      VideoUpload: req.file ? req.file.path : null,
    });

    // Save the submission to the database
    const savedSubmission = await newSubmission.save();

    console.log("Submission saved:", savedSubmission);
    res.redirect("/payment");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/admin", async (req, res) => {
  try {
    // Fetch submissions data (assuming this logic fetches data from the database)
    const submissions = await Submission.find(); // Fetch submissions data from MongoDB or any other database

    // Render admin.ejs and pass submissions data to the template
    res.render("admin", { submissions }); // Pass submissions data to the admin.ejs template
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
