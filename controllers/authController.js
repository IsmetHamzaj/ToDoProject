const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("./../models/UserModel");
const { sendEmail } = require("./../utils/nodemailer");
require("dotenv").config();

const signToken = (id, res) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true,
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  return token;
};

const signup = (req, res) => {
  User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  })
    .then((user) => {
      const token = signToken(user.id, res);

      res.status(201).json({
        status: "success",
        data: user,
        token: token,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

const login = (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      status: "failed",
      message: "Please provide email & password",
    });
  }

  const user = User.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (user) {
        if (bcrypt.compareSync(password, user.passwordConfirm)) {
          const token = signToken(user.id, res);
          req.user = user;

          return res.status(201).json({
            status: "success",
            token: token,
          });
        } else {
          return res.status(400).json({
            status: "failed",
            message: "Email or password is invalid",
          });
        }
      }
      return res.status(400).json({
        status: "failed",
        message: "This user doesn't exist",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        status: "failed",
        message: "This user doesn't exist",
      });
    });
};

const forgotPassword = async (req, res) => {
  const resetToken = crypto.randomBytes(32).toString("hex");

  let foundUser = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (!foundUser) {
    res.status(400).json({
      status: "failed",
      message: "No user found with this email address",
    });
  }

  const cryptoToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  let expireDate = new Date();
  expireDate.setHours(expireDate.getHours() + 2);

  console.log(expireDate);

  const url = `${req.protocol}://${req.hostname}:3000/user/forgotPassword/${cryptoToken}`;
  console.log(url);

  const options = {
    email: foundUser.email,
    title: "Your Reset Token",
    text: url,
  };

  sendEmail(options);

  foundUser
    .update({
      forgotToken: cryptoToken,
      forgotExpireDate: expireDate,
    })
    .then((user) => {
      res.status(200).json({
        status: "success",
        message: "Please check your email",
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

const resetPassword = async (req, res) => {
  const token = req.params.token;

  console.log(token);

  const user = await User.findOne({
    where: {
      forgotToken: token,
      // forgotExpireDate: {
      //   $gte: new Date().toLocaleString(),
      // },
    },
  });

  if (!user) {
    return res.status(200).json({
      status: "success",
      message: "Invalid token",
    });
  }

  user
    .update({
      forgotToken: null,
      forgotExpireDate: null,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    })
    .then((user) => {
      res.status(200).json({
        status: "success",
        data: user,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: "failed",
        message: err.message,
      });
    });
};

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization;
    console.log(token);
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401).json({
      status: "unathorized",
      message: "You're not logged in ! Please login in to view this page",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
  } catch (err) {
    res.status(401).json({
      status: "success",
      message: "Invalid Token",
    });
  }

  console.log(req.user);
  next();
};

const isLoggedIn = async (req, res, next) => {
  if (!req.cookies.jwt) {
    return res.render("login");
  }

  if (req.cookies.jwt) {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    req.user = decoded.id;
  }

  const foundUser = await User.findOne({
    where: {
      id: req.user,
    },
  });

  res.locals.user = foundUser;
  next();
};

const logout = (req, res) => {
  res.cookie("jwt", "loggedout");

  return res.status(200).json({
    status: "success",
    message: "Logged out",
  });
};

module.exports = {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  isLoggedIn,
  logout,
};
