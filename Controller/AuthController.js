const User = require("../model/Users");
const { check, validationResult } = require("express-validator");

//Login and Register Controller

exports.GetLogin = (req, res) => {
  // console.log("Login karo");
  res.render("login", { error: false });
};

exports.PostLogin = async (req, res) => {
  // console.log("Login credentials: ", req.body);

  const data = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  // console.log("User data: ", data.email);
  if (!data) {
    return res.render("login", {
      error: true,
      message: "You are not registered yet/check Your Credentials",
    });
  }

  req.session.isLoggedIn = true;
  req.session.user = data;
  res.redirect("/");
};

exports.GetRegister = (req, res) => {
  // console.log("Registration credentials: ", req.body);
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
      console.log("Ye dekho :", error);
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

      console.log("User Registered Successfully: ", newUser);
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
  // console.log("User Logged Out Successfully: ", req.session.user);
  req.session.destroy((err) => {
    if (err) {
      // console.error("Error destroying session:", err);
      return res.redirect("/");
    }
    res.redirect("/login");
  });
};
