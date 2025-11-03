const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {username: "User", password: "Pass"}
];

const jwtSecret = "095e8657503e7fea0e4f90d6ca0e0b32"

const isValid = (username)=>{ //returns boolean
    return !users.find(user => user.username === username)
}

const authenticatedUser = (username, password)=> {
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
