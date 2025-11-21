import Joi from "joi";

export const validateUser = Joi.object({
  name: Joi.string().min(5).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
  role: Joi.string().required()
});
