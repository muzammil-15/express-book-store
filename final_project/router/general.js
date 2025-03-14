const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', async (req, res)=> {
  try {
    const books = await Book.all();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  Book.findOne({ isbn: req.params.isbn })
    .then(book => book ? res.json(book) : res.status(404).json({ message: 'Book not found' }))
    .catch(error => res.status(500).json({ message: error.message }));
 });
  
// Get book details based on author
public_users.get('/books/author/:author', (req, res) => {
  Book.find({ author: req.params.author })
    .then(books => res.json(books))
    .catch(error => res.status(500).json({ message: error.message }));
});

// Get all books based on title
public_users.get('/books/title/:title', (req, res) => {
  Book.find({ title: req.params.title })
    .then(books => res.json(books))
    .catch(error => res.status(500).json({ message: error.message }));
});

//  Get book review
public_users.get('/reviews', authenticate, async (req, res) => {
  try {
    const { bookId, reviewText } = req.body;
    const review = new Review({
      bookId,
      userId: req.userId, // From authentication middleware
      reviewText
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/reviews', authenticate, async (req, res) => {
  try {
    const { bookId, reviewText } = req.body;
    const review = new Review({
      bookId,
      userId: req.userId, // From authentication middleware
      reviewText
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// search by title
app.get('/books', (req, res) => {
  const { title } = req.query;
  if (title) {
    (async () => {
      try {
        const books = await Book.find({ title });
        res.json(books);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    })();
  }
});

// search by author

app.get('/books', (req, res) => {
  const { author } = req.query;
  if (author) {
    (async () => {
      try {
        const books = await Book.find({ author });
        res.json(books);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    })();
  }
});


// search by ISBN using promises

app.get('/books/isbn/:isbn', (req, res) => {
  Book.find({ isbn: req.params.isbn })
    .then(books => {
      if (books.length > 0) res.json(books[0]);
      else res.status(404).json({ message: 'Book not found' });
    })
    .catch(error => res.status(500).json({ message: error.message }));
});

// delete the book reviews 

app.delete('/reviews/:id', authenticate, async (req, res) => {
  try {
    const review = await Review.find({ _id: req.params.id, userId: req.userId });
    if (!review.length) return res.status(404).json({ message: 'Review not found or unauthorized' });
    await Review.deleteOne({ _id: req.params.id });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports.general = public_users;
