const Joi = require('joi');

// form data rules
const UserCreateDTO = Joi.object({
	name: Joi.string().regex(/^[a-zA-Z ]+$/)
		.min(2)
		.max(50)
		.required()
		.messages({
			"string.empty": "Name is compulsary",
			"string.pattern.base":"Name can only contain alphabet and space",
			"string.min": "name should contain at list 2 character"
		}),

	email: Joi.string()
		.email()
		.required()
		.messages({
			"string.empty": "Email is compulsary",
		}),

	password: Joi.string()
		.regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,25}$/)
		.min(8)
		.max(25)
		.required()
		.messages({
			"string.pattern.base":"Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-25 characters long.",

		}),

	confirmPassword: Joi.string()
		.equal(Joi.ref('password'))
		.required(),

	address: Joi.string() 
		.empty()
		.optional(),

	phone: Joi.string()
		.min(10)
		.max(15)
		.required(),
	
	image: Joi.string()
		.optional(),

	role: Joi.string()
		.regex(/^(admin|seller|customer)/)		//validate 
		.required()
		.messages({
			"string.pattern.base" : "Role can be admin, seller or customer only"
		})
})

module.exports = {UserCreateDTO}