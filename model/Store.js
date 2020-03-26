const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const StoreSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        trim:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
        trim:true,
        minlength:[8,"password must not less than 8 characters"]
    },
    confirmPassword:{
        type:String,
        required:[true,"confirm password is required"],
        trim:true,
        minlength:[8,"confirm password must not less than 8 characters"],
        validate:{
            validator: function (val){
                return val === this.password
            },
            message: "Password mismatch"
        }
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
    },
    passwordChangedAt:Date,
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

StoreSchema.pre('save', async function(next){
     //check if modified 
     if(!this.isModified("password")) {
         this.confirmPassword = undefined 
         return next()
     }
     
     //encrypt password 
     const salt = await bcrypt.genSalt(10);
     this.password = await bcrypt.hash(this.password,salt)
     this.confirmPassword = undefined
     next()

})
StoreSchema.pre('save', async function(){   

    //set background color
    const bg = ["info","secondary","primary","accent","orange","purple","success"];
    this.profileBg = bg[Math.floor(Math.random() * 7)]

   //set email as contact details
   if(this.isModified("email")) {
       this.category = undefined
       this.address = undefined
       this.contact.email = this.email
    }

})

StoreSchema.methods.changePasswordAfter = function(jwtTime){
    if(this.passwordChangedAt){
        const passwordTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10)    
        return jwtTime < passwordTimeStamp
    }
    return false    
}

StoreSchema.index({name:"text",category:"text",description:"text"})
module.exports = Store = mongoose.model("store",StoreSchema);