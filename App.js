const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dataRouter = require("./Router/DataRouter");

const app = express();
const PORT = 3001;

// Middleware
app.set("view engine", "ejs");
app.set("views", "Views");

app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.use("/", dataRouter);

app.use(express.static(path.join(__dirname, "public")));
// MongoDB Connection
const DB_PATH =
  "mongodb+srv://ved:ved@airbnb.hp2nr.mongodb.net/NotePad?retryWrites=true&w=majority&appName=airbnb";

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
