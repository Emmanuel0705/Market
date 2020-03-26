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
    const stores = await features.query.populate("user",['username','email']);
    res.status(200).json(stores)
})

// fetch store by id
exports.getStoreById = catchAsync(async (req,res,next) => {
    let store = await Store.findById(req.params.id)
      .select("-password")
      .populate("user",['username','email']);
    if(!store){
        return next(new AppError("store not found",404))
    }
    res.json(store);
})

// => fetch store by id
exports.createStore = catchAsync(async (req,res,next) => {

  const storeName = await Store.findOne({name:req.body.name})
  if(storeName) return next(new AppError(`${storeName.name} has already been created`,400))

  const user = await User.findById(req.user.id);
  let store = {}
  store.contact = {}
  if(!user){
    return next(new AppError("Something went wrong, pls try again",500))
  }  
    if(req.body.facebook) store.contact.facebook = req.body.facebook
    if(req.body.phone){
      store.contact.phone = req.body.phone.split(',').map(ph => ph.trim())
    }
    if(req.body.whatsapp) store.contact.whatsapp = req.body.whatsapp
    if(req.body.category) {
      store.category = req.body.category.split(",").map(cat => cat.trim())
    }
    store.contact.email = user.email
    if(req.body.description) store.description = req.body.description
    if(req.body.address) store.address = req.body.address
    if(req.body.name) store.name = req.body.name
    store.user = req.user.id
    console.log(store)
    const newStore = new Store(store)
     await newStore.save()

    res.status(200).json(newStore)
})

