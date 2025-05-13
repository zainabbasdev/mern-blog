const {
  getAllBlogs,
  createBlog,
  viewBlog,
  updateBlog,
  deleteBlog,
  comment,
  rate,
} = require("../Controllers/BlogController.js");
const AuthenticateUser = require("../Utils/Authenticate.js");
const CheckCreator = require("../Utils/CheckCreator.js");
const CheckDisabledBlog = require("../Utils/CheckDisabledBlog.js");

const express = require("express");

const router = express.Router();

router.get("/", getAllBlogs);

router.post("/", AuthenticateUser, createBlog);
router.get("/:id", CheckDisabledBlog, viewBlog);
router.put("/:id", AuthenticateUser, CheckCreator, updateBlog);
router.delete("/:id", AuthenticateUser, CheckCreator, deleteBlog);

router.post("/:id/comment", AuthenticateUser, CheckDisabledBlog, comment);
router.post("/:id/rate", AuthenticateUser, CheckDisabledBlog, rate);

module.exports = router;
