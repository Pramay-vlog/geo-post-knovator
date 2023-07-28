const express = require("express");
const router = express.Router();
const APIS = require("../api/user/user.api");
const VALIDATE = require("../api/user/user.validator");
const auth = require("../middleware/auth");

router.post("/signup", VALIDATE.signup, APIS.signup);
router.post("/login", VALIDATE.login, APIS.login);

router.get("/get", auth, VALIDATE.get, APIS.get);
router.get("/dashboard", auth, APIS.dashboard);

module.exports = router;