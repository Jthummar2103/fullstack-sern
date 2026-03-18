const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

router.get("/me", auth, (req, res) => {
  db.query(
    "SELECT id, name, email FROM users WHERE id = ?",
    [req.user.id],
    (err, data) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (!data.length) return res.status(404).json({ message: "User not found" });
      res.status(200).json(data[0]);
    }
  );
});

module.exports = router;
