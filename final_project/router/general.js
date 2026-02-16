const express = require('express');
const axios = require('axios');
const public_users = express.Router();

// Base Open Library API URL
const OPENLIB_API = 'https://openlibrary.org';

// ---------------------------
// Get a list of popular books (example: "love" subject)
// ---------------------------
public_users.get('/books', async (req, res) => {
    try {
        const response = await axios.get(`${OPENLIB_API}/subjects/love.json?limit=10`);
        const books = response.data.works.map(work => ({
            title: work.title,
            authors: work.authors.map(a => a.name),
            key: work.key,
            edition_count: work.edition_count
        }));
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch books', error: error.message });
    }
});

// ---------------------------
// Get book details by ISBN
// ---------------------------
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`${OPENLIB_API}/isbn/${isbn}.json`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: 'Book not found', error: error.message });
    }
});

// ---------------------------
// List all authors from a subject (example: "love")
// ---------------------------
public_users.get('/authors', async (req, res) => {
    try {
        const response = await axios.get(`${OPENLIB_API}/subjects/love.json?limit=50`);
        const authors = new Set();
        response.data.works.forEach(work => {
            work.authors.forEach(a => authors.add(a.name));
        });
        res.status(200).json([...authors]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch authors', error: error.message });
    }
});

// ---------------------------
// Get books by author name
// ---------------------------
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`${OPENLIB_API}/search.json?author=${encodeURIComponent(author)}`);
        const books = response.data.docs.map(doc => ({
            title: doc.title,
            isbn: doc.isbn ? doc.isbn[0] : 'N/A',
            first_publish_year: doc.first_publish_year
        }));
        res.status(200).json(books);
    } catch (error) {
        res.status(404).json({ message: 'Author not found', error: error.message });
    }
});

// ---------------------------
// List titles from a subject (example: "love")
// ---------------------------
public_users.get('/titles', async (req, res) => {
    try {
        const response = await axios.get(`${OPENLIB_API}/subjects/love.json?limit=50`);
        const titles = response.data.works.map(work => work.title);
        res.status(200).json(titles);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch titles', error: error.message });
    }
});

// ---------------------------
// Get books by title keyword
// ---------------------------
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const response = await axios.get(`${OPENLIB_API}/search.json?title=${encodeURIComponent(title)}`);
        const books = response.data.docs.map(doc => ({
            title: doc.title,
            author_name: doc.author_name,
            isbn: doc.isbn ? doc.isbn[0] : 'N/A'
        }));
        res.status(200).json(books);
    } catch (error) {
        res.status(404).json({ message: 'Title not found', error: error.message });
    }
});

module.exports.general = public_users;
