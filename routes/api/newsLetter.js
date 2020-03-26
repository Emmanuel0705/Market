const express = require("express")
const router = express.Router()
const catchAsync = require('../../util/catchAsync')
const AppError = require("../../util/appError")
const User = require("../../model/User")
const NewsLetter = require("../../model/newsLetter")

const newsLetter = catchAsync(async (req,res,next) => {
    const user = await User.findOne({email:req.body.email})
    if(user) return next(new AppError(`Youre already a member of  this platform`,400))
    
    const newsLet = await NewsLetter.findOne({email:req.body.email})
    if(newsLet) return next(new AppError(`Already subscribed`,400))

    const newSub = new NewsLetter(req.body)
    await newSub.save()
    res.json(newSub)
    
})

router.route("/").post(newsLetter)

module.exports = router