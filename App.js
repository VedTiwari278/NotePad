const DB_PATH =
  "mongodb+srv://ved:ved@airbnb.hp2nr.mongodb.net/NotePad?retryWrites=true&w=majority&appName=airbnb";

// const flash = require("connect-flash");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dataRouter = require("./Router/DataRouter");
const authRouter = require("./Router/AuthRouter");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();
const PORT = 3001;

// yha se session bn rha hai

const storage = new MongoDBStore({
  uri: DB_PATH,
  collection: "UserSession",
});

//secret key create ho rha hai

app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    store: storage,
  })
);

// is login or not check ho rha hai

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

// Middleware

app.set("view engine", "ejs");
app.set("views", "Views");

app.use(express.urlencoded({ extended: true }));

// app.use(express.json());

app.use(authRouter);
app.use((req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.use("/", dataRouter);
app.use(express.static(path.join(__dirname, "public")));
// MongoDB Connection

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error While Connecting MongoDB:", err);
  });
