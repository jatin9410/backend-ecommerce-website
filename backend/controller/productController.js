const Product=require("../models/productModel");
const ErrorHander = require("../util/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ApiFeatures = require("../util/apifeatures");

//create product --admin
exports.createProduct=catchAsyncErrors(async(req,res,next)=>{

    req.body.user = req.user.id;
    
    const product=await Product.create(req.body);
    res.status(200).json({
       sucess: true,
       product
    })
})

//get all products

exports.getAllProducts = catchAsyncErrors(async(req,res)=>{

    const resultPerPage = 5;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter();

    let products= await apiFeature.query;

    let filteredProductCount = products.length;

    apiFeature.pagination(resultPerPage);

    products = await apiFeature.query;

    res.status(200).json({
        sucess: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductCount
     });
  
});

//update product --admin

exports.updateProduct = catchAsyncErrors(async (req,res,next)=>{
   let product = await Product.findById(req.params.id);

   if(!product){
    return res.status(500).json({
        sucess:false,
        messg:"Product not found"
    })
   }

   product = await Product.findByIdAndUpdate(req.params.id,req.body,{
    new:true
   });
   res.status(200).json({
     sucess:true,
     product
   })
})
//Get product detail
exports.getProductDetails = catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHander("Product not found",404))
       }
    res.status(200).json({
        sucess:true,
        product,
    })
})

// delete
exports.deleteProduct = catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            sucess:false,
            messg:"Product not found"
        })
       }

    await product.remove();
    res.status(200).json({
        sucess:true,
        messg:"deleted"
    })

})
// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });
  
  // Get All Reviews of a product
  exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });
  
  // Delete Review
  exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });