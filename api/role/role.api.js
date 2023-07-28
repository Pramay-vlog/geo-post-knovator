const roleModel = require("../../model/role.model");

module.exports = {

    create: async (req, res) => {
        try {

            // if (!req.body.name) return res.status(400).send({
            //     success: false,
            //     message: "invalid parameters"
            // })

            const roleExists = await roleModel.findOne({ name: req.body.name }).lean()
            if (roleExists) return res.status(400).send({
                success: false,
                message: "dublicate entity"
            })

            return res.status(200).send({
                success: true,
                message: "success",
                data: await roleModel.create(req.body)
            })

        } catch (err) {
            return res.status(500).send({
                success: false,
                message: "Internal server error",
                data: {
                    context: err.message,
                }
            })
        }
    },

    get: async (req, res) => {
        try {

            return res.status(200).send({
                success: true,
                message: "success",
                data: await roleModel.find()
            })

        } catch (err) {
            return res.status(500).send({
                success: false,
                message: "Internal server error",
                data: {
                    context: err.message,
                }
            })
        }
    }

}