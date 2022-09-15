const ErrorHander = require("../util/errorhander");
const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    
    const  token  = req.cookies.token;
    
  
    if (!token) {
      return next(new ErrorHander("Please Login to access this resource", 401));
    }
  
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedData)
  
    req.user = await User.findById(decodedData._id);
  
    next();
  });

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        
      if (!req.user || !roles.includes(req.user.role)) {
        return next(
          new ErrorHander(
            `Role: ${req.user ? req.user.role : 'undefined'} is not allowed to access this resource `,
            403
          )
        );
      }
  
      next();
    };
  };