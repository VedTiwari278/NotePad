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
Authrouter.get("/forgot-password", Authcontroller.GetOtp);
Authrouter.post("/forgot-password", Authcontroller.postOtp);
// Authrouter.get("")
Authrouter.post("/verify-otp", Authcontroller.VerifyOtp);

Authrouter.get("/ChangePassword", Authcontroller.ChangePassword);

Authrouter.post("/set-password", Authcontroller.PostChangedPassword);

// Authrouter.post("/")
// Middleware to check if user is authenticated End here
module.exports = Authrouter;
