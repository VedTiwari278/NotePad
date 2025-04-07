const { Query } = require("mongoose");
const Note = require("../model/InsertData");

exports.getIndex = async (req, res) => {
  const userId = req.session.user._id;
  const data = await Note.find({ user: userId });
  // console.log("Mera data", userId);
  // console.log("Data from database", data);
  res.render("index", { data: data, Query: false });
};

exports.postIndex = (req, res) => {
  const { title, content } = req.body;
  const SaveNote = new Note({
    title: title,
    content: content,
    user: req.session.user,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });

  SaveNote.save();
  res.redirect("/");
};

exports.FindNotes = async (req, res) => {
  // const userId = req.session.user._id;
  const data = await Note.findById(userId);
  // console.log("Mera id ", userId);
  res.render("index", { data: data });
};

exports.FindByid = async (req, res) => {
  const id = req.params.id;
  const data = await Note.findById(id);
  res.render("details", { data: data });
};
exports.deleteNote = async (req, res) => {
  try {
    const id = req.params.id;
    await Note.findByIdAndDelete(id);

    // Redirect to home page instead of rendering
    res.redirect("/");
  } catch (error) {
    res.redirect("/");
  }
};

exports.searchNotes = async (req, res) => {
  // console.log("Searching for notes...");
  // console.log("req.body:", req.body);

  const search_value = req.body["Search-Value"];

  if (typeof search_value !== "string" || !search_value.trim()) {
    return res.status(400).json({ message: "Invalid search value" });
  }

  // console.log("Search value:", search_value);

  const allNotes = await Note.find();

  const searchResults = allNotes.filter(
    (note) =>
      note.title &&
      note.title.toLowerCase().includes(search_value.toLowerCase())
  );
  // console.log("Search results:", searchResults);
  res.render("index", { data: searchResults });
};

exports.EditNotes = async (req, res) => {
  const id = req.params.id;
  const data = await Note.findById(id);
  res.render("edit", { data: data, Query: true });
};

exports.UpdateEditedNote = async (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  const data = await Note.findByIdAndUpdate(id, {
    title: title,
    content: content,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });

  data.save();
  res.redirect("/");
};
