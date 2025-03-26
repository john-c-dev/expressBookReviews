const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    const username = req.session.authorization.username
    const isbn = req.params.isbn
    const review = req.body.review

    if(!books[isbn]) {
      return res.status(404).json({message: `Book with ISBN ${isbn} not found`})
    }

    if(!books[isbn].reviews) {
      books[isbn].reviews = {}
    }
    books[isbn].reviews[username] = review

    return res.status(200).json({message: `Review for book ${isbn} by ${username} added/updated successful`})
  } catch (error) {
    return res.status(500).json({message: `Error adding review`})
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const username = req.session.authorization.username
    const isbn = req.params.isbn

    if(!books[isbn]) {
      return res.status(404).json({message: `Book with ISBN ${isbn} not found`})
    }

    if(!books[isbn].reviews) {
      return res.status(404).json({message: `Book with ISBN ${isbn} no reviews to delete`})
    }

    if(!books[isbn].reviews[username]) {
      return res.status(404).json({message: `Book with ISBN ${isbn} no reviews by ${username} to delete`})
    }
    
    delete books[isbn].reviews[username]

    return res.status(200).json({message: `Review for book ${isbn} by ${username} delete successful`})
  } catch (error) {
    return res.status(500).json({message: `Error adding review`})
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
