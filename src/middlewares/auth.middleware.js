import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import apiError from '../utils/apiError.js'

export const isloggedin = async (req,res,next)=>{
    try{
        const token=
        req.cookies?.accesstoken ||
        req.headers['authorization']?.replace('Bearer ', '').trim()

        if(!token){
            throw new apiError(401,'not logged in')
        }

        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded._id)
        if(!user){
            throw new apiError(401, 'user not found')
        }

        req.user = user
        next()
    }
    catch(error){
        next(error)
    }
}