// Import required modules
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// In-memory storage for books
let books = require("./data.json");


// GET: Root Endpoint
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Library Management System API");
});

// POST: Create a New Book
app.post("/books", (req, res) => {
  try {
    const { book_id, title, author, genre, year, copies } = req.body;

    // Input validation
    if (!book_id || !title || !author || !genre || !year || !copies) {
      return res.status(400).json({ error: "All book attributes are required." });
    }

    // Check if book_id is unique
    const existingBook = books.find((book) => book.book_id === book_id);
    if (existingBook) {
      return res.status(400).json({ error: "Book with this ID already exists." });
    }

    // Add the book to the collection
    const newBook = { book_id, title, author, genre, year, copies };
    books.push(newBook);

    res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET: Retrieve All Books
app.get("/books", (req, res) => {
  res.status(200).json(books);
});

// GET: Retrieve a Specific Book by ID
app.get("/books/:id", (req, res) => {
  try {
    const { id } = req.params;
    const book = books.find((book) => book.book_id === id);

    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    res.status(200).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT: Update Book Information
app.put("/books/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, year, copies } = req.body;

    // Find the book
    const book = books.find((book) => book.book_id === id);
    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    // Update book attributes if provided
    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (year) book.year = year;
    if (copies) book.copies = copies;

    res.status(200).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE: Remove a Book by ID
app.delete("/books/:id", (req, res) => {
  try {
    const { id } = req.params;

    // Find the book index
    const bookIndex = books.findIndex((book) => book.book_id === id);
    if (bookIndex === -1) {
      return res.status(404).json({ error: "Book not found." });
    }

    // Remove the book
    books.splice(bookIndex, 1);

    res.status(200).json({ message: "Book deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});