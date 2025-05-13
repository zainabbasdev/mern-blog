const blog = require("../Models/Blog.schema.js");

let CheckDisabledBlog = async (req, res, next) => {
  blog
    .findById(req.params.id)
    .then(data => {
      data.disabled ? res.status(404).send("Blog is disabled") : next();
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

module.exports = CheckDisabledBlog;
