// controllers/adminController.js
const express = require("express");
const Submission = require("../models/submission");
const router = require("express-promise-router")();

router.get("/admin", async (req, res) => {
  try {
    const submissions = await Submission.find().lean();
    res.render("admin", { submissions });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
