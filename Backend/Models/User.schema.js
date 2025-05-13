const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, required: true, default: false },
    password: { type: String, required: true },
    blocked: { type: Boolean, required: true, default: false },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    notifications: [{ type: String }],
  },
  { timestamps: true }
);

const model = mongoose.model("User", userSchema);
module.exports = model;
