const ErrorHander = require("../util/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/userModel")
const sendToken = require("../util/jwtToken")
const sendEmail = require("../util/sendEmail")
const crypto = require("crypto")
const cloudinary = require("cloudinary")

 
// Register a User
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{

    const mycloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
      folder: "avatars",
      width: 150,
      crop: "scale",
    })

    const { name, email, password, role}=req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:mycloud_public_id,
            url: mycloud.secure_url
        },
        role,
    })

    sendToken(user,200,res);
})
 // Login user

 exports.loginUser =catchAsyncErrors(async (req,res,next)=>{
    console.log(req.body)
    const{ email,password} =req.body;

    // checking if user has given email and password

    if(!email || !password){
        return next(new ErrorHander("Please Enter Email & Password",400))
    }

    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHander("Invalid email or password",401))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHander("Invalid email or password",401))
    }

   sendToken(user,200,res);
 })

 // LOGOUT User
 exports.logout = catchAsyncErrors(async(req,res,next)=>{

   res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly: true
   })

    res.status(200).json({
        success: true,
        message: "Logged Out",
    })
 })

 // Forgot Passord
 exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorHander("User not found", 404));
    }
  
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
        console.log(error)
      await user.save({ validateBeforeSave: false });
  
      return next(new ErrorHander(error.message, 500));
    }
  });

  // Reset Password
  exports.resetPassword = catchAsyncErrors( async(req,res,next)=>{
    
    // Creating Token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");


    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: DataTransfer.now()}
    });

    if (!user) {
        return next(new ErrorHander("User not found", 404));
      }
      if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHander("Password does not password",400));
      }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire= undefined
    
      await user.save();

      sendToken(user,200,res)
  });

//  Get user details
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        sucess: true,
        user,
    })
})
  // User Update password
  exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password")

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHander("old password is incorrect",400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHander("password does not match",400))
    }

    user.password = req.body.newPassword;

    await user.save();
    sendToken(user,200,res)
  })

  // update user profile
  exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

const newUserData = {
    name: req.body.name,
    email: req.body.email,
}

    // we will use cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators: true,
        useFindAndModify: false,
    });

  res.status(200).json({
      sucess:true,
  })
})

// Get all Users 
exports.getAllUser = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        sucess:true,
        users,
    })
})

// Get Single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
     return next(new ErrorHander(`user does not exist with id: ${req.params.id}`))
    }


  res.status(200).json({
    sucess:true,
    user,
})
})
// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
// delete user(admin)
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }
    await user.remove();

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  });