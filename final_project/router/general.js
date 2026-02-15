const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({ message: "username and password are required" });
      
    } else if (users.some((user) => user.username === username)) {
      return res.status(404).json({ message: "user already exists" });
    } else {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "user registered successfully"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    if(books[req.params.isbn]){
        return res.status(200).json(books[req.params.isbn]);
    }else{
        return res.status(404).json({message: "Book Not found"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    var selectedBooks = [];
    Object.values(books).forEach((item) => {
        (item.author == req.params.author)? selectedBooks=[item] : null
    });
    if(selectedBooks.length>0){
        return res.status(200).json(selectedBooks);
    }else{
        return res.status(404).json({message: "Book Not found"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    var selectedBooks = [];
    Object.values(books).forEach((item) => {
        (item.title == req.params.title)? selectedBooks=[item] : null
    });
    if(selectedBooks.length>0){
        return res.status(200).json(selectedBooks);
    }else{
        return res.status(404).json({message: "Book Not found"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    if(books[req.params.isbn]){
        return res.status(200).json(books[req.params.isbn]["reviews"]);
    }else{
        return res.status(404).json({message: "Book Not found"});
    }
});

module.exports.general = public_users;
