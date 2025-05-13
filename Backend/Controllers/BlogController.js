const blog = require("../Models/Blog.schema.js");
const user = require("../Models/User.schema.js");

let getAllBlogs = async (req, res) => {
  // Pagination
  const page = req.query.page || 1;
  const limit = 9;

  // Sorting
  let sort = req.query.sort || "createdAt";
  sort = req.query.sort ? req.query.sort.split(",") : [sort];
  let sortOrder = {};
  sortOrder[sort[0]] = sort[1] ? sort[1] : "asc";

  // Search & Filtering
  let searchQuery = { disabled: false };
  if (req.query.keywords) {
    searchQuery.keywords = { $in: req.query.keywords.split(",") };
  }
  if (req.query.categories) {
    searchQuery.categories = { $in: req.query.categories.split(",") };
  }
  if (req.query.author) {
    searchQuery.author = req.query.author;
  }
  if (req.query.title) {
    searchQuery.title = { $regex: new RegExp(req.query.title, "i") };
  }

  blog
    .find(searchQuery)
    .populate("author", "username")
    .sort(sortOrder)
    .skip((page - 1) * limit)
    .limit(limit)
    .then(data => {
      data = data.map(doc => doc.toObject({ virtuals: true }));
      res.status(200).json({ Message: "Blogs Found", data: data });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

let createBlog = async (req, res) => {
  let { title, content, keywords, categories } = req.body;
  blog
    .create({
      title,
      content,
      keywords,
      categories,
      author: req.body.signedInUser.id,
    })
    .then(data => {
      res.status(200).json({ Message: "Blog Created", data: data });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

let viewBlog = async (req, res) => {
  let { id } = req.params;
  blog
    .findById(id)
    .populate("comments.userId", "username")
    .then(data => {
      res.status(200).json({ Message: "Blog Found", data: data });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

let updateBlog = async (req, res) => {
  let { id } = req.params;
  let { title, content, keywords, categories } = req.body;

  blog
    .updateOne({ _id: id }, { $set: { title, content, keywords, categories } })
    .then(data => {
      res.status(200).json({ Message: "Blog Updated" });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

let deleteBlog = async (req, res) => {
  let { id } = req.params;

  blog
    .findOneAndDelete({ _id: id })
    .then(data => {
      res.status(200).json({ Message: "Blog Deleted" });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

let comment = async (req, res) => {
  let { id } = req.params;
  let { comment } = req.body;
  let userId = req.body.signedInUser.id;

  blog
    .findById(id)
    .then(data => {
      data.comments.push({ userId, comment });
      user.findById(data.author.toString()).then(dataa => {
        dataa.notifications.push(
          `${req.body.signedInUser.username} commented on your blog - ${data.title}`
        );
        return dataa.save();
      });
      return data.save();
    })
    .then(() => {
      res.status(200).json({ Message: "Comment Added" });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

let rate = async (req, res) => {
  let { id } = req.params;
  let { rating } = req.body;
  let userId = req.body.signedInUser.id;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ Message: "Rating must be between 1 and 5" });
  }

  blog
    .findById(id)
    .then(data => {
      let userRating = data.ratings.find(r => r.userId.toString() === userId);
      if (userRating) {
        return res
          .status(400)
          .json({ Message: "You have already rated this blog" });
      }

      data.ratings.push({ userId, rating });
      return data.save();
    })
    .then(() => {
      res.status(200).json({ Message: "Rating Added" });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

module.exports = {
  getAllBlogs,
  createBlog,
  viewBlog,
  updateBlog,
  deleteBlog,
  comment,
  rate,
};
