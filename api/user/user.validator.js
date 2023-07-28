const validate = require("../../middleware/validator");
const Joi = require("joi")

module.exports = {

    signup: validate({
        body: Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            age: Joi.number().required(),
            password: Joi.string().required(),
            roleId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid Id")
                .required()
        })
    }),

    login: validate({
        body: Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
        })
    }),

    get: validate({
        query: Joi.object({
            page: Joi.number().default(1),
            limit: Joi.number().default(10),
            sortBy: Joi.string().default("createdAt"),
            sortOrder: Joi.string().default("-1"),
            search: Joi.string(),
            _id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid Id"),
        })
    })

}