const app=require("./app");
const dotenv=require("dotenv");
const cloudinary=require("cloudinary")
const path=require("path")
const p=process.env.PORT||3000;
const connectDatabase=require("./config/database")

// Handling Uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to Handling Uncaught Exception)`);
    process.exit(1)
})

// //config
dotenv.config({path:"backend/config/config.env"});

// Connecting to database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const server = app.listen(p,()=>{
    console.log(`server is running on http:localhost:${p}`)
})
// Unhandled Promise Rejection
process.on("unhandledRejection", (err)=>{
    console.log(`Error : ${err.message}`)
    console.log(`Shutting down the server due to unhandled promise rejection)`);

    server.close(()=>{
        process.exit(1);
    })
})