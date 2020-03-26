const connectDb = require("./config/db")
const app = require("./app")
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" })
connectDb();
const PORT = process.env.PORT || 5000
app.listen(PORT,(console.log(`app is running on port ${PORT}`)))