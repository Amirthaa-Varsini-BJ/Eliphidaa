const express = require("express");
const multer = require("multer");
const Note = require("../models/Note");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// CREATE NOTE
router.post("/", auth, upload.single("pdf"), async (req, res) => {
  const { title, semester, subject } = req.body;

  const note = new Note({
    title,
    semester,
    subject,
    fileUrl: req.file.path,
    uploadedBy: req.user
  });

  await note.save();
  res.json(note);
});

// GET USER NOTES
router.get("/", auth, async (req, res) => {
  const notes = await Note.find({ uploadedBy: req.user });
  res.json(notes);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;