const Category = require("../model/Category")
const ApiFeatures = require("../util/apiFeatures")
const catchAsync = require("../util/catchAsync")
  exports.getCategory = catchAsync(async (req,res,next) => {
        const features = new ApiFeatures(Category.find(),req.query)
        .sort()
        .limitField()
        .filter()
        .paginate()
        
        const category = await features.query
        
        res.json(category);
      
  })
  
  exports.createCategory = catchAsync(async (req,res,next) => {
      
        let category = await Category.findOne({name:req.body.name});
        if(category) throw new Error("category has already been created");
  
        category = new Category(req.body)
        await category.save()
        res.json(category)

  })
  