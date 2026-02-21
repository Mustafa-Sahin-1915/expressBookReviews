const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if a user with the given username already exists
const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        // ✅ Return JSON, not plain text
        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const reviewInput = req.query.review;
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (username && isbn && reviewInput) {
        if (books[isbn]) {
            books[isbn].reviews[username] = reviewInput;
            // ✅ Include ISBN and reviews object in response
            return res.status(200).json({
                message: `Review for ISBN ${isbn} added`,
                reviews: books[isbn].reviews
            });
        } else {
            return res.status(404).json({ message: "No ISBN match" });
        }
    } else {
        return res.status(404).json({ message: "Invalid Input" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (username && isbn) {
        if (books[isbn]) {
            if (books[isbn].reviews[username]) {
                delete books[isbn].reviews[username];
                // ✅ Include ISBN and username in response
                return res.status(200).json({ message: `Review for ISBN ${isbn} deleted by ${username}` });
            } else {
                return res.status(404).json({ message: "You have no review for that book" });
            }
        } else {
            return res.status(404).json({ message: "No ISBN match" });
        }
    } else {
        return res.status(404).json({ message: "Invalid Input" });
    }
});

module.exports.authenticated = regd_users;
module.exports.doesExist = doesExist;
module.exports.users = users;
