import Organization from '../models/org.model.js'
import user from '../models/user.model.js'
import apiError from '../utils/apiError.js'
import{setCache,getCache,deleteCache} from '../utils/cache.js'

export const createorg = async(req,res,next)=>{
    try{
        const{name,description}=req.body

        if(req.user.body){
            throw new apiError(400,'you already belong to an organization')
        }

        const org = await Organization.create({
            name,
            description,
            owner: req.user._id,
            members:[{user:req.user._id, role:'admin'}]
        })

        await user.findByIdAndUpdate(req.user._id, {
            org: org._id,
            role: 'admin'
        })

        res.status(201).json({
            success:true,
            message:'organization created successfully',
            org
        })
    }
    catch(error){
        next(error)
    }
}

export const getorg= async (req,res,next)=>{
    try{
        const orgid= req.user.org
        
        const cached = await getCache(`org:${orgid}`)
        if(cached){
            return res.status(200).json({
                success:true,
                org:cached
            })
        }

        const org = await Organization.findById(orgid).populate('owner','name email').populate('members.user','name email')

        if(!org) throw new apiError(404,'orgnization not found')

            await setCache(`org:${orgid}`,org)

            res.status(200).json({
                success:true
            })
    }
    catch(error){
        next(error)
    }
}

export const invitemember = async (req,res,next)=>{
    try{
        const{email}= req.body
        const orgid = req.user.org

        const inviteduser = await user.findOne({email})
        if(!inviteduser) throw new apiError(404,'user not found')

        if(inviteduser.org){
            throw new apiError(400,'user already belongs to an organization')
        }
        
        await Organization.findByIdAndUpdate(orgid,{
            $push: {members:{user:inviteduser._id, roel:'member'}}
        })

        await user.findByIdAndUpdate(inviteduser._id,{
            org:orgid,
            role:'member'
        })

        await deletecache(`org:${orgid}`)

        res.status(200).json({
            success:true,
            message:'member invited successfully'
        })
    }
    catch(error){
        next(error)
    }
}

export const removemember = async(req,res,next)=>{
    try{
        const {memberId} = req.params
        const orgid = req.user.org
        
        await Organization.findByIdAndUpdate(orgid,{$pull: {members: {user: memberId}}
        })

        await user.findByIdAndUpdate(memberId,{
            org:null,
            role:'member'
        })

        await deletecache(`org:${orgid}`)

        res.status(200).json({
            succes: true,
            message: 'Member removed successfully'
        })
    }
    catch(error){
        next(error)
    }
}