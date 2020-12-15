const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			minlength: 50,
		},
		featureImage: {
			fieldname: String,
			originalname: String,
			encoding: String,
			mimetype: String,
			destination: String,
			filename: String,
			path: String,
      size: Number,
      base64: String
		},
		comments: [{
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Comment"
		}],
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User"
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);