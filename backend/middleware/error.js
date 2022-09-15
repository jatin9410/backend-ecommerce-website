const ErrorHandler=require("../util/errorhander.js")

module.exports =(err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal server error"

    // wrong MOngodb Error
    if(err.name === "CastError"){
         const message = `Resourse not found. ${err.path}`
         err = new ErrorHandler(message,400)
    }

    // Mongoose duplicate Error
    if(err.code === 11000){
        const message = `Duplictae ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message,400)
    }

    // Wrong JWT error
    if(err.name === "JsonWebTokenError"){
        const message = `Json We Token is Invalid, Try Again`
        err = new ErrorHandler(message,400)
    }
    // JWT expire error
    if(err.name === "TokenExpiredError"){
        const message = `Json We Token is Expired, Try Again`
        err = new ErrorHandler(message,400)
    }


    res.status(err.statusCode).json({
        sucess:false,
        message: err.message
    })
}