const Book = require("../models/Book.model.js");
const User = require("../models/User.model.js");
const Review = require("../models/Review.model.js")

const asyncHandler = require("../middlewares/asyncHandler.middleware.js");


const createBook = asyncHandler(async (req, res, next) => {
  try {
    console.log("User: ")
    const userId = req.userId;
    console.log("User: ", userId)
    const user = await User.findById(userId);
    console.log("User: ", user)

    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }

    const { title, excerpt, isbn, category, subcategory, releasedAt } = req.body;

    const newBook = new Book({
      title: title,
      userId: userId,
      excerpt: excerpt,
      ISBN: isbn,
      category: category,
      subcategory: subcategory,
      releasedAt: releasedAt,
      reviews: 0,
      deleted: false,
      deletedAt: ""
    });

    console.log("New book: ", newBook)

    const savedBook = await newBook.save();
    res.status(201).json({
      status: 201,
      message: "Book created successfully",
      book: savedBook,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
});


const getBookById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findById(id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const review = {};
  res.status(200).json({
    status: 201,
    message: "Book retrieved successfully",
    book,
    review
  });
});

const updateBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const existingBook = await Book.findOne({ _id: id, isDeleted: false });
  if (!existingBook) {
    return res.status(404).json({
      error: 'Book not found or has been deleted'
    });
  }

  const title = req?.body?.title;
  const ISBN = req?.body?.ISBN;

  if (title && title !== existingBook.title) {
    const duplicate = await Book.findOne({ title });
    if (duplicate) {
      return res.status(400).json({
        error: 'Title must be unique'
      });
    }
  }

  if (ISBN && ISBN !== existingBook.ISBN) {
    const duplicate = await Book.findOne({ ISBN });
    if (duplicate) {
      return res.status(400).json({
        error: 'ISBN must be unique'
      });
    }
  }

  const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedBook) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.status(200).json({
    status: 201,
    message: "Book updated successfully",
    book: updatedBook,
  });
});


const deleteBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const existingBook = await Book.findOne({ _id: id });
  if (!existingBook) {
    return res.status(404).json({
      error: 'Book not found or has been deleted'
    });
  }

  const updatedBook = await Book.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, {
    new: true,
  });

  if (!updatedBook) {
    return res.status(404).json({ error: "Book not deleted" });
  }
  res.status(200).json({
    status: 201,
    message: "Book deleted successfully",
  });
});



const getBooks = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }

    const books = await Book.find()

    return res.status(201).json({
      message: "Books fetched successfully",
      books: books
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
});


const addReview = asyncHandler(async (req, res, next) => {
  try {

    const userId = req.userId;
    const user = await User.findById(userId);
    const { bookId } = req.params;
    const { review, rating } = req.body;

    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }

    const newReview = new Review({
      bookId: bookId,
      reviewedBy: user.name,
      rating: req.body.rating,
      review: req.body.review,
      isDeleted: false,
    });

    console.log("New review: ", newReview)

    await newReview.save();

    console.log("Req: ", req.body)

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    if (!review || review == null) {
      return res.status(403).send({ status: 403, message: "Provide reivew", res });
    }

    if (!rating || rating == null) {
      return res.status(403).send({ status: 403, message: "Provide rating", res });
    }

    book.reviews += 1;
    await book.save();

    return res.status(201).json({
      message: "Review added successfully",
      review: newReview
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
});


const getReview = asyncHandler(async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);

    return res.status(200).json({
      message: "Book review fetched",
      review: book.reviews
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
});


const updateReview = asyncHandler(async (req, res, next) => {
  try {
    const { bookId, reviewId } = req.params;
    const { rating, review, reviewedBy } = req.body;

    console.log("Req body: ", req.body)
    console.log("Review id: ", reviewId)

    const reviewDoc = await Review.findById(reviewId);

    console.log("Review doc: ", reviewDoc)

    reviewDoc.review = review;
    reviewDoc.rating = rating;
    reviewDoc.reviewedBy = reviewedBy || reviewDoc.reviewedBy;

    await reviewDoc.save();

    return res.status(200).json({
      message: "Review updated successfully",
      review: reviewDoc
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
});


const deleteReview = asyncHandler(async (req, res, next) => {

  try {
    const { bookId, reviewId } = req.params;

    const book = await Book.findById(bookId);
    if (!book || book.isDeleted) {
      return res.status(404).json({ message: "Book not found or is deleted." });
    }

    const reviewDoc = await Review.findById(reviewId);
    if (!reviewDoc || reviewDoc.isDeleted) {
      return res.status(404).json({ message: "Review not found or is deleted." });
    }

    if (!reviewDoc.bookId.equals(bookId)) {
      return res.status(400).json({ message: "Review does not belong to this book." });
    }

    reviewDoc.isDeleted = true;
    await reviewDoc.save();

    book.reviews -= 1;
    await book.save();

    return res.status(200).json({
      message: "Review deleted successfully.",
      updatedBook: book
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
});



module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  addReview,
  getReview,
  updateReview,
  deleteReview
};
