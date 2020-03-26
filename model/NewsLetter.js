const mongoose = require("mongoose")

const NewsLetterSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true,"email address is required"]
    }
})

module.exports = NewsLetter = mongoose.model('newsLetter',NewsLetterSchema)