import organization from '../models/org.model.js'
import user from '../models/user.model.js'
import payment from '../models/payment.model.js'
import apiError from '../utils/apiError.js'

export const getallorgs = async(req,res,next)=>{
    try{
        const orgs = await organization.find()
        .populate('owner','name email')

        res.status(200).json({
            success:true,
            total:orgs.length,
            orgs
        })
    }
    catch(error){
        next(error)
    }
}

export const getorgsdetails = async(req,res,next)=>{
    try{
        const{id}=req.params

        const org = await organization.findById(id)
        .populate('owner','name email')
        .populate('members.user','name email')

        if(!org) throw new apiError(404,'organization not found')

        const payments = await payment.find({org:id})

        res.status(200).json({
            success:true,
            org,
            totalpayments:payments.length,
            payments
        })
    }
    catch(error){
        next(error)
    }
}

export const banorg = async(req,res,next)=>{
    try{
        const{id}=req.params

        const org=await organization.findById(id)
        if(!org) throw new apiError(404,'organization not found')

        if(!org.isActive){
            throw new apiError(400,'organization is already banned')
        }

        org.isActive = false
        await org.save()

        res.status(200).json({
            success:true,
            message:'organization banned successfully'
        })
    }
    catch(error){
        next(error)
    }
}

export const unbanorg = async(req,res,next)=>{
    try{
        const {id}=req.params

        const org = await organization.findById(id)
        if(!org) throw new apiError(400,'organization not found')

        if(org.isActive){
            throw new apiError(400,'organization is already active')
        }

        org.isActive = true
        await org.save()

        res.status(200).json({
            success:true,
            message:'organization unbanned successfully'
        })
    }
    catch(error){
        next(error)
    }
}

export const getallusers = async(req,res,next)=>{
    try{
        const users= await user.find()
        .populate('org','name')


        res.status(200).json({
            success:true,
            total:user.length,
            users
        })
    }
    catch(error){
        next(error)
    }
}