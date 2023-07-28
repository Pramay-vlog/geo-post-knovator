const { Schema, model } = require("mongoose");

const roleSchema = new Schema(
    {
        name: String
    },
    {
        timestamps: true,
        versionKey: false
    },
)

const roleModel = model("role", roleSchema, "role")
module.exports = roleModel