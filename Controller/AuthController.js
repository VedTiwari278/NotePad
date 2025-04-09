const User = require("../model/Users");
const { check, validationResult } = require("express-validator");

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
