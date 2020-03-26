const Store = require("../model/Store")
const Good = require("../model/Good")
const Category = require("../model/Category")
const cathAsync = require("../util/catchAsync")
exports.generalSearch = cathAsync(async (req,res,next) => {
     const cat = await Category.find({$text :{$search:req.params.val}})
     const store = await Store.find({$text :{$search:req.params.val}})
     const good = await Good.find({$text :{$search:req.params.val}})
     res.json({
         category:cat,
         store,
         good
     })
})  