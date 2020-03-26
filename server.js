const connectDb = require("./config/db")
const app = require("./app")
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" })
connectDb();
const PORT = process.env.PORT
app.listen(PORT,(console.log(`app is running on port ${PORT}`)))
