// controllers/paymentController.js
const express = require("express");
const path = require("path");
const router = require("express-promise-router")();

router.get("/payment", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/public/payment.html"));
});

module.exports = router;
