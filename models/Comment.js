const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    match: /@/,
    required: true
  },
  comment: {
    type: String,
    required: true,
    minlength: 4
  },
  articleId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Article"
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
})

module.exports = mongoose.model("Comment", commentSchema)