const mongoose = require('mongoose');
const UserTypes = {
    ADMIN: "admin",
    CLIENT: "client",
}

const GeneralStatus ={
	ACTIVE:'active',
	INACTIVE:'inactive'
}


const UserProvider = {
	CUSTOM :'custom',
	GOOGLE : 'google'
}

const seoSchema = new mongoose.Schema({
    meta_tag: {
        type: [String], // Array of strings for meta tags
        default: []
    },
    meta_keywords: {
        type: [String], // Array of strings for meta keywords
        default: []
    },
    meta_description: {
        type: String, // String for meta description
		default: ""
    }
},{
	_id:false
})

module.exports = {
	UserTypes,
	GeneralStatus,
	UserProvider,
	seoSchema
}
