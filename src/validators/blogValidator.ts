import Joi from "joi";

export const validateBlog = Joi.object({
    title : Joi.string().min(5).max(30).required(),
    description: Joi.string().min(20).max(100).required(),
    author_id: Joi.number().required()
});


export const validateSearch = Joi.object({
    search: Joi.string().max(10)
})

