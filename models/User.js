const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const { Schema } = mongoose

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: /@/,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true,
  },
  articles: [{
    type: Schema.Types.ObjectId
  }],
  comments: [{
    type: Schema.Types.ObjectId
  }]
})

userSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 12, (err, hash) => {
    if (err) next(err)
    this.password = hash
    next()
  })
})

userSchema.methods.verifyPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema)