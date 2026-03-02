const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Checks if username already exists (for registration)
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Checks if username and password match records
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can log in (Task 7)
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token
  const token = jwt.sign({ username }, "secretkey", { expiresIn: '1h' });

  // Store in session
  req.session.username = username;
  req.session.token = token;

  return res.status(200).json({ message: "Login successful", token });
});

// Add or modify a book review (Task 8)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.username;
  if (!username) {
    return res.status(401).json({ message: "You must be logged in to post a review" });
  }

  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) {
    return res.status(400).json({ message: "Review text is required in query parameter 'review'" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Initialize reviews object if needed
  if (!book.reviews) {
    book.reviews = {};
  }

  // Add or update review for this user
  book.reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully", reviews: book.reviews });
});

// Delete a book review (Task 9)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.username;
  if (!username) {
    return res.status(401).json({ message: "You must be logged in to delete a review" });
  }

  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book || !book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  // Delete only this user's review
  delete book.reviews[username];

  return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;