const mongoose = require("mongoose");

const CategoerySchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"name of the category is required"]
    },
    views:{
        type:Number,
        default:0
    },
    image:{
        type:String,
        require:[true,"cover Image is required"]
    },
    numOfGoods:{
        type:Number,
        default:0
    },
    brand:[
        {
            name:{
                type:String
            },
            numOfGoods:{
                type:Number,
                default:1
            }
        }
    ]         

})
CategoerySchema.pre('save', function(){
    this.name = this.name.toLowerCase()
    this.brand.name = this.brand.name.toLowerCase()

    })
CategoerySchema.index({name:"text"})


module.exports = Category = mongoose.model("category",CategoerySchema)