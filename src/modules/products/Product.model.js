
const mongoose = require('mongoose');
const { GeneralStatus, seoSchema } = require('../../config/constants');

const ProductSchema = new mongoose.Schema({
	name : {
		type: String,
		min : 2,
		Max: 50,
		required :true,
		unique:true
	},

	slug: {
		type: String,
		unique:true,
		required : true
	},

	image : String,
	description : String,
	price : Number,
	stock : Number,
	
	shopLink: {
		type: String,
		unique:true,
		required : true
	},
	
	seo: seoSchema,

	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref:"Category",
		default: null,
		required: false,
		nullable: true
	},

	status: {
		type: String,
		enum : [...Object.values(GeneralStatus)],
		default : GeneralStatus.INACTIVE
	},

	createdBy : {
		type: mongoose.Types.ObjectId,
		ref:"User",
		default : null
	}

},{
	timestamps: true,
	autoCreate: true,
	autoIndex: true
})

const ProductModel =mongoose.model("Product",ProductSchema)
module.exports = ProductModel