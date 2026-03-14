const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

router.get("/", (req, res) => {
  db.query("SELECT * FROM categories ORDER BY name ASC", (err, data) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.status(200).json(data);
  });
});

router.post("/", auth, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  db.query("INSERT INTO categories (name) VALUES (?)", [name], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.status(201).json({ message: "Category created", id: result.insertId });
  });
});

router.put("/:id", auth, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  db.query("UPDATE categories SET name = ? WHERE id = ?", [name, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.status(200).json({ message: "Category updated" });
  });
});

router.delete("/:id", auth, (req, res) => {
  db.query("DELETE FROM categories WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.status(200).json({ message: "Category deleted" });
  });
});

module.exports = router;
