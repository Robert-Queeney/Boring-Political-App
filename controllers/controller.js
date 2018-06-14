// Dependencies
const express = require("express");
const path = require("path");

// Router Setup
const router = express.Router();

// Routes
router.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "../views/index.html"));
});

// Export
module.exports = router;