import apiError from "../utils/apiError.js";

export const authorization = (...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            throw new apiError(403,'you are not allowed to do this')
        }
        next()
    }
}