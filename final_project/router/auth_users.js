const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Create JWT token
        const token = jwt.sign({ username }, "access", { expiresIn: "1h" });

        // Save token in session
        req.session.authorization = { accessToken: token };

        return res.status(200).json({ message: "User successfully logged in", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;

    if (!review) {
        return res.status(400).json({ message: "Review is required as a query parameter" });
    }

    if (books[isbn]) {
        const username = req.user; // Set in authentication middleware

        // Add or update the review
        books[isbn].reviews[username] = review;

        return res.status(200).json({
            message: `Review added/updated for ISBN ${isbn}`,
            reviews: books[isbn].reviews
        });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        const username = req.user; // Set in authentication middleware

        if (books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            return res.status(200).json({
                message: `Review deleted for ISBN ${isbn}`,
                reviews: books[isbn].reviews
            });
        } else {
            return res.status(404).json({ message: "You have no review for this book" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
