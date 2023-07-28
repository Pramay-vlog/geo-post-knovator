const postModel = require("../../model/post.model");
const enums = require("../../json/enums");

module.exports = {

    create: async (req, res) => {
        try {

            let create;
            try {
                let data = {
                    ...req.body,
                    createdBy: req.user._id,
                    location: {
                        coordinates: [req.body.long, req.body.lat]
                    }
                }

                create = await postModel.create(data);
            } catch (err) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid coordinates",
                })
            }

            return res.status(200).send({
                success: true,
                message: "success",
                data: create
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
            let { long, lat, distance, page, limit, sortBy, sortOrder, search, ...query } = req.query;

            skip = (page - 1) * limit;

            search ? query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ] : ""

            query = req.user.roleId.name === enums.ROLE.ADMIN ? { ...query } : { isActive: true, ...query };

            let get;

            try {

                get = await postModel
                    .find({
                        location: {
                            $near: {
                                $geometry: {
                                    type: "Point",
                                    coordinates: [parseFloat(long), parseFloat(lat)]
                                },
                                $maxDistance: 1000 * parseFloat(distance)
                            }
                        },
                        ...query,
                    })
                    .skip(skip)
                    .limit(limit)
                    .sort({ [sortBy]: sortOrder })
                    .populate("createdBy", "name email age")
                    .lean()

            } catch (err) {
                return res.status(400).send({
                    success: false,
                    message: "Invalid coordinates",
                })
            }

            return res.status(200).send({
                success: true,
                message: "success",
                data: { totalCount: await postModel.countDocuments(), postCount: get.length, get }
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

    update: async (req, res) => {
        try {

            const postExists = await postModel.findOne({ _id: req.params._id, isActive: true }).lean()
            if (!postExists) return res.status(400).send({
                success: false,
                message: "Post Not Found",
            })

            if (req.user.roleId.name !== enums.ROLE.ADMIN && req.user._id.toString() !== postExists.createdBy.toString()) {
                return res.status(401).send({
                    success: false,
                    message: "Unauthorized",
                })
            }

            await postModel.findByIdAndUpdate(req.params._id, req.body)
            return res.status(200).send({
                success: true,
                message: "success",
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

    delete: async (req, res) => {
        try {

            const postExists = await postModel.findOne({ _id: req.params._id }).lean()
            if (!postExists) return res.status(400).send({
                success: false,
                message: "Post Not Found",
            })

            if (req.user.roleId.name !== enums.ROLE.ADMIN && req.user._id.toString() !== postExists.createdBy.toString()) {
                return res.status(401).send({
                    success: false,
                    message: "Unauthorized",
                })
            }

            await postModel.findByIdAndUpdate(req.params._id, { isActive: !postExists.isActive })
            return res.status(200).send({
                success: true,
                message: "success",
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



}