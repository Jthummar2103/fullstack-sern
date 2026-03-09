const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: "Server error" });

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already registered" });
          }
          return res.status(500).json({ message: "Server error" });
        }
        res.status(201).json({ message: "User registered" });
      }
    );
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, data) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!data.length) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, data[0].password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
      },
    });
  });
};
