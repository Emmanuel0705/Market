const express  = require("express");
const router = express.Router();
const auth = require("../../middleware/auth")
const {topCategory,getCategory,createCategory} = require('../../controllers/category')

router.route("/").get(getCategory).post(createCategory)
module.exports = router

