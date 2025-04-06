const Note = require("../model/InsertData");

exports.getIndex = async (req, res) => {
  const data = await Note.find();
  res.render("index", { data: data });
};

exports.postIndex = (req, res) => {
  const { title, content } = req.body;
  const SaveNote = new Note({
    title: title,
    content: content,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });

  SaveNote.save();
  res.redirect("/");
};

exports.FindNotes = async (req, res) => {
  const data = await Note.find();
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
    res.redirect('/');
  } catch (error) {
    res.redirect('/');
  }
};