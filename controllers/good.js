const Good = require("../model/Good")
const Category = require("../model/Category")
const apiFeature = require("../util/apiFeatures")
const Store = require("../model/Store")
const catchAsync = require("../util/catchAsync")
const AppError = require("../util/appError")
const imgUploading = require("../util/imageUploading")

//=> fetch all goods
exports.getGoods = catchAsync(async (req,res,next) => {
     
    const features = new apiFeature(Good.find(),req.query)
        .filter()
        .sort()
        .limitField()
        .paginate()
        .search()

    const goods = await features.query.populate('store',["contact","name"])   
    res.json(goods);
        
})

//fetch good by id
exports.getGoodById = catchAsync(async (req,res,next) => {
    Good.syncIndexes()

    let good = await Good.findById(req.params.id).populate('store',["contact","name"])
    if(!good){
        return next(new AppError(`Good with id: ${req.params.id} not found`, 404))
    }
    await Good.findOneAndUpdate(
        {_id:req.params.id},{ $set:{views: good.views+1}},{returnNewDocument:true}
    )
    await Category.findOneAndUpdate(
        {name:good.category},{$inc:{views:1}},{returnNewDocument:true}
    )
    res.json(good)
  
})

//url => api/good/
//description => Add New Good
// request type => Post
exports.addGood = catchAsync(async (req,res,next) => {
    const store = await Store.findById(req.params.storeId)
    if(!store){
        return next(new AppError("Invalid Store Id",501))
    }

    if(store.user.toString() !== req.user.id){
        return next(new AppError("Unatorized",501))
    }

    if(req.files){      
        req.body.images = [];

        if(req.files.image.length >= 1){            
            // MULTIPLE UPLOAD
            req.files.image.forEach( img => {
                const imgName = imgUploading(img)
                req.body.images.push(imgName)                
            });
                            
        }else{
            // SINGLE UPLOAD
            const imgName = imgUploading(req.files.image)
            req.body.images.push(imgName)
            
        }
    }
    console.log(req.body.images)

    if(req.body.availableColor){
        req.body.availableColor = req.body.availableColor.split(",").map(color => color.trim())
    }
    req.body.store = req.params.storeId
    const good = new Good(req.body);
    if(await good.save()){
        const category = await Category.findOne({name:req.body.category})
        if(!category) return next(new AppError(`Category ${req.body.category} deoes not exits`,400) )
        await Category.findOneAndUpdate(
            {name:req.body.category},{ $inc:{numOfGoods:1}},{returnNewDocument:true}
        )

        const brandInd = category.brand.map(cat => cat.name.toLowerCase())
        .indexOf(req.body.brand.toLowerCase())
        if(brandInd === -1){
            category.brand.unshift({name:req.body.brand})
            await category.save()
            
        }else{
            category.brand[brandInd].numOfGoods = category.brand[brandInd].numOfGoods+1
            await category.save()
        }
        
                        
    };
    res.json(good)
  
})