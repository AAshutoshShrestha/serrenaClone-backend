const mongoose = require('mongoose');
const { GeneralStatus, UserTypes, UserProvider } = require('../../config/constants');


const AddressSchema = new mongoose.Schema({
	address: String,
})
const UserSchema = new mongoose.Schema({
	name : {
		type: String,
		min: 2,
		max: 50,
		required: true
	},
	email:{
		type: String,
		required: true,
		unique: true
	},
	password:{
		type:String,
		required: true
	},

	address: {
		PermanentAddress:AddressSchema,
		TemporaryAddress:AddressSchema
	},

	role: {
        type: String, 
        enum: [...Object.values(UserTypes)],
        default: UserTypes.CUSTOMER
    },
	status:{
		type : String,
		enum : [...Object.values(GeneralStatus)],
		default : GeneralStatus.INACTIVE
	},
	phone: [String],
	userprovider :{
		type: String,
		enum : [...Object.values(UserProvider)],
		default: UserProvider.CUSTOM

	},
	userproviderID : String,
	activationToken: String,
	activeFor : Date,
	ForgetToken: String,
	ForgetFor : Date,

	createdBy : {
		type: mongoose.Schema.Types.ObjectId,
		ref:"User",
		default : null
	}

},{
	timestamps: true,
	autoCreate:true,
	autoIndex:true
})





// Model name ==> Singular form
// collection name ==> plural form of model
const UserModel =mongoose.model("User",UserSchema,)
module.exports = UserModel