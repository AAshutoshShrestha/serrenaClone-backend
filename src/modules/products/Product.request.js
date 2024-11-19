const Joi = require("joi");

// form data rules
const ProductCreateDTO = Joi.object({
	name: Joi.string()
		.regex(/^[a-zA-Z ]+$/)
		.min(2)
		.max(50)
		.required()
		.messages({
			"string.empty": "Product Name is compulsary",
			"string.pattern.base": "Product name can only contain alphabet and space",
			"string.min": "Product name should contain at list 2 character",
		}),

	seo: Joi.object().optional(),

	isFeatured: Joi.boolean().default(false),


	status: Joi.string()
		.regex(/^(active|inactive)/) //validate
		.required()
		.messages({
			"string.pattern.base": "Product Status can only be active or inactive",
		}),

	description: Joi.string().required(),
	price: Joi.number().required(),
	stock: Joi.number().required(),
	image: Joi.string().optional(),
	brand: Joi.string().required(),
	shopLink: Joi.string().required(),
	category: Joi.string().required(),
	
});

module.exports = { ProductCreateDTO };
