const user = require("../Models/User.schema.js");
const blog = require("../Models/Blog.schema.js");

let viewProfile = async (req, res) => {
  let { id } = req.params;
  user
    .findById(id)
    .then(data => {
      res.status(200).json({ Message: "User Found", data: data });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

let updateProfile = async (req, res) => {
  let { id } = req.params;
  if (id === req.body.signedInUser.id) {
    let { username, email, password } = req.body;
    user
      .findOneAndUpdate(
        { _id: id },
        { $set: { username, email, password } },
        { new: true }
      )
      .then(data => {
        res.status(200).json({ Message: "Profile Updated", data: data });
      })
      .catch(err => {
        res.status(500).send(err);
      });
  } else {
    res.status(403).json({ Message: "You Are Not Authorized" });
  }
};

let feed = async (req, res) => {
  const userr = await user.findById(req.body.signedInUser.id);

  // Pagination
  const page = req.query.page || 1;
  const limit = 9;

  // Sorting
  let sort = req.query.sort || "createdAt";
  sort = req.query.sort ? req.query.sort.split(",") : [sort];
  let sortOrder = {};
  sortOrder[sort[0]] = sort[1] ? sort[1] : "asc";

  // Search & Filtering
  let searchQuery = { author: { $in: userr.following }, disabled: false };
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

let follow = async (req, res) => {
  let { id } = req.params;
  let { signedInUser } = req.body;
  if (id === signedInUser.id) {
    res.status(403).json({ Message: "You Cannot Follow Yourself" });
  } else {
    user
      .findOne({ _id: signedInUser.id, following: { $in: [id] } })
      .then(data => {
        if (data) {
          res.status(400).json({ Message: "Already Followed" });
        } else {
          user
            .updateOne(
              { _id: id },
              {
                $push: {
                  followers: signedInUser.id,
                  notifications: `${signedInUser.username} started following you`,
                },
              }
            )
            .then(data => {
              user
                .updateOne(
                  { _id: signedInUser.id },
                  { $push: { following: id } }
                )
                .then(data => {
                  res.status(200).json({ Message: "Followed" });
                })
                .catch(err => {
                  res.status(500).send(err);
                });
            })
            .catch(err => {
              res.status(500).send(err);
            });
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
  }
};

let unfollow = async (req, res) => {
  let { id } = req.params;
  let { signedInUser } = req.body;
  if (id === signedInUser.id) {
    res.status(403).json({ Message: "You Cannot Unfollow Yourself" });
  } else {
    user
      .findOne({ _id: signedInUser.id, following: { $in: [id] } })
      .then(data => {
        if (data) {
          user
            .updateOne(
              { _id: id },
              {
                $pull: {
                  followers: signedInUser.id,
                },
                $push: {
                  notifications: `${signedInUser.username} stopped following you`,
                },
              }
            )
            .then(data => {
              user
                .updateOne(
                  { _id: signedInUser.id },
                  { $pull: { following: id } }
                )
                .then(data => {
                  res.status(200).json({ Message: "Unfollowed" });
                })
                .catch(err => {
                  res.status(500).send(err);
                });
            })
            .catch(err => {
              res.status(500).send(err);
            });
        } else {
          res.status(400).json({ Message: "Not Followed" });
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
  }
};

let viewNotifications = async (req, res) => {
  let { id } = req.params;
  user
    .findById(id)
    .then(data => {
      res.status(200).json({
        Message: "Notifications Found",
        data: data.notifications.reverse(),
      });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

module.exports = {
  viewProfile,
  updateProfile,
  feed,
  follow,
  unfollow,
  viewNotifications,
};
