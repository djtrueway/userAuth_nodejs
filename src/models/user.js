const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const User = sequelize.define("User", {
  name: DataTypes.STRING,
  email: {
    // needs to be unique
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: DataTypes.STRING,
});

module.exports = {
  User,
};
