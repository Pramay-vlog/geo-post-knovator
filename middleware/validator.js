
module.exports = (schema) => async (req, res, next) => {

    const paths = Object.keys(schema);
    if (!paths.length) return next()
    if (!paths.includes("body") && !paths.includes("query") && !paths.includes("params")) return next()

    for (let path of paths) {
        const validateData = req[path];
        const { value, error } = schema[path].validate(validateData, {
            allowUnknown: false,
        })

        if (error) return res.status(400).send({
            success: false,
            message: "Validation Error",
            data: {
                context: error.message,
                requiredFields: Object.keys(schema[path].describe().keys)
            }
        })

        req[path] = value
    }
    next()

}