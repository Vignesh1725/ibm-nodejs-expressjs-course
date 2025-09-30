const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    res.status(201).json({ message: "User registered successfully" });
});


// Get the list of all books
public_users.get('/', async (req, res) => {
    try {
        // Simulate async request with Promise
        const allBooks = await new Promise((resolve, reject) => {
            resolve(books);
        });
        res.send(JSON.stringify(allBooks, null, 4));
    } catch (err) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) resolve(books[isbn]);
            else reject("Book not found");
        });
        res.send(JSON.stringify(book, null, 4));
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();
        const result = await new Promise((resolve, reject) => {
            const booksByAuthor = [];
            Object.keys(books).forEach(isbn => {
                if (books[isbn].author.toLowerCase() === author) {
                    booksByAuthor.push(books[isbn]);
                }
            });
            if (booksByAuthor.length > 0) resolve(booksByAuthor);
            else reject("No books found for this author");
        });
        res.send(JSON.stringify(result, null, 4));
    } catch (err) {
        res.status(404).json({ message: err });
    }
});


// Get book details based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();
        const result = await new Promise((resolve, reject) => {
            const booksByTitle = [];
            Object.keys(books).forEach(isbn => {
                if (books[isbn].title.toLowerCase() === title) {
                    booksByTitle.push(books[isbn]);
                }
            });
            if (booksByTitle.length > 0) resolve(booksByTitle);
            else reject("No books found with this title");
        });
        res.send(JSON.stringify(result, null, 4));
    } catch (err) {
        res.status(404).json({ message: err });
    }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
