const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
  const queries = {
    resources: "SELECT COUNT(*) AS count FROM resources",
    categories: "SELECT COUNT(*) AS count FROM categories",
    users: "SELECT COUNT(*) AS count FROM users",
    byCategory: `
      SELECT categories.name AS category_name, COUNT(resources.id) AS count
      FROM categories
      LEFT JOIN resources ON resources.category_id = categories.id
      GROUP BY categories.id, categories.name
      ORDER BY count DESC
    `,
  };

  const results = {};

  db.query(queries.resources, (err, data) => {
    if (err) return res.status(500).json({ message: "Server error" });
    results.totalResources = data[0].count;

    db.query(queries.categories, (err, data) => {
      if (err) return res.status(500).json({ message: "Server error" });
      results.totalCategories = data[0].count;

      db.query(queries.users, (err, data) => {
        if (err) return res.status(500).json({ message: "Server error" });
        results.totalUsers = data[0].count;

        db.query(queries.byCategory, (err, data) => {
          if (err) return res.status(500).json({ message: "Server error" });
          results.byCategory = data;
          res.status(200).json(results);
        });
      });
    });
  });
});

module.exports = router;
