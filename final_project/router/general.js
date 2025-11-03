const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({ message: "Username and password are required" });
    }
    if (!isValid(username)) {
        return res.status(400).send({ message: "Username already exists" });
    }
    users.push({ username, password });
    res.status(200).send({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const bookList = await new Promise((resolve, reject) => {
        resolve(JSON.stringify(books));
    });
    res.status(200).json(bookList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    var book = await new Promise ((resolve, reject) => {
      var book = books[isbn]
      if (!book) {
        reject("Book not found");
      }
      resolve(book);
    });
    res.status(200).json(JSON.stringify(book))
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
 });

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    var book = await new Promise((resolve, reject) => {
      var bookArray = Object.values(books);
      var book = bookArray.find(element => element.author === author);
      if (!book) {
        reject("Book not found");
      }
      resolve(JSON.stringify(book));
    });
    res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    try {
      var bookArray = Object.values(books);
      var filteredBooks = bookArray.filter(element => element.title === title);
      res.status(200).json(JSON.stringify(filteredBooks));
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    try {
      var book = books[isbn]
      if (!book) {
          throw Error("Book not found")
      }
      res.status(200).json(JSON.stringify(book.reviews))
    } catch (error) {
      return res.status(404).json({message: error.message});
    }
});

module.exports.general = public_users;
