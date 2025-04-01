const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

const errorHandler = require("./middlewares/error.middleware.js");
const bookRouter = require("./routes/Book.route.js");
const userRouter = require("./routes/User.route.js");
const Connection = require("./config/db.js");

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
Connection();

app.use("/api/v1/books", bookRouter);
app.use("/api/v1", userRouter);


app.get("/", (req, res) => {
  res.send("Server is Running!");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})


app.use(errorHandler);

module.exports = app;
