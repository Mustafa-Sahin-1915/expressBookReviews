const express = require('express');
const jwt = require('jsonwebtoken');

const regd_users = express.Router();

let users = []; // store registered users

// Utility function
function isValid(username) {
  return users.some(user => user.username === username);
}

// Authenticate user
function authenticatedUser(username, password) {
  return users.some(user => user.username === username && user.password === password);
}

// Login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ username }, "access", { expiresIn: 60 * 60 });
    return res.status(200).json({ message: "Login successful", token: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Example protected route
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  // TODO: implement review logic
  res.json({ message: `Review for book ${isbn} added/updated` });
});

// ✅ Export router directly + helper data
module.exports = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
