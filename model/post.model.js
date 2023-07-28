const { Schema, model } = require("mongoose");

const postSchema = new Schema(
    {
        title: String,
        body: String,
        createdBy: { type: Schema.Types.ObjectId, ref: "user" },
        location: {
            type: { type: String, default: "Point" },
            coordinates: { type: [Number] },
        },
        isActive: { type: Boolean, default: true }
    },
    {
        timestamps: true,
        versionKey: false
    },
)

postSchema.index({ location: "2dsphere" })

const postModel = model("post", postSchema, "post")
module.exports = postModel