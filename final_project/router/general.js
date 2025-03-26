const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
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

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function(req, res) {
  try {
    // We already have the books data imported at the top of the file
    const formattedBooks = {};
    
    // Format the books data
    for (const [isbn, book] of Object.entries(books)) {
      formattedBooks[isbn] = `${book.title} by ${book.author}`;
    }
    
    return res.status(200).json(formattedBooks);
  } catch (error) {
    console.error('Error processing books:', error);
    return res.status(500).json({
      message: "Error getting book list",
      error: error.message
    });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbnDetail = {}
  try {
    const isbn = req.params.isbn

    if (books[isbn]) {
      return res.status(200).json(books[isbn])
    } else {
      return res.status(404).json({message: `Book with ISBN ${isbn} not found`})
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving book details", error: error.message})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  try {
    const authorName = req.params.author
    const filteredBooks = {}

    Object.entries(books).forEach(([isbn, book]) => {
      if (book.author.toLowerCase().includes(authorName.toLowerCase())){
        filteredBooks[isbn] = book
      }
    })

    if(Object.keys(filteredBooks).length > 0) {
      return res.status(200).json(filteredBooks)
    } else {
      return res.status(404).json ({message: `No books found for author: ${authorName}`})
    }
  } catch (error){
    return res.status(500).json({message: "Error finding books by author", error: error.message})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  try {
    const title = req.params.title
    const filteredBooks = {}

    Object.entries(books).forEach(([isbn, book]) => {
      if (book.title.toLowerCase().includes(title.toLowerCase())){
        filteredBooks[isbn] = book
      }
    })

    if(Object.keys(filteredBooks).length > 0) {
      return res.status(200).json(filteredBooks)
    } else {
      return res.status(404).json ({message: `No books found for title: ${title}`})
    }
  } catch (error){
    return res.status(500).json({message: "Error finding books by title", error: error.message})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  try {
    const isbn = req.params.isbn

    if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews.review)
    } else {
      return res.status(404).json({message: `Book with ISBN ${isbn} not found`})
    }
  } catch (error) {
    return res.status(500).json({message: "Error retrieving book details", error: error.message})
  }
});

module.exports.general = public_users;
