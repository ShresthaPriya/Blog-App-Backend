import Joi from "joi";

export const validateUser = Joi.object({
  name: Joi.string().min(5).max(30).required(),
});
