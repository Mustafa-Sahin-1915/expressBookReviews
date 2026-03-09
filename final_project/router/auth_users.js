const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

const isValid = (username)=>{

  let user = users.filter(user => user.username === username);

  if(user.length > 0){
    return true;
  }

  return false;
}

const authenticatedUser = (username,password)=>{

  let validusers = users.filter(user=>{
    return user.username===username && user.password===password
  });

  if(validusers.length>0){
    return true;
  }

  return false;
}


// Task 7 - Login
regd_users.post("/login",(req,res)=>{

  const username=req.body.username;
  const password=req.body.password;

  if(authenticatedUser(username,password)){

    let accessToken = jwt.sign(
      {data:password},
      "access",
      {expiresIn:3600}
    );

    req.session.authorization={
      accessToken,
      username
    };

    return res.status(200).send("User successfully logged in");

  } else {

    return res.status(208).json({
      message:"Invalid Login"
    });

  }

});


// Task 8 - Add review
regd_users.put("/auth/review/:isbn",(req,res)=>{

  const isbn=req.params.isbn;
  const review=req.query.review;
  const username=req.session.authorization.username;

  if(books[isbn]){

    books[isbn].reviews[username]=review;

    return res.json({
      message:"Review added successfully"
    });

  }

});


// Task 9 - Delete review
regd_users.delete("/auth/review/:isbn",(req,res)=>{

  const isbn=req.params.isbn;
  const username=req.session.authorization.username;

  if(books[isbn].reviews[username]){

    delete books[isbn].reviews[username];

  }

  return res.json({
    message:"Review deleted successfully"
  });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;