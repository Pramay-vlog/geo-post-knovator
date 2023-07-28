const userModel = require("../../model/user.model");
const roleModel = require("../../model/role.model");
const postModel = require("../../model/post.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const enums = require("../../json/enums");

module.exports = {

    signup: async (req, res) => {
        try {

            if (!req.body.name || !req.body.email || !req.body.age || !req.body.roleId) return res.status(400).send({
                success: false,
                message: "invalid parameters"
            })

            const userExists = await userModel.findOne({ email: req.body.email }).lean()
            if (userExists) return res.status(400).send({
                success: false,
                message: "dublicate entity"
            })

            const roleExists = await roleModel.findById(req.body.roleId).lean()
            if (!roleExists) return res.status(400).send({
                success: false,
                message: "Role Not Found"
            })

            req.body.password = await bcrypt.hash(req.body.password, 10)

            const create = await userModel.create({
                ...req.body,
                roleId: roleExists._id
            })

            const token = jwt.sign({
                _id: create._id,
                role: roleExists.name,
            }, process.env.JWT_SECRET)

            return res.status(200).send({
                success: true,
                message: "success",
                data: { ...req.body, token: token }
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

    login: async (req, res) => {
        try {

            const userExists = await userModel.findOne({ email: req.body.email, isActive: true }).populate("roleId", "name").lean()
            if (!userExists) return res.status(400).send({
                success: false,
                message: "User Not Found"
            })

            const compare = await bcrypt.compare(req.body.password, userExists.password);
            if (!compare) return res.status(400).send({
                success: false,
                message: "Wrong Password"
            })

            const token = jwt.sign({
                _id: userExists._id,
                role: userExists.roleId.name,
            }, process.env.JWT_SECRET)

            return res.status(200).send({
                success: true,
                message: "success",
                data: { ...userExists, token: token }
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

            let { page, limit, sortBy, sortOrder, search, ...query } = req.query;

            skip = (page - 1) * limit;

            search ? query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ] : ""

            query = req.user.roleId.name === enums.ROLE.ADMIN ? { ...query } : { _id: req.user._id, ...query };

            const get = await userModel
                .find(query)
                .skip(skip)
                .limit(limit)
                .sort({ [sortBy]: sortOrder })
                .populate("roleId", "name")
                .lean()

            return res.status(200).send({
                success: true,
                message: "success",
                data: { count: await userModel.countDocuments(query), get }
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

    dashboard: async (req, res) => {
        try {

            if (req.user.roleId.name !== enums.ROLE.ADMIN) {
                return res.status(401).send({
                    success: false,
                    message: "Unauthorized",
                })
            }

            return res.status(200).send({
                success: true,
                message: "success",
                data: {
                    user: {
                        activeCount: await userModel.countDocuments({ isActive: true }),
                        inactiveCount: await userModel.countDocuments({ isActive: false }),
                    },
                    post: {
                        activeCount: await postModel.countDocuments({ isActive: true }),
                        inactiveCount: await postModel.countDocuments({ isActive: false }),
                    }
                }
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