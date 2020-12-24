const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const { Schema } = mongoose

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		match: /@/,
		index: {
			unique: true,
		},
		trim: true,
	},
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 6,
	},
	local: {
		firstName: {
			type: String,
			trim: true,
			minlength: 3,
		},
		lastName: {
			type: String,
			trim: true,
			minlength: 3,
		},
		password: {
			type: String,
			trim: true,
			minlength: 6,
		},
	},
	providers: [String],
	articles: [
		{
			type: Schema.Types.ObjectId,
		},
	],
	comments: [
		{
			type: Schema.Types.ObjectId,
		},
	],
});

userSchema.pre("save", function (next) {
  if(!this.local.password) next()
  bcrypt.hash(this.local.password, 12, (err, hash) => {
    if (err) next(err)
    this.local.password = hash
    next()
  })
})

userSchema.methods.verifyPassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model("User", userSchema)