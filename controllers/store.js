const Store = require("../model/Store")
const jwt = require("jsonwebtoken")
const ApiFeatures = require('../util/apiFeatures')
const catchAsync = require("../util/catchAsync")
const AppError = require("../util/appError")

// fetch all stores

exports.getStores = catchAsync(async (req,res,next) => {
    //execute the query
    const features = new ApiFeatures(Store.find(),req.query)
      .filter()
      .sort()
      .limitField()
      .paginate()
      .search();
    const stores = await features.query;
    res.status(200).json(stores)
})

// fetch store by id
exports.getStoreById = catchAsync(async (req,res,next) => {
    let store = await Store.findById(req.params.id).select("-password");
    if(!store){
        return next(new AppError("store not found",404))
    }
    res.json(store);
})

// => fetch store by id
exports.createStore = catchAsync(async (req,res,next) => {

  let store = await Store.findOne({email:req.store.email});
  if(!store){
    return next(new AppError("Something horribly went wrong, pls try again",500))
  }
    if(req.body.facebook) store.contact.facebook = req.body.facebook
    if(req.body.phone){
      store.contact.phone = req.body.phone.split(',').map(ph => ph.trim())
    }
    if(req.body.whatsapp) store.contact.whatsapp = req.body.whatsapp
    if(req.body.category) {
      store.category = req.body.category.split(",").map(cat => cat.trim())
    }
     store.confirmPassword = store.password
    
    if(req.body.description) store.description = req.body.description
    if(req.body.address) store.address = req.body.address
    if(req.body.name) store.name = req.body.name
    store = await store.save()

    res.status(200).json(store)
})

