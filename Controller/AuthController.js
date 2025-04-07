// Database impoprt
const User = require("../model/Users");

//Login and Register Controller

exports.GetLogin = (req, res) => {
  console.log("Login karo");
  res.render("login");
};

exports.PostLogin = async (req, res) => {
  console.log("Login credentials: ", req.body);

  const data = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (!data) {
    console.log("Invalid credentials");
    return res.redirect("/login");
  }
  console.log("User Logged In Successfully: ", data);
  req.session.isLoggedIn = true;
  req.session.user = data;
  res.redirect("/");
};

exports.GetRegister = (req, res) => {
  console.log("Registration credentials: ", req.body);
  res.render("register");
};
exports.PostRegister = async (req, res) => {
  const { username, email, password } = req.body;
  const data = new User({
    username: username,
    email: email,
    password: password,
  });
  await data.save();

  console.log("User Registered Successfully: ", data);
  res.redirect("/login");
};

exports.Logout = (req, res) => {
  console.log("User Logged Out Successfully: ", req.session.user);
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.redirect("/");
    }
    res.redirect("/login");
  });
}