const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = ( username ) => { //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = ( username, password )=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let user = users.find((user) => {
    return (user.username === username && user.password === password);
  });

  console.log("user", user);
  return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  if(authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
            { username },
            "access",
            { expiresIn: "1h" }
        );

        req.session.authorization = {
            accessToken,
            username
        };
    return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const ISBN = req.params.isbn;
  const { review } = req.body;

  console.log("REq.SESSION", req.session);
  const username = req.session.authorization.username;

  const book = books[ISBN];

  if (!book) {
    return res.status(404).json({ message: "ISBN is not found" });
  }

  if (!book.reviews) {
    book.reviews = {};
  }

  book.reviews[username] = review;

  // console.log("book.reviews[username]", book.reviews[username]);
  res.status(200).json({
    message: "Review added/updated successfully",
    reviews: book.reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  const username = req.session.authorization.username;
  const book = books[ISBN];

  console.log("book", book);
  if (!book) {
      return res.status(404).json({ message: "ISBN is not found" });
    }

  if(!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "Review by this user not found" });
  }

  delete book.reviews[username];

  res.status(200).json({
    message: `Review from ${username} deleted successfully`,
    reviews: book.reviews
  });

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
