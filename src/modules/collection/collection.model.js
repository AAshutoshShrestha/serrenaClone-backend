const mongoose = require('mongoose');
const { GeneralStatus, seoSchema } = require('../../config/constants');

const CollectionSchema = new mongoose.Schema({
	name : {
		type: String,
		min : 2,
		Max: 50,
		required :true,
		unique: true
	},
	slug: {
		type: String,
		unique:true,
		required : true
	},
	
	status: {
		type: String,
		enum : [...Object.values(GeneralStatus)],
		default : GeneralStatus.INACTIVE
	},
	
	seo: seoSchema,

	parent_collection: {
		type: mongoose.Schema.Types.ObjectId,
		ref:"Collection",
		default: null,
		required: false,
		nullable: true
	},

	image : {
		type: String,
		required : false
	},
	createdBy : {
		type: mongoose.Schema.Types.ObjectId,
		ref:"User",
		default : null
	}

},{
	timestamps: true,
	autoCreate: true,
	autoIndex: true
})

const CollectionModel =mongoose.model("Collection",CollectionSchema)
module.exports = CollectionModel