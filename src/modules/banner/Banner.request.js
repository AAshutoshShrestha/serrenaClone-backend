const Joi = require('joi');

// form data rules
const BannerCreateDTO = Joi.object({
	name: Joi.string()
		.min(2)
		.max(50)
		.required(),
	
	status: Joi.string()
		.regex(/^(active|inactive)/)		//validate 
		.required(),
		
	image: Joi.string()
		.required(),
		
	heading: Joi.string()
		.required(),

	link: Joi.string()
		.uri()


})

module.exports = {BannerCreateDTO}