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
          try {
            const user = await UserModel.User.create({
              name,
              email,
              password: hash,
            });

            if (!user) {
              res
                .status(400)
                .json({ message: "something wrong on register user!" });
            }

            if (user) {
              // Generate JWT and set as HttpOnly cookie
              const token = generateToken(user);
              res.cookie("authToken", token, { httpOnly: true });
              res.status(201).json(user);
            } else {
              res.status(401).send("Authentication failed");
            }
          } catch (error) {
            res.status(400).json({ message: "" + error });
          }
        }
      });
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
  logout: async (req, res) => {
    res.clearCookie("authToken");
    res.json({ message: "logout with success" });
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
  status: async (req, res) => {
    const authToken = req.cookies.authToken;

    if (!authToken) {
      return res
        .status(401)
        .json({ status: "error", message: "Unauthorized: Token not found" });
    }

    jwt.verify(authToken, secretKey, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized: Invalid token" });
      }

      // At this point, decoded contains the information from the JWT
      // For example, decoded.userId

      // You can use the decoded information to find the user in your database
      // Mocked user data (replace with a database query)
      const user = { id: decoded.userId, username: "user1" };

      res.json({ status: "success", user });
    });
  },
};
