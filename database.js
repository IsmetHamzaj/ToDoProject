const Sequelize = require("sequelize");
require("dotenv").config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, "", {
  host: process.env.DB_HOST,
  dialect: "mysql",
});

db.authenticate()
  .then(() => {
    console.log("Connection succes DB");
  })
  .catch((err) => {
    console.log("Can't connect to the DB");
  });

module.exports = db;
