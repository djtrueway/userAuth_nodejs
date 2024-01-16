const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const saltRounds = 10; // Number of salt rounds to use (adjust based on your needs)
const secretKey = "yourSecretKey";

const generateToken = (user) => {
  return jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
};

module.exports = {
  register: async (req, res) => {
    const { name, email, password } = req.body;

    if (name && email && password) {
      // Assume userPassword is the password you want to hash
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          // Handle error
        } else {
          // Store 'hash' in your database
          try{
          const user = await UserModel.User.create({
            name,
            email,
            password: hash,
          });
    
          if (!user) {
            res.status(400).json({ message: "something wrong on register user!" });
          }
    
          if (user) {
            // Generate JWT and set as HttpOnly cookie
            const token = generateToken(user);
            res.cookie("authToken", token, { httpOnly: true });
            res.status(201).json(user);
          } else {
            res.status(401).send("Authentication failed");
          }
        }
        catch(error){
          res.status(400).json({"message": ""+error})
        }
      }});
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.User.findOne({
      where: { email },
    });

    if (!user) {
      res.status(400).json({ message: "email is incorrect" });
    }

    if (user) {
      // Assume storedHash is the hash retrieved from your database
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          // Handle error
          res.status(401).send("Authentication failed");
        } else if (result) {
          // Passwords match, proceed with authentication
          // Generate JWT and set as HttpOnly cookie
          const token = generateToken(user);
          res.cookie("authToken", token, { httpOnly: true });
          res.status(200).json(user);
        } else {
          // Passwords do not match, handle accordingly
          res.status(400).json({ message: "password is incorrect" });
        }
      });
    } else {
      res.status(401).send("Authentication failed");
    }
  },
  getAllUser: async (req, res) => {
    try {
      const users = await UserModel.User.findAll();
      // Send response
      res.json(users);
    } catch (error) {
      console.error("Error fetching author:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};
