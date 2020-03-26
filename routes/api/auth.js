const express = require("express");
const router = express.Router();
const {check} = require("express-validator")
const auth = require('../../middleware/auth')
const {getUser,loginUser} = require("../../controllers/auth")

router.route("/").get(auth,getUser).post([
    check("email","Please Input a Valid Email").isEmail(),
    check('password',"password Is Required").not().isEmpty()
],loginUser)

module.exports = router