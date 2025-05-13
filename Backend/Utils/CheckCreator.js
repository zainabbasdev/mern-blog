const blog = require("../Models/Blog.schema.js");

let CheckCreator = async (req, res, next) => {
  let { id } = req.params;

  blog
    .findById(id)
    .then(data => {
      data.author.toString() === req.body.signedInUser.id
        ? next()
        : res.status(403).json({ Message: "You Are Not Authorized" });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

module.exports = CheckCreator;
