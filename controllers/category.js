const Category = require("../model/Category")
const ApiFeatures = require("../util/apiFeatures")
const catchAsync = require("../util/catchAsync")
exports.topCategory = async (req,res,next) => {
    try {
        let good = await Good.aggregate([
            {
               $match:{ views: { $gte:1 } }
           },
           {
               $group:{
                  _id:"$category",
                  numOfViews:{$sum:"$views"},
                  brand:{$push:"$brand"}      
              }
           },
          {
              $sort:{numOfViews: -1}
          },
          {
              $addFields:{category:"$_id"}
          },
          {
              $project:{
                  _id:0
              }
          }
        ])
        res.json(good)  
        
    } catch (err) {
      console.log(err.message)
      return res.status(500).send('Server Error')
    }
  
  }
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
  