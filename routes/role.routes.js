const express = require("express");
const router = express.Router();
const APIS = require("../api/role/role.api");
const VALIDATE = require("../api/role/role.vaidator")

router.post("/", VALIDATE.create, APIS.create)

router.get("/", APIS.get)

module.exports = router