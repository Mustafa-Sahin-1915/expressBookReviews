const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
public_users.post("/register", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user. Username and/or password not provided"});
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    axios.get(`http://localhost:5000/`)
        .then(response => {
            const books = response.data.books;
            const filteredBooks = Object.values(books).filter(book => book.isbn === isbn);

            if (filteredBooks.length > 0) {
                res.json(filteredBooks);
            } else {
                res.status(404).json({ message: `No books found with ISBN ${isbn}` });
            }
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});


// Get the user list available in the shop
public_users.get('/users', function (req, res) {
    res.send(JSON.stringify({ users }, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = Object.values(books).find(book => book.isbn === isbn);

    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        res.send(`Book with ISBN ${isbn} not found.`);
    }
}); 

public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;

        const response = await axios.get(`http://localhost:5000/`);
        const books = response.data.books;

        const filteredBooks = Object.values(books).filter(
            book => book.author.toLowerCase() === author.toLowerCase()
        );

        if (filteredBooks.length > 0) {
            res.json(filteredBooks);
        } else {
            res.status(404).json({ message: `No books found by author ${author}` });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;

        const response = await axios.get(`http://localhost:5000/`);
        const books = response.data.books;

        const filteredBooks = Object.values(books).filter(
            book => book.title.toLowerCase() === title.toLowerCase()
        );

        if (filteredBooks.length > 0) {
            res.json(filteredBooks);
        } else {
            res.status(404).json({ message: `No books found with title ${title}` });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


public_users.get('/isbn-async/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;

        const response = await axios.get(`http://localhost:5000/`);
        const books = response.data.books;

        const filteredBooks = Object.values(books).filter(
            book => book.isbn === isbn
        );

        if (filteredBooks.length > 0) {
            res.json(filteredBooks);
        } else {
            res.status(404).json({ message: `No books found with ISBN ${isbn}` });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports.general = public_users;
