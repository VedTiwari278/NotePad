const express = require("express");
const controller = require("../Controller/DataController");
const router = express.Router();
router.get("/", controller.getIndex);
router.use(express.urlencoded({ extended: true }));

router.post("/create", controller.postIndex);
router.post("/find", controller.FindNotes);
router.post("/details/:id", controller.FindByid);
router.post("/delete/:id", controller.deleteNote);


module.exports = router;
