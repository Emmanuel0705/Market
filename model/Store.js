const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const StoreSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Store owner id is required"]
    },
    name:{
        type:String,
        required:[true,"name is required"],
        trim:true
    },
    description:{
        type:String
    },
    contact:{
        phone:{
            type:[String],
        },
        facebook:{
            type:String,
        },
        email:{
            type:String,
        },
        whatsapp:{
            type:String,
        },
        
    },
    
    address:{
        type:String,
        required:[true,"address is required"]
    },
    category:{
        type:Array,
        validate:{
            validator: val => val == null || val.length > 0,
            message: "category is required"
        }
    },
    profileBg:{
        type:String
    }
})

StoreSchema.pre('save', async function(){   

    //set background color
    const bg = ["info","secondary","primary","accent","orange","purple","success"];
    this.profileBg = bg[Math.floor(Math.random() * 7)]
})

StoreSchema.index({name:"text",category:"text",description:"text"})
module.exports = Store = mongoose.model("store",StoreSchema);