const validate = require("../../middleware/validator");
const Joi = require("joi")

module.exports = {

    create: validate({
        body: Joi.object({
            title: Joi.string().required(),
            body: Joi.string().required(),
            long: Joi.number().required(),
            lat: Joi.number().required(),
        })
    }),

    get: validate({
        query: Joi.object({
            page: Joi.number().default(1),
            limit: Joi.number().default(10),
            sortBy: Joi.string().default("createdAt"),
            sortOrder: Joi.string().default("-1"),
            search: Joi.string(),
            long: Joi.number(),
            lat: Joi.number(),
            distance: Joi.number(),
        })
    }),

    update: validate({
        body: Joi.object({
            title: Joi.string(),
            body: Joi.string(),
        }),
        params: Joi.object({
            _id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid Id")
                .required()
        })
    }),

    delete: validate({
        params: Joi.object({
            _id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid Id")
                .required()
        })
    }),

}