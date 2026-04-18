import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:[true,'payment title is required'],
            trim:true
        },
        amount:{
            type:Number,
            required:[true,'amount is required'],
            min:[1,'amount must be at least 1']
        },
        description:{
            type:String,
            trim:true,
            default:''
        },
        status:{
            type:String,
            enum:['pending','paid','cancelled'],
            default:"pending"
        },
        org:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'organization',
            required:[true,'Organization is required']
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:[true,'creater is required']
        },
        paidBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            default:null
        },
        paidAt:{
            type:Date,
            dafault:null
        }
    },
    {
        timestamps:true
    }
)

export default mongoose.model('payment',paymentSchema)