const mongoose = require("mongoose");
const config = require('config');
const db = config.get("mongoURI");

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify:false
        })
        console.log("DB connected");
    } catch (err) {
        console.log(err.message);
        console.log('error occur')
        process.exit(1);
        
    }
}
module.exports = dbConnect;