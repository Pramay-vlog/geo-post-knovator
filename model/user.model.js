const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        name: String,
        email: String,
        age: Number,
        password: String,
        roleId: { type: Schema.Types.ObjectId, ref: "role" },
        isActive: { type: Boolean, default: true }
    },
    {
        timestamps: true,
        versionKey: false
    },
)

const userModel = model("user", userSchema, "user")
module.exports = userModel