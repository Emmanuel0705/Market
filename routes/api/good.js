const express  = require("express");
const router = express.Router({mergeParams:true});
const auth = require("../../middleware/auth")
const {getGoods,addGood,getGoodById} = require('../../controllers/good')

router.route("/").get(getGoods).post(auth,addGood)
router.route("/:id").get(getGoodById)
module.exports = router

