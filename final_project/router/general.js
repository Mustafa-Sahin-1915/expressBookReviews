const express = require('express');
let books = require("./booksdb");
let isValid = require("./auth_users").isValid;
let users = require("./auth_users").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        resolve(books);
    }).then((bookList) => {
        res.status(200).json(bookList);
    }).catch((err) => {
        res.status(500).json({ message: "Error" });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    new Promise((resolve, reject) => {
        const book = books[req.params.isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    }).then((book) => {
        res.status(200).json(book);
    }).catch((err) => {
        res.status(404).json({ message: err });
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res){
    new Promise((resolve, reject) => {
        const author = req.params.author;
        const booksByAuthor = Object.values(books).filter(b => b.author === author);
        if (booksByAuthor.length > 0) resolve(booksByAuthor);
        else reject("No books found for this author");
    }).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(404).json({ message: err });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    new Promise((resolve, reject) => {
        const title = req.params.title;
        const booksByTitle = Object.values(books).filter(b => b.title === title);
        if (booksByTitle.length > 0) resolve(booksByTitle);
        else reject("No books found for this title");
    }).then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(404).json({ message: err });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    new Promise((resolve, reject) => {
        const book = books[req.params.isbn];
        if (book) resolve(book.reviews);
        else reject("Book not found");
    }).then((reviews) => {
        res.status(200).json(reviews);
    }).catch((err) => {
        res.status(404).json({ message: err });
    });
});

module.exports.general = public_users;
