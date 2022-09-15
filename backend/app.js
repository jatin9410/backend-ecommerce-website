const express=require("express");
const { getAllProducts } = require("./controller/productController");
const app=express();
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload")


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}))
app.use(fileupload());
const errorMiddleware = require("./middleware/error")

//route import
const product=require("./routes/productRoute")
const user = require("./routes/userRoute")
const order = require("./routes/orderRoute");


// app.use(router);
app.use("/api/v1",product)
app.use("/api/v1",user)
app.use("/api/v1",order)

// middleware for error
app.use(errorMiddleware)

module.exports=app;