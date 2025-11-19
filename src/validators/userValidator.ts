import Joi from "joi";

export const validateUser = Joi.object({
  name: Joi.string().alphanum().min(5).max(30).required(),
});
