const express  = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const AppError = require("./util/appError")
const globalError = require("./controllers/errorController")
const cors = require("cors");
const path = require("path")

app.use(express.json({extended:false}))
app.use(fileUpload())
app.use(cors())
app.use(express.static(path.join(__dirname, "upload/")))
app.get('/',(req,res) => (res.send("APP IS RUNNING")));
app.use('/api/store', require("./routes/api/store"))
app.use('/api/register', require("./routes/api/register"))
app.use('/api/login', require("./routes/api/auth"))
app.use('/api/good', require("./routes/api/good"))
app.use('/api/category', require("./routes/api/category"))
app.use("/api/search", require("./routes/api/search"))
app.use("/api/newsletter", require("./routes/api/newsLetter"))
app.all("*", (req,res,next) => {
    const err = new AppError(`Cant find ${req.originalUrl} on this server`,404)
    next(err)
})
app.use(globalError)

module.exports = app