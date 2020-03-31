const express = require("express");
const router = express.Router();
const {getStores,getStoreById,createStore} = require('../../controllers/store')
const {registerUser} = require('../../controllers/auth')
const auth = require("../../middleware/auth")
const goodRouter = require("./good")

router.use("/:storeId/newgood", goodRouter)
router.route("/").get(getStores).post(auth,createStore)
router.route("/:id").get(getStoreById)

module.exports = router;  