const Todo = require("./../models/TodoModel");

const getAllTodos = (req, res) => {
  Todo.findAll({
    where: {
      userId: req.user,
    },
  })
    .then((todos) => {
      if (todos.length > 0) {
        res.status(200).json({
          status: "success",
          data: todos,
        });
      } else {
        res.status(400).json({
          status: "success",
          message: "You dont have any todo-s",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

const getTodo = (req, res) => {
  let id = req.params.id;
  Todo.findOne({
    where: {
      id: id,
    },
  })
    .then((todo) => {
      if (todo) {
        res.status(200).json({
          status: "success",
          data: todo,
        });
      } else {
        res.status(400).json({
          status: "failed",
          message: "This todo doesn't exists !",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

const createTodo = (req, res) => {
  Todo.create({
    title: req.body.title,
    description: req.body.description,
    userId: req.user,
  })
    .then((todo) => {
      res.status(200).json({
        status: "success",
        data: todo,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

const deleteTodo = (req, res) => {
  let id = req.params.id;
  Todo.findOne({
    where: {
      id: id,
      userId: req.user,
    },
  })
    .then((todo) => {
      if (todo) {
        res.status(200).json({
          status: "success",
          message: "Todo deleted successfully",
          data: todo,
        });

        todo.destroy();
      } else {
        res.status(400).json({
          status: "failed",
          message: "You cannot delete this todo. You don't have ownership !",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

const updateTodo = (req, res) => {
  let id = req.params.id;
  Todo.findOne({
    where: {
      id: id,
      userId: req.user,
    },
  })
    .then((todo) => {
      if (todo) {
        todo
          .update({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
          })
          .then((item) => {
            res.status(400).json({
              status: "success",
              data: item,
            });
          });
      } else {
        res.status(400).json({
          status: "failed",
          message: "You cannot edit this todo. You dont have ownership !",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

module.exports = { getAllTodos, createTodo, deleteTodo, updateTodo, getTodo };
