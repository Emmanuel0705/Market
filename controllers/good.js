const path = require('path');
const Good = require("../model/Good")
const Category = require("../model/Category")
const apiFeature = require("../util/apiFeatures")
const crypto = require('crypto');
const Store = require("../model/Store")
const catchAsync = require("../util/catchAsync")
const AppError = require("../util/appError")

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
    
    if(req.files){
        let imageName = [];
        req.body.images = []; 
        
        if(req.files.image.length >= 1){
            
            // ** multiple image uploading 
            req.files.image.forEach( img => {               
            
                if(!img.mimetype.startsWith('image')){
                    return next(new AppError("all files selected must be image",500))
                }

                // ** Storing Image Name     
                imageName = `photo_${crypto.randomBytes(12)
                    .toString("hex")}${path
                    .parse(img.name).ext}` 

                //  ** upload file     
                img.mv(`./upload/images/${imageName}`)
                
                req.body.images.push(imageName)
                
            });
                            
        }else{

            // ** multiple image uploading 
            
            if(!req.files.image.mimetype.startsWith('image')){
                return next(new AppError("file selected must be an image",500))
            }

            //  ** Storing Image Name     
            imageName = `photo_${crypto.randomBytes(12)
                .toString("hex")}${path
                .parse(req.files.image.name).ext}` 

            //  ** upload file     
            req.files.image.mv(`./upload/images/${imageName}`)
            
            req.body.images.push(imageName)
            
        }
    }

    if(req.body.availableColor){
        req.body.availableColor = req.body.availableColor.split(",").map(color => color.trim())
    }
    req.body.store = req.store.id
    const good = new Good(req.body);
    if(await good.save()){
        await Category.findOneAndUpdate(
            {name:req.body.category},{ $inc:{numOfGoods:1}},{returnNewDocument:true}
        )

        const category = await Category.findOne({name:req.body.category})
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