const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config();
require("./config/db");

const app = express();

app.use(logger("dev"));

const allowedOrigins = [
  "https://fullstack-sern-hhzk.onrender.com",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:3000",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("CORS not allowed: " + origin));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Student Resource API Running" });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/resources", require("./routes/resources"));
app.use("/api/users", require("./routes/users"));
app.use("/api/stats", require("./routes/stats"));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

module.exports = app;
