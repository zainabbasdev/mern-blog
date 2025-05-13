const user = require("../Models/User.schema.js");

let CheckBlockedUser = async (req, res, next) => {
  user
    .findById(req.params.id)
    .then(data => {
      data.blocked
        ? res.status(404).send("The user you are trying to access is blocked")
        : next();
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

module.exports = CheckBlockedUser;
