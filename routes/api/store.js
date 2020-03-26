const express = require("express");
const router = express.Router();
const {getStores,getStoreById,createStore} = require('../../controllers/store')
const {registerUser} = require('../../controllers/auth')
const auth = require("../../middleware/auth")

router.route("/").get(getStores).post(registerUser).put(auth,createStore);
router.route("/:id").get(getStoreById)

module.exports = router;    