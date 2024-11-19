// personal access token
const mongoose = require('mongoose');
const PatSchema = new mongoose.Schema({
	userId:{
		type:mongoose.Types.ObjectId,
		ref:"User",
		required:true
	},
	accessToken:{
		type:String,
		required:true
	},
	refreshToken:{
		type:String,
		required:true
	}
},{
	timestamps:true,
	autoIndex:true,
	autoCreate:true
});



const PatModel = mongoose.model("PAT",PatSchema)
module.exports = PatModel;