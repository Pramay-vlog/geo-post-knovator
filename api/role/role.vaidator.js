const validate = require("../../middleware/validator");
const Joi = require("joi")
const { ROLE } = require("../../json/enums");

module.exports = {

    create: validate({
        body: Joi.object({
            name: Joi.string().valid(...Object.values(ROLE)).required()
        })
    })

}