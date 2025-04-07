const express = require("express");
const Authcontroller = require("../Controller/AuthController");
const Authrouter = express.Router();

// Middleware to check if user is authenticated begin here
Authrouter.use(express.urlencoded({ extended: true }));

Authrouter.get("/register", Authcontroller.GetRegister);
Authrouter.post("/register", Authcontroller.PostRegister);
Authrouter.get("/login", Authcontroller.GetLogin);
Authrouter.post("/login", Authcontroller.PostLogin);
Authrouter.get("/logout", Authcontroller.Logout);

// Middleware to check if user is authenticated End here
module.exports = Authrouter;
