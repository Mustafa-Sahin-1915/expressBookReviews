const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ---------- Promise‑based helpers (for Tasks 10‑13) ----------
const getBooksPromise = () => {
  return new Promise((resolve) => {
    resolve(books);
  });
};

const getBookByIsbnPromise = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });
};

const getBooksByAuthorPromise = (author) => {
  return new Promise((resolve) => {
    const matchingBooks = [];
    for (let isbn in books) {
      if (books[isbn].author === author) {
        matchingBooks.push({ isbn, ...books[isbn] });
      }
    }
    resolve(matchingBooks);
  });
};

const getBooksByTitlePromise = (title) => {
  return new Promise((resolve) => {
    const matchingBooks = [];
    for (let isbn in books) {
      if (books[isbn].title === title) {
        matchingBooks.push({ isbn, ...books[isbn] });
      }
    }
    resolve(matchingBooks);
  });
};

// ---------- Task 6: Register a new user ----------
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered" });
});

// ---------- Task 10: Get the book list (async/await) ----------
public_users.get('/', async function (req, res) {
  try {
    const bookList = await getBooksPromise();
    res.send(JSON.stringify(bookList, null, 2));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// ---------- Task 11: Get book details based on ISBN (async/await) ----------
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await getBookByIsbnPromise(isbn);
    res.json(book);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Error" });
  }
});

// ---------- Task 12: Get book details based on author (async/await) ----------
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const booksByAuthor = await getBooksByAuthorPromise(author);
    if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});

// ---------- Task 13: Get all books based on title (async/await) ----------
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const booksByTitle = await getBooksByTitlePromise(title);
    if (booksByTitle.length > 0) {
      res.json(booksByTitle);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title" });
  }
});

// ---------- Task 5: Get book review (synchronous) ----------
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    res.json(book.reviews);
  } else if (book) {
    res.json({});
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;