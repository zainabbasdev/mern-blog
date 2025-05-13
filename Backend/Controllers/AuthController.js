const user = require("../Models/User.schema.js");
const jwt = require("jsonwebtoken");

let register = async (req, res) => {
  let { username, email, password } = req.body;
  user
    .create({ username, email, password })
    .then(data => {
      res.status(200).json({ Message: "User Created", data: data });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

let login = async (req, res) => {
  let { email, password } = req.body;
  user
    .findOne({ email, password })
    .then(data => {
      if (data) {
        let token = jwt.sign(
          {
            id: data._id,
            username: data.username,
            email: data.email,
          },
          process.env.JWT_SECRET
          //{ expiresIn: "1h" }
        );
        res
          .status(200)
          .json({ Message: "Login Success", token: token, userId: data._id });
      } else {
        res.status(404).json({ Message: "User Not Found" });
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

module.exports = { register, login };
