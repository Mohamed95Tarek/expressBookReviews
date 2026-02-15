const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    return users.some(
        (user) => user.username === username && user.password === password
      );
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required" });
  } else if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "incorrect username or password" });
  } else {
    const accessToken = jwt.sign({ data: password }, "access", {
      expiresIn: 60 * 60,
    });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "user logged in successfully" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if(books[req.params.isbn]){
        books[req.params.isbn]['reviews'][req.session.authorization.username] = req.body.review
        return res.status(200).json(books[req.params.isbn]);
    }else{
        return res.status(404).json({message: "Book Not Found"});
    }
});

//Delete a Book Review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    if(books[req.params.isbn]){
        delete books[req.params.isbn]['reviews'][req.session.authorization.username]
        return res.status(200).json({message:"Review Deleted Successfully", data: books[req.params.isbn]['reviews']});
    }else{
        return res.status(404).json({message: "Book Not Found"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
