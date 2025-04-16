const User = require("../model/Users");
const { check, validationResult } = require("express-validator");
const nodeMailer = require("nodemailer");
// const bcrypt = require("bcryptjs");

const OtpModel = require("../model/OTPModel");
const { log } = require("console");

//Login and Register Controller

exports.GetLogin = (req, res) => {
  // console.log("Login karo");
  res.render("login", { error: false });
};
exports.PostLogin = [
  check("email").isEmail(),
  check("password").isLength({ min: 6 }),

  async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    // ✅ Combined error message if either field is invalid
    if (!errors.isEmpty()) {
      return res.status(422).render("login", {
        error: ["Invalid email or password"],
        isLoggedIn: false,
      });
    }

    try {
      const user = await User.findOne({ email, password });

      if (!user) {
        return res.status(401).render("login", {
          error: ["User not found or wrong credentials"],
          isLoggedIn: false,
        });
      }

      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect("/");
    } catch (err) {
      console.error("Login Error:", err);
      return res.status(500).render("login", {
        error: ["Something went wrong. Please try again later."],
        isLoggedIn: false,
      });
    }
  },
];

exports.GetRegister = (req, res) => {
  res.render("register");
};

exports.PostRegister = [
  check("username").isLength({ min: 2 }).withMessage("Name is required..."),
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email...")
    .normalizeEmail(),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long"),
  check("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  async (req, res) => {
    const { username, email, password } = req.body;
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).render("register", {
        error: error.array().map((err) => err.msg),
        isLoggedIn: false,
      });
    }

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).render("register", {
          error: "Email is already registered",
          isLoggedIn: false,
        });
      }

      const newUser = new User({ username, email, password });
      await newUser.save();

      res.redirect("/login");
    } catch (err) {
      console.error("Registration error: ", err);
      res.status(500).render("register", {
        error: [err.message],
        isLoggedIn: false,
      });
    }
  },
];

exports.Logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }
    res.redirect("/login");
  });
};
exports.GetOtp = (req, res) => {
  console.log("Forget password is open");
  res.render("ForgetPassword", { error: null });
};

// adjust path as needed

exports.postOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("ForgetPassword", {
        error: "User not found with this email. Please check and try again.",
      });
    }

    // Generate OTP (6-digit random)
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP to the database
    const OTP = new OtpModel({ user: user._id, otp });
    await OTP.save();

    // Sending OTP via email
    const auth = nodeMailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: "vedprakasht759@gmail.com",
        pass: "kwgrrjjudivubvpv", // Use App Password (NEVER expose real password)
      },
    });

    const mailOptions = {
      from: "vedprakasht759@gmail.com",
      to: email,
      subject: "Your Password Reset OTP",
      text: `Hello ${email},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP is valid for 10 minutes.`,
    };

    auth.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Mail error: ", error);
        return res.status(500).send("Failed to send OTP");
      }

      console.log("OTP sent successfully:", info.response);
      res.render("VerifyOtp", { email }); // Redirect to OTP verification page
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.VerifyOtp = async (req, res) => {
  const OTP = req.body.otp;
  console.log("OTP HAI: ", OTP);
  try {
    const DB_OTP = await OtpModel.findOne({ otp: OTP });
    console.log(DB_OTP);
    if (DB_OTP) {
      console.log("Matching OTP");

      const id = DB_OTP.user[0];
      const User_Id = await User.findOne({ _id: id });
      const email = User_Id.email;
      req.session.resetEmail = email;

      res.redirect("/ChangePassword");
    } else {
      console.log("OTP not matched");
      // Stay on the same page and show error message
      return res.render("VerifyOtp", {
        error: "Invalid OTP. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send("Server error");
  }
};

exports.ChangePassword = (req, res) => {
  res.render("ChangePassword", {
    error: [],
    message: null,
    isLoggedIn: false,
  });
};

exports.PostChangedPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const email = req.session.resetEmail;

  if (!email) {
    return res.render("ChangePassword", {
      error: ["Session expired, please try again."],
      message: null,
      isLoggedIn: false,
    });
  }

  if (password !== confirmPassword) {
    return res.render("ChangePassword", {
      error: ["Passwords do not match."],
      message: null,
      isLoggedIn: false,
    });
  }

  try {
    // Optional: hash the password using bcrypt
    // const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.findOne({ email });

    if (!user) {
      return res.render("ChangePassword", {
        error: ["User not found."],
        message: null,
        isLoggedIn: false,
      });
    }

    // Save new password (consider hashing before saving in production)
    user.password = password; // or `hashedPassword` if using bcrypt
    await user.save();

    // Clear session email
    req.session.resetEmail = null;

    res.render("ChangePassword", {
      error: [],
      message: "Password changed successfully. Please login.",
      isLoggedIn: false,
    });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).render("ChangePassword", {
      error: ["Something went wrong. Please try again."],
      message: null,
      isLoggedIn: false,
    });
  }
};
