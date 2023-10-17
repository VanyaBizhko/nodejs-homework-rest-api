const Joi = require("joi");


const addShcema = Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'Name is required. Please provide a name.',
    'string.empty': 'Name is required. Please provide a name.',
  }),
    email: Joi.string().required().messages({
    'string.email': 'Invalid email format. Please provide a valid email address.',
    'any.required': 'Email is required. Please provide an email address.',
  }),
    phone: Joi.string().required().messages({
    'any.required': 'Phone number is required. Please provide a phone number.',
  }),favorite: Joi.boolean()
});
module.exports = {
  addShcema,
}