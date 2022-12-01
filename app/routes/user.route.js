const express = require("express");
const users = require("../controllers/user.controller");

const router = express.Router();

router.route("/")
    .get(users.findUser)
    .post(users.create);

router.route("/:email")
    .get(users.findUser);

module.exports = router;