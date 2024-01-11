// controllers/submitController.js
const express = require("express");
const multer = require("multer");
const Submission = require("../models/submission");
const router = require("express-promise-router")();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "./upload"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage }).single("VideoUpload");

router.post("/", async (req, res) => {
  try {
    await upload(req, res);

    const {
      Name,
      FatherName,
      MotherName,
      Address,
      email,
      ActingRole,
      MobileNumber,
      WhatsAppNumber
    } = req.body;

    const requiredFields = [
      Name,
      FatherName,
      MotherName,
      Address,
      email,
      ActingRole,
      MobileNumber,
      WhatsAppNumber
    ];

    if (requiredFields.some((field) => !field)) {
      return res.status(400).send("Missing required fields");
    }

    const newSubmission = new Submission({
      Name,
      FatherName,
      MotherName,
      Address,
      email,
      ActingRole,
      MobileNumber,
      WhatsAppNumber,
      VideoUpload: req.file ? req.file.filename : null
    });

    const savedSubmission = await newSubmission.save();

    console.log("Submission saved:", savedSubmission);
    res.redirect("/payment");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
