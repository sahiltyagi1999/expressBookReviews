const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();


const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {  return false;}
}



public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
            return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});



// Get the book list available in the shop

public_users.get('/books', function (req, res) {
    // Simulate promise-like behavior
    const fetchData = () => {
        return new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject(new Error('No books data available'));
            }
        });
    };

    fetchData()
        .then(books => {
            res.json(books); // Send the books as the response
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            res.status(500).json({ message: 'Error fetching books' });
        });
});
  
  
  // Get book details based on ISBN
  
  public_users.get('/isbn/:isbn',function (req, res) {
    const fetchData = () => {
        return new Promise((resolve, reject) => {
            let isbn = req.params.isbn
            if (books) {
                resolve(books[isbn]);
            } else {
                reject(new Error('No books data available'));
            }
        });
    };
    fetchData()
        .then(books => {
            res.json(books); // Send the books as the response
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            res.status(500).json({ message: 'Error fetching books' });
        });
   });



  

// Get book details based on author

public_users.get('/author/:author', function (req, res) {
    let author = req.params.author;
    let booksByAuthor = [];

    // Iterate through the books object and find books by the specified author
    for (let ISBN in books) {
        if (books[ISBN].author === author) {
          booksByAuthor.push(books[ISBN]);
        }
      }
    if (booksByAuthor.length === 0) {
      return res.status(404).json({ message: "No books found by the specified author." });
    }

  

    return res.json(booksByAuthor);

  });

  



// Get all books based on title

public_users.get('/title/:title',function (req, res) {

let title = req.params.title;

let booksByTitle= [];

for (let ISBN in books) 

if (books[ISBN].title === title) {

    booksByTitle.push(books[ISBN]);

  }

  if (booksByTitle.length === 0) {

    return res.status(404).json({ message: "No books found by the specified author." });

  }

return res.json(booksByTitle);

});



//  Get book review

public_users.get('/review/:isbn', function (req, res) {

    let ISBN = req.params.isbn;

    

    if (books.hasOwnProperty(ISBN)) {

      let bookReviews = books[ISBN].reviews;

      return res.json(bookReviews);

    } else {

      return res.status(404).json({ message: "Book with the specified ISBN not found." });

    }

  });

  



module.exports.general = public_users;
