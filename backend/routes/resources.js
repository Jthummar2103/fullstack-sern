const express = require("express");
const router = express.Router();

const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

router.get("/", (req, res) => {
  const sql = `
    SELECT resources.*,
           users.name AS user_name,
           categories.name AS category_name
    FROM resources
    LEFT JOIN users ON resources.user_id = users.id
    LEFT JOIN categories ON resources.category_id = categories.id
    ORDER BY resources.id DESC
  `;

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.status(200).json(data);
  });
});

router.get("/:id", auth, (req, res) => {
  const sql = `
    SELECT resources.*,
           users.name AS user_name,
           categories.name AS category_name
    FROM resources
    LEFT JOIN users ON resources.user_id = users.id
    LEFT JOIN categories ON resources.category_id = categories.id
    WHERE resources.id = ?
  `;

  db.query(sql, [req.params.id], (err, data) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!data.length) return res.status(404).json({ message: "Resource not found" });
    res.status(200).json(data[0]);
  });
});

router.post("/", auth, (req, res) => {
  const { title, description, link } = req.body;
  const category_id = req.body.category_id || 1;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const sql = `
    INSERT INTO resources (title, description, link, user_id, category_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, description, link, req.user.id, category_id], (err) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.status(201).json({ message: "Resource created" });
  });
});

router.put("/:id", auth, (req, res) => {
  const resourceId = req.params.id;
  const userId = req.user.id;
  const { title, description, link } = req.body;
  const category_id = req.body.category_id || 1;

  const checkSql = "SELECT * FROM resources WHERE id = ? AND user_id = ?";

  db.query(checkSql, [resourceId, userId], (err, data) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!data.length) return res.status(403).json({ message: "Not authorized" });

    const updateSql = `
      UPDATE resources
      SET title = ?, description = ?, link = ?, category_id = ?
      WHERE id = ?
    `;

    db.query(updateSql, [title, description, link, category_id, resourceId], (err) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.status(200).json({ message: "Resource updated" });
    });
  });
});

router.delete("/:id", auth, (req, res) => {
  const sql = "DELETE FROM resources WHERE id = ? AND user_id = ?";

  db.query(sql, [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (result.affectedRows === 0) return res.status(403).json({ message: "Not authorized" });
    res.status(200).json({ message: "Resource deleted" });
  });
});

module.exports = router;
