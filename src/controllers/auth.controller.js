import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {generateAccessToken , generateRefreshToken} from '../utils/generateToken.js'
import apiError from '../utils/apiError.js'
import { addemailjob } from '../queues/emailQueue.js'

export const register = async (req, res , next)=>{
    try{
        const{name,email,password}=req.body

        const existinguser = await User.findOne({email})
        if(existinguser){
            throw new apiError(400, 'emailalready registered')
        }

        const hashedpassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedpassword
        })

        res.status(201).json({
            success:true,
            message:'registered successfully',
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })

        await addemailjob('welcomeEmail',{
                name: user.name,
                email: user.email
            })
    }
    catch(error){
        next(error)
    }
}



export const login= async(req,res,next)=>{
    try{
        const {email,password}=req.body

        const user = await User.findOne({email}).select('+password')
        if(!user){
            throw new apiError(404,'user not found')
        }

        const ismatch = await bcrypt.compare(password,user.password)
        if(!ismatch){
            throw new apiError(401,'invalid credentials')
        }

        const accesstoken = generateAccessToken(user._id)
        const refreshtoken = generateRefreshToken(user._id)

        user.refreshtoken = refreshtoken
        await user.save()

        res.cookie('refreshtoken',refreshtoken,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite: 'strict',
            maxAge: 7*24*60*60*1000

        })

        res.status(200).json({
            success:true,
            message:'login successful',
            accesstoken,
            user:{
                id:user._id,
                name:user.name,
                role:user.role,
                org:user.org
            }
        })
    }
    catch(error){
        next(error)
    }
}


export const logout = async (req,res,next)=>{
    try{
        await User.findByIdAndUpdate(req.user._id,{
            refreshtoken:null
        })

        res.clearCookie('refreshtoken')

        res.status(200).json({
            success:true,
            message:'logged out successfully'
        })
    }
    catch(error){
        next(error)
    }
}


export const refreshtoken = async(req,res,next)=>{
    try{
        const incomingrefreshtoken = req.cookies?.refreshtoken
        if(!incomingrefreshtoken){
            throw new apiError(401 ,'no refresh token')
        }

        const decoded = jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decoded._id)
        if(!user||user.refreshtoken!==incomingrefreshtoken){
            throw new apiError(401 , 'invallid refresh token')
        }

        const newAccessToken = generateAccessToken(user._id)

        res.status(200).json({
            success:true,
            accesstoken:newAccessToken
        })
    }
    catch(error){
        next(error)
    }
}