const jwt = require("jsonwebtoken");
const user = require("../Models/User.schema");

let AuthenticateUser = async (req, res, next) => {
  let token = req.headers.token;

  try {
    let { id, username, email } = await jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    user
      .findById(id)
      .then(data => {
        if (data.blocked)
          res.status(403).json({ Message: "Your account is blocked" });
        else {
          if (id && username && email) {
            req.body.signedInUser = {};
            req.body.signedInUser.id = id;
            req.body.signedInUser.username = username;
            req.body.signedInUser.email = email;
            next();
          } else {
            res.status(404).json({ Message: "Your Are Not Authenticated" });
          }
        }
      })
      .catch(err => res.status(500).send(err));
  } catch (err) {
    res.status(404).json({ Message: "Your Are Not Authenticated", err });
  }
};

module.exports = AuthenticateUser;
