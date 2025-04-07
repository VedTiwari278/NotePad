const express = require("express");
const controller = require("../Controller/DataController");
const router = express.Router();

router.get("/", controller.getIndex);
router.get("/edit/:id", controller.EditNotes);

router.use(express.urlencoded({ extended: true }));

router.post("/create", controller.postIndex);
router.post("/find", controller.FindNotes);
router.post("/details/:id", controller.FindByid);
router.post("/delete/:id", controller.deleteNote);
router.post("/search", controller.searchNotes);
router.post("/edit/:id", controller.UpdateEditedNote);

module.exports = router;
