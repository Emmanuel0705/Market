const express = require("express");
const router = express.Router()
const {generalSearch} = require("../../controllers/search")
router.route("/:val").get(generalSearch)

module.exports = router