import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require:[true,'name is required'],
        trim:true,
        minlength:[3,'name must be atleat 3 characters']
    },
    email:{
        type:String,
        require:[true,'email is required'],
        unique:true,
        trim:true,
        lowercase:true
    },
    refreshToken: {
        type: String,
        default: null
    },
    password:{
        type:String,
        require:[true,'password is required'],
        minlength:[6,'password must be at least 6 characters long'],
        select:false    
    },
    role:{
        type:String,
        enum:['superadmin','admin','member'],
        default:'member'
    },
    org:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Organisation',
        default:null
    }
},
{
    timestamps:true
})

export default mongoose.model('User',userSchema)