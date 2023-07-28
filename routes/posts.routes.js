const express = require("express");
const router = express.Router();
const APIS = require("../api/post/post.api");
const VALIDATE = require("../api/post/post.validator");
const auth = require("../middleware/auth");

router.post("/", auth, VALIDATE.create, APIS.create);

router.get("/", auth, VALIDATE.get, APIS.get);

router.put("/:_id", auth, VALIDATE.update, APIS.update);

router.patch("/:_id", auth, VALIDATE.delete, APIS.delete);

module.exports = router;