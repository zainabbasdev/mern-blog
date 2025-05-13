const user = require("../Models/User.schema.js");

let CheckAdmin = async (req, res, next) => {
  user
    .findById(req.body.signedInUser.id)
    .then(data => {
      data.isAdmin
        ? next()
        : res.status(403).json({ Message: "You Are Not Authorized" });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

module.exports = CheckAdmin;
