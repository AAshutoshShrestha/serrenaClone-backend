const Joi = require("joi");

const MenuCreateDTO = Joi.object({
	name: Joi.string().min(2).required(),
	urlPath: Joi.string(),
	status: Joi.string()
		.regex(/^(live|inactive)$/)
		.required(),
});

module.exports = {
	MenuCreateDTO,
};

