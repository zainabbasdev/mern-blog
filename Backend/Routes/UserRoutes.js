const {
  viewProfile,
  updateProfile,
  feed,
  follow,
  unfollow,
  viewNotifications,
} = require("../Controllers/UserController.js");
const AuthenticateUser = require("../Utils/Authenticate.js");
const CheckBlockedUser = require("../Utils/CheckBlockedUser.js");

const express = require("express");

const router = express.Router();

router.get("/:id", CheckBlockedUser, viewProfile);
router.put("/:id", AuthenticateUser, updateProfile);

router.get("/:id/feed", AuthenticateUser, feed);

router.post("/:id/follow", AuthenticateUser, CheckBlockedUser, follow);
router.post("/:id/unfollow", AuthenticateUser, CheckBlockedUser, unfollow);

router.get("/:id/notifications", AuthenticateUser, viewNotifications);

module.exports = router;
