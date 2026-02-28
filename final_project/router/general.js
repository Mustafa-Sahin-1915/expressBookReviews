const express = require('express');
const books = require('./booksdb.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ---------------- REGISTER USER ----------------

const doesExist = (username) => {
  return users.some(user => user.username === username);
};

public_users.post("/register", (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (doesExist(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: "User successfully registered. Now you can login"
  });

});


// ---------------- TASK 10 ----------------
// Get all books using Promise

public_users.get("/", function (req, res) {

  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then((data) => res.status(200).json(data))
  .catch(() => res.status(500).json({ message: "Error fetching books" }));

});


// ---------------- TASK 11 ----------------
// Get book by ISBN using Promise

public_users.get("/isbn/:isbn", function (req, res) {

  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {

    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject();
    }

  })
  .then((data) => res.status(200).json(data))
  .catch(() => res.status(404).json({ message: "Book not found" }));

});


// ---------------- TASK 12 ----------------
// Get books by Author using Promise

public_users.get("/author/:author", function (req, res) {

  const author = req.params.author;

  new Promise((resolve, reject) => {

    const filteredBooks = Object.values(books).filter(
      (book) => book.author === author
    );

    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject();
    }

  })
  .then((data) => res.status(200).json(data))
  .catch(() => res.status(404).json({ message: "Author not found" }));

});


// ---------------- TASK 13 ----------------
// Get books by Title using Promise

public_users.get("/title/:title", function (req, res) {

  const title = req.params.title;

  new Promise((resolve, reject) => {

    const filteredBooks = Object.values(books).filter(
      (book) => book.title === title
    );

    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject();
    }

  })
  .then((data) => res.status(200).json(data))
  .catch(() => res.status(404).json({ message: "Title not found" }));

});


// ---------------- GET BOOK REVIEW ----------------

public_users.get("/review/:isbn", function (req, res) {

  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(books[isbn].reviews);

});


module.exports.general = public_users;