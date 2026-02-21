const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ── Helper Functions ──────────────────────────────────────────────────────────

// Fetch all books from the local server
async function getAllBooks() {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
}

// Filter books by a given field (e.g. 'author' or 'title') and value
function filterBooks(booksData, field, value) {
    const keys = Object.keys(booksData);
    const matchingKeys = keys.filter(key => booksData[key][field] === value);
    return matchingKeys.map(key => booksData[key]);
}

// ── Public Routes ─────────────────────────────────────────────────────────────

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the full book list (sync)
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Get the full book list (async)
public_users.get('/async', async function (req, res) {
    try {
        const allBooks = await getAllBooks();
        return res.status(200).json(allBooks);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book by ISBN (sync)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (isbn) {
        if (books[isbn]) {
            return res.status(200).json(books[isbn]);
        }
        return res.status(404).json({ message: "No ISBN match" });
    }
    return res.status(404).json({ message: "Please provide ISBN" });
});

// Get book by ISBN (async)
public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
        const allBooks = await getAllBooks();
        const isbn = req.params.isbn;

        if (isbn) {
            if (allBooks[isbn]) {
                return res.status(200).json(allBooks[isbn]);
            }
            return res.status(404).json({ message: "No ISBN match" });
        }
        return res.status(404).json({ message: "Please provide ISBN" });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get books by author (sync)
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    if (author) {
        const result = filterBooks(books, 'author', author);
        if (result.length > 0) {
            return res.status(200).json(result);
        }
        return res.status(404).json({ message: "No author match" });
    }
    return res.status(404).json({ message: "Please provide author" });
});

// Get books by author (async)
public_users.get('/async/author/:author', async function (req, res) {
    try {
        const allBooks = await getAllBooks();
        const author = req.params.author;

        if (author) {
            const result = filterBooks(allBooks, 'author', author);
            if (result.length > 0) {
                return res.status(200).json(result);
            }
            return res.status(404).json({ message: "No author match" });
        }
        return res.status(404).json({ message: "Please provide author" });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get books by title (sync)
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    if (title) {
        const result = filterBooks(books, 'title', title);
        if (result.length > 0) {
            return res.status(200).json(result);
        }
        return res.status(404).json({ message: "No title match" });
    }
    return res.status(404).json({ message: "Please provide title" });
});

// Get books by title (async)
public_users.get('/async/title/:title', async function (req, res) {
    try {
        const allBooks = await getAllBooks();
        const title = req.params.title;

        if (title) {
            const result = filterBooks(allBooks, 'title', title);
            if (result.length > 0) {
                return res.status(200).json(result);
            }
            return res.status(404).json({ message: "No title match" });
        }
        return res.status(404).json({ message: "Please provide title" });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book reviews by ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (isbn) {
        if (books[isbn]) {
            return res.status(200).json(books[isbn].reviews);
        }
        return res.status(404).json({ message: "No ISBN match" });
    }
    return res.status(404).json({ message: "Please provide ISBN to receive the reviews" });
});

module.exports.general = public_users;
