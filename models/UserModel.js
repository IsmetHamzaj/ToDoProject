const Sequelize = require("sequelize");
const db = require("./../database");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = db.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  photo: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  password: {
    type: Sequelize.VIRTUAL,
    allowNull: false,
    validate: {
      notNull: {
        msg: "A password is required",
      },
      notEmpty: {
        msg: "Please provide a password",
      },
      len: {
        args: [8, 20],
        msg: "Password should be between 8 and 20 characters",
      },
    },
  },
  passwordConfirm: {
    type: Sequelize.STRING,
    allowNull: false,
    set(value) {
      if (value === this.password) {
        const hashedPassword = bcrypt.hashSync(value, 10);
        this.setDataValue("passwordConfirm", hashedPassword);
      }
    },
    validate: {
      notNull: {
        msg: "Both passwords must match",
      },
    },
  },
  forgotToken: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  forgotExpireDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});

// User.prototype.createPasswordResetToken = function () {
//   const cryptoToken = crypto.randomBytes(64).toString("base64");
//   const expireDate = new Date(new Date().getTime() + 120 * 60 * 1000);

// };

module.exports = User;
