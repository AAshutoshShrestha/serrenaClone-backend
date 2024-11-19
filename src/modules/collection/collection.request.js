const Joi = require('joi');


// form data rules
const CollectionCreateDTO = Joi.object({
	name: Joi.string().regex(/^[a-zA-Z ]+$/)
		.min(2)
		.max(50)
		.required()
		.messages({
			"string.empty": "Collection Name is compulsary",
			"string.pattern.base":"Collection name can only contain alphabet and space",
			"string.min": "Collection name should contain at list 2 character"
		}),

	slug: Joi.string()
		.required()
		.messages({
			"string.empty": "slug is compulsary",
		}),

	status: Joi.string()
		.regex(/^(active|inactive)/)		//validate 
		.required()
		.messages({
			"string.pattern.base" : "Collection Status can only be active or inactive"
		}),
	seo:Joi.object().optional(),
	image: Joi.string()
		.optional(),
})

module.exports = {CollectionCreateDTO}