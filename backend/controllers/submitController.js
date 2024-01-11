// controllers/submitController.js
const express = require("express");
const router = express.Router();

module.exports = (upload, Submission) => {
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

  return router;
};
