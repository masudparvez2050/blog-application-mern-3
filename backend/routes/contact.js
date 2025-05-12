const express = require("express");
const { submitContactForm } = require("../controllers/contactController");
const router = express.Router();

// POST /api/contact - Submit contact form
router.post("/", submitContactForm);

module.exports = router;
