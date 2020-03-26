const mongoose = require('mongoose');   

const GoodSchema = mongoose.Schema({
    store:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required:[true,"Store Id is required"]
    },
    name:{
        type:String,
        required:[true,"name is required"],
        trim:true
    },
    price:{
        type:String,
        required:[true,"price is required"],
        trim:true,
        validate: {
            validator: v => !isNaN(v) ,
            message: "Price Must be a number"
        }
    },
    images:{
        type:[String],
        required:[true,"image is required"],
        validate: {
            validator: v => v == null || v.length > 0,
            message: "image is required"
        }
    },
    description:{
        type:String
    },
    availableColor:{
        type:[String]
    },
    category:{
        type:String,
        required:[true,"category is required"],
        trim:true
    },
    discount:{
        type:Number,
        min:[1,"Discount must be greater than 0"]
    },
    discountTill:{
      type:Date
    },
    guarantee:{
      type:String,
      default:0
    },
    brand:{
        type:String,
        required:[true,"brand is required"]
    },
    views:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

GoodSchema.pre('save', function(){
    this.brand = this.brand.toLowerCase()

})
GoodSchema.index({name:"text",category:"text",description:"text"})

module.exports = Good = mongoose.model('goods',GoodSchema);