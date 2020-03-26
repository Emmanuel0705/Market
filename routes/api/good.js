const express  = require("express");
const router = express.Router();
const auth = require("../../middleware/auth")
const {getGoods,addGood,getGoodById,topCat} = require('../../controllers/good')

router.route("/").get(getGoods).post(auth,addGood)
router.route("/:id").get(getGoodById)

module.exports = router

