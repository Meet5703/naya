// controllers/indexController.js
const express = require("express");
const Submission = require("../models/submission");
const path = require("path");
const router = require("express-promise-router")();

router.get("/", async (req, res) => {
  try {
    const submissions = await Submission.find().lean();
    res.sendFile(path.join(__dirname, "../Frontend/public/index.html"));
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
