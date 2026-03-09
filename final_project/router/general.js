const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Task 6 - Register new user
public_users.post("/register",(req,res)=>{

  const username = req.body.username;
  const password = req.body.password;

  if(username && password){

    if(!isValid(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({message:"User successfully registered"});
    }

    return res.status(404).json({message:"User already exists"});

  }

  return res.status(404).json({message:"Unable to register user"});
});


// Task 1 - Get all books
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null,4));
});


// Task 2 - Get book by ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);

});


// Task 3 - Get books by Author
public_users.get('/author/:author',function (req, res) {

  const author = req.params.author;

  let filtered_books = Object.values(books)
  .filter(book => book.author === author);

  return res.status(200).json(filtered_books);

});


// Task 4 - Get books by Title
public_users.get('/title/:title',function (req, res) {

  const title = req.params.title;

  let filtered_books = Object.values(books)
  .filter(book => book.title === title);

  return res.status(200).json(filtered_books);

});


// Task 5 - Get book reviews
public_users.get('/review/:isbn',function (req, res) {

  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);

});



/* =========================
   Tasks 10–13 (Async / Axios)
   ========================= */


// Task 10 - Get all books using async/await
public_users.get('/async/books', async function(req,res){

  try{

    const response = await axios.get("http://localhost:5001/");
    return res.status(200).json(response.data);

  }catch(error){
    return res.status(500).json({message:error.message});
  }

});



// Task 11 - Get book by ISBN using Promises
public_users.get('/async/isbn/:isbn',(req,res)=>{

  const isbn = req.params.isbn;

  axios.get("http://localhost:5001/")
  .then(response => {

    const books = response.data;
    return res.status(200).json(books[isbn]);

  })
  .catch(error => {
    return res.status(500).json({message:error.message});
  });

});



// Task 12 - Get books by Author using async
public_users.get('/async/author/:author', async function(req,res){

  const author = req.params.author;

  try{

    const response = await axios.get("http://localhost:5001/");

    const filtered_books = Object.values(response.data)
      .filter(book => book.author === author);

    return res.status(200).json(filtered_books);

  }catch(error){
    return res.status(500).json({message:error.message});
  }

});



// Task 13 - Get books by Title using async
public_users.get('/async/title/:title', async function(req,res){

  const title = req.params.title;

  try{

    const response = await axios.get("http://localhost:5001/");

    const filtered_books = Object.values(response.data)
      .filter(book => book.title === title);

    return res.status(200).json(filtered_books);

  }catch(error){
    return res.status(500).json({message:error.message});
  }

});


module.exports.general = public_users;
