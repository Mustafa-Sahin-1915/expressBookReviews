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
public_users.get('/', async (req, res)=> {
    try {
        // Promise'i await ile çözüyoruz
        const bookList = await new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject("Books not found");
            }
        });

        // Başarılı ise veriyi dön
        res.status(200).json(bookList);

    } catch (err) {
        // Hata varsa mesajla birlikte döndür
        res.status(500).json({ message: "Error: " + err });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res)=> {
    try {
        // Promise'i await ile doğrudan çözüyoruz
        const book = await new Promise((resolve, reject) => {
            const bookData = books[req.params.isbn];
            if (bookData) {
                resolve(bookData);
            } else {
                reject("Book not found");
            }
        });

        // Eğer Promise başarılıysa (resolve), kod buraya devam eder
        res.status(200).json(book);

    } catch (err) {
        // Eğer Promise hata dönerse (reject), kod buraya düşer
        res.status(404).json({ message: err });
    }
});
  
// Get book details based on author
public_users.get('/author/:author',async (req, res)=>{
    try {
        const booksByAuthor = await new Promise((resolve, reject) => {
            const author = req.params.author;
            const filteredBooks = Object.values(books).filter(b => b.author === author);
            
            if (filteredBooks.length > 0) {
                resolve(filteredBooks);
            } else {
                reject("No books found for this author");
            }
        });

        // Promise başarıyla sonuçlanırsa veriyi dön
        res.status(200).json(booksByAuthor);

    } catch (err) {
        // Promise hata dönerse (reject) buraya düşer
        res.status(404).json({ message: err });
    }
});

// Get all books based on title
public_users.get('/title/:title',async (req, res)=> {
    try {
        // Promise'i await ile çözüyoruz
        const booksByTitle = await new Promise((resolve, reject) => {
            const title = req.params.title;
            const filteredBooks = Object.values(books).filter(b => b.title === title);
            
            if (filteredBooks.length > 0) {
                resolve(filteredBooks);
            } else {
                reject("No books found for this title");
            }
        });

        // Başarılıysa veriyi JSON olarak dön
        res.status(200).json(booksByTitle);

    } catch (err) {
        // Hata durumunda 404 dön
        res.status(404).json({ message: err });
    }
});

//  Get book review
public_users.get('/review/:isbn',async (req, res)=> {
    try {
        // Promise'i await ile bekletiyoruz
        const reviews = await new Promise((resolve, reject) => {
            const book = books[req.params.isbn];
            if (book) {
                resolve(book.reviews);
            } else {
                reject("Book not found");
            }
        });

        // Başarılı ise yorumları döndür
        res.status(200).json(reviews);

    } catch (err) {
        // Hata durumunda 404 dön
        res.status(404).json({ message: err });
    }
});

module.exports.general = public_users;
