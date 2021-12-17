const Sequelize = require("sequelize");
const db = require("../database");
const UserModel = require("./UserModel");

const Todo = db.define("todo", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

UserModel.hasMany(Todo);
Todo.belongsTo(UserModel);

module.exports = Todo;
