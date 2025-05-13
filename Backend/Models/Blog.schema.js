const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    keywords: [{ type: String }],
    categories: [{ type: String }],
    disabled: { type: Boolean, required: true, default: false },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: { type: Number, required: true },
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: { type: String, required: true },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

blogSchema.virtual("averageRating").get(function () {
  if (this.ratings.length > 0) {
    let sum = this.ratings.reduce((total, rating) => total + rating.rating, 0);
    return sum / this.ratings.length;
  } else {
    return 0;
  }
});

blogSchema.post("find", function (docs) {
  for (let doc of docs) {
    if (doc.comments) {
      doc.comments = doc.comments.reverse();
    }
  }
  return docs.reverse();
});

blogSchema.post("findOne", function (doc) {
  if (doc && doc.comments) {
    doc.comments = doc.comments.reverse();
  }
  return doc;
});

const model = mongoose.model("Blog", blogSchema);
module.exports = model;
