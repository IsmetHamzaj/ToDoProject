const express = require("express");
const app = express();
const db = require("./database");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");
const viewRoutes = require("./routes/viewRoutes");
const { protect } = require("./controllers/authController");

require("dotenv").config();

// app.use((req, res, next) => {
//   console.log(req.headers);
//   next();
// });
app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

db.sync();

app.use(cookieParser());

app.use((req, res, next) => {
  console.log("Cookie:", req.cookies.jwt);
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/todo", protect, todoRoutes);

app.use("/", viewRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
