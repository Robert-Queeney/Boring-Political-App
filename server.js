// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const router = require("./controllers/controller.js");

// Express App Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);

// Server Start
app.listen(PORT, function(){
    console.log("App now listening at localhost:" + PORT);
});