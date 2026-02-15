const express = require('express');
const axios = require('axios');
let public_users = express.Router();


const BOOKS_API_URL = 'https://openlibrary.org/developers/api';

// List all books
public_users.get('/', (req, res) => {
    axios.get(BOOKS_API_URL)
        .then(response => res.status(200).json(response.data))
        .catch(err => res.status(500).json({ message: "No books available", error: err.message }));
});

// List all ISBNs
public_users.get(['/isbn', '/isbns'], (req, res) => {
    axios.get(BOOKS_API_URL)
        .then(response => {
            const isbns = Object.keys(response.data);
            res.status(200).json(isbns);
        })
        .catch(err => res.status(500).json({ message: "No ISBNs available", error: err.message }));
});

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    axios.get(`${BOOKS_API_URL}/${isbn}`)
        .then(response => res.status(200).json(response.data))
        .catch(err => res.status(404).json({ message: "Book not found", error: err.message }));
});

// List all authors
public_users.get(['/author', '/authors'], (req, res) => {
    axios.get(BOOKS_API_URL)
        .then(response => {
            const authors = [...new Set(Object.values(response.data).map(book => book.author))];
            res.status(200).json(authors);
        })
        .catch(err => res.status(500).json({ message: "No authors available", error: err.message }));
});

// Get books by a specific author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    axios.get(BOOKS_API_URL)
        .then(response => {
            const filteredBooks = Object.values(response.data)
                .filter(book => book.author.toLowerCase() === author);
            res.status(200).json(filteredBooks);
        })
        .catch(err => res.status(404).json({ message: "Author not found", error: err.message }));
});

// List all titles
public_users.get(['/title', '/titles'], (req, res) => {
    axios.get(BOOKS_API_URL)
        .then(response => {
            const titles = Object.values(response.data).map(book => book.title);
            res.status(200).json(titles);
        })
        .catch(err => res.status(500).json({ message: "No titles available", error: err.message }));
});

// Get books by a specific title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    axios.get(BOOKS_API_URL)
        .then(response => {
            const filteredBooks = Object.values(response.data)
                .filter(book => book.title.toLowerCase() === title);
            res.status(200).json(filteredBooks);
        })
        .catch(err => res.status(404).json({ message: "Title not found", error: err.message }));
});

// Get reviews of a book by ISBN
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    axios.get(`${BOOKS_API_URL}/${isbn}`)
        .then(response => {
            res.status(200).json(response.data.reviews || {});
        })
        .catch(err => res.status(404).json({ message: "Book not found", error: err.message }));
});

module.exports.general = public_users;
