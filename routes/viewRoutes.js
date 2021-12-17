const express = require("express");
const router = express.Router();
const { getLoginPage } = require("./../controllers/viewController");
const { isLoggedIn } = require("./../controllers/authController");
const axios = require("axios");

router.route("/").get(getLoginPage);

router.route("/todo").get(isLoggedIn, (req, res) => {
  const todos = axios
    .get("http://localhost:3000/api/todo/", {
      headers: {
        Authorization: req.cookies.jwt,
      },
    })
    .then(function (response) {
      res.render("todo", { data: response.data.data });
    })
    .catch(function (error) {
      // handle error
      res.render("todo", { message: "You don't have any todo-s" });
    });
});

module.exports = router;
