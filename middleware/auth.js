const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");

const auth = async (req, res, next) => {

    try {

        const token = req.headers["x-auth-token"]
        if (!token) return res.status(400).send({
            success: false,
            message: "Token Required",
        })

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            if (!decode) return res.status(401).send({
                success: false,
                message: "Unauthorized",
            })

            const userExists = await userModel.findOne({ _id: decode._id, isActive: true }).populate("roleId", "name").lean();
            if (!userExists) return res.status(404).send({
                success: false,
                message: "User Not Found",
            })

            req.user = userExists

            next()

        } catch (err) {
            return res.status(404).send({
                success: false,
                message: "Unauthorized",
            })
        }

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

module.exports = auth;