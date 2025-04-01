const express = require("express");
const bookRouter = express.Router();
const {
  getBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
  addReview,
  getReview,
  updateReview,
  deleteReview
} = require("../controllers/Book.controller.js");

const isLoggedIn = require("../middlewares/authJwt.js");

console.log(isLoggedIn.verifyToken);

bookRouter.get("", [isLoggedIn.verifyToken, getBooks]);
bookRouter.post("/create", [isLoggedIn.verifyToken, createBook]);
bookRouter.get("/book/:id", [isLoggedIn.verifyToken, getBookById]);
bookRouter.put("/:id", [isLoggedIn.verifyToken, updateBook]);
bookRouter.delete("/:id", [isLoggedIn.verifyToken, deleteBook]);


bookRouter.post("/:bookId/review", [isLoggedIn.verifyToken, addReview]);
bookRouter.get("/:bookId/review", [isLoggedIn.verifyToken, getReview]);
bookRouter.put("/:bookId/review/:reviewId", [isLoggedIn.verifyToken, updateReview]);
bookRouter.delete("/:bookId/review/:reviewId", [isLoggedIn.verifyToken, deleteReview]);


module.exports = bookRouter;
