const mongoose = require("mongoose");
const config = require('config');
const db = config.get("mongoURI");

const dbConnect = async () => {
    const DB = process.env.NODE_ENV === "production" ? 
        process.env.DB_CON.replace("<PASSWORD>",process.env.DB_PASSWORD) : 
        process.env.LOCAL_DB

    try {
        await mongoose.connect(DB, {
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