const mongoose=require("mongoose")

const productSchema= mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter product name"]
    },
    description:{
        type:String,
        required:[true,"Please Enter product description"]
    },
    price:{
        type:String,
        required:[true,"Please Enter product price"],
        maxLength:[9,"Price cannot exceed 8 characters"]
    },
    ratings:{
        type:Number,
       default:0
    },
    images:[
        {
        public_id:{
            type:String,
            required:true
             
        },
        url:{
            type:String,
            required:true
             
        } 
    } 
    ],
    category:{
        type:String,
        required:[true,"Please Enter product category"]
    },
    stock:{
        type:Number,
        required:[true,"Please Enter product stock"],
        maxLength:[4,"Stock caqnnot exceed 4 character"],
        default:1
    },
    numofReviews:{
        type:Number,
        default:0
    },
    reviews:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String,
            required:true
        }
    }],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Product",productSchema);