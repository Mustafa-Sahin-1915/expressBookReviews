const express = require('express');
const axios = require('axios'); // Import Axios for HTTP requests
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// User registration
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

//  
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('URL_TO_GET_BOOKS'); // Replace with actual URL
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error });
  }
});

// Task 11: Get book by ISBN using async-await
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`URL_TO_GET_BOOK/${isbn}`); // Replace with actual URL
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Book not found", error });
  }
});

public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();
  try {
    const response = await axios.get('URL_TO_GET_BOOKS'); 
    const matchingBooks = response.data.filter(book => book.author.toLowerCase() === author);
    matchingBooks.length > 0
      ? res.json(matchingBooks)
      : res.status(404).json({ message: "No books found by this author" });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error });
  }
});

public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();
  try {
    const response = await axios.get('URL_TO_GET_BOOKS'); 
    const matchingBooks = response.data.filter(book => book.title.toLowerCase().includes(title));
    matchingBooks.length > 0
      ? res.json(matchingBooks)
      : res.status(404).json({ message: "No books found with this title" });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error });
  }
});

// Get reviews
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// ✅ Export router directly
module.exports = public_users;

//old code
/*const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// User registration
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get all books
public_users.get('/', (req, res) => {
  res.json(Object.values(books));
});

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);
  matchingBooks.length > 0
    ? res.json(matchingBooks)
    : res.status(404).json({ message: "No books found by this author" });
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));
  matchingBooks.length > 0
    ? res.json(matchingBooks)
    : res.status(404).json({ message: "No books found with this title" });
});

// Get reviews
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// ✅ Export router directly
module.exports = public_users;
*/