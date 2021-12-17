const express = require("express");
const router = express.Router();
const {
  getAllTodos,
  createTodo,
  deleteTodo,
  updateTodo,
  getTodo,
} = require("./../controllers/todoController");
const { protect } = require("./../controllers/authController");

router.route("/").get(getAllTodos).post(protect, createTodo);

router.route("/:id").delete(deleteTodo).patch(protect, updateTodo).get(getTodo);

module.exports = router;
