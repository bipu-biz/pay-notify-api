import mongoose from "mongoose";

const orgSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'organization name is required'],
            trim: true,
            minlength:[3,'name must be at least 3 characters']
        },
        description:{
            type:String,
            trim:true,
            default:''
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:[true,'owner is required']
        },
        members:[
            {
                user:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'User',
                },
                role:{
                    type:String,
                    enum:['admin','member'],
                    default:'member'
                }
            }
        ],
        isActive:{
            type:Boolean,
            default:true
        }
    },
    {
        timestamps:true
    }
)

export default mongoose.model('organization',orgSchema)