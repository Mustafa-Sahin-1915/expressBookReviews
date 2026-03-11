const express = require('express');
let books = require("./booksdb");
let isValid = require("./auth_users").isValid;
let users = require("./auth_users").users;
const public_users = express.Router();


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
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book){
        res.send(book);
    }
    res.status(404).json({message:"book not found"});
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let keys = Object.keys(books);
    keys.forEach(key=>{
        const book = books[key];
        if (book.author===author){
            res.send(book);
        }
    });

    res.status(404).json({message:"book not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let keys = Object.keys(books);
    keys.forEach(key=>{
        const book = books[key];
        if (book.title===title){
            res.send(book);
        }
    });

    res.status(404).json({message:"book not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book){
        res.send(book.reviews);
    }
    res.status(404).json({message:"book not found"});
});

module.exports.general = public_users;
