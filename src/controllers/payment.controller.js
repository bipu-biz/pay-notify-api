import { notifyorg } from '../sockets/socket.js'
import payment from '../models/payment.model.js'
import apiError from '../utils/apiError.js'
import { setCache,getCache,deleteCache } from '../utils/cache.js'

export const createpayment = async (req,res,next)=>{
    try{
        const {title,amount,description} = req.body
        const orgid = req.user.org

        if(!orgid) throw new apiError(400, ' you dont belong to any organization')

            const payment = await payment.create({
                title,
                amount,
                description,
                org: orgid,
                createdBy: req.user._id
            })

            await deleteCache(`payment:${orgid}`)

            res.status(201).json({
                success:true,
                message:'payment created successfully',
                payment
            })

            notifyorg(orgid,'newpayment',{
                message: `newpayment "${payment.title}" of $${payment.amount} created`,
                payment
            })
    }
    catch(error){
        next(error)
    }
}


export const getpayments = async(req,res,next)=>{
    try{
        const orgid = req.user.org
        const cached = await getCache(`payment${orgid}`)
        if(cached){
            return res.status(200).json({
                success:true,
                fromCache:true,
                payments:cached
            })
        }

        const payments = await payment.find({org:orgid})
        .populate('createdBy','name email')
        .populate('paidBy','name email')
        .sort({createdAt: -1})

        await setCache(`payments:${orgid}`,payments)

        res.status(200).json({
            success:true,
            fromCache:false,
            payments
        })
    }
    catch(error){
        next(error)
    }
}

export const markaspaid = async (req,res,next)=>{
    try{
        const {id}= req.params
        const orgid = req.user.org

        const payment = await payment.findById(id)
        if(!payment) throw new apiError(404,'payment not found')

            if(payment.org.toString()!==orgid.toString()){
                throw new apiError(403,'not allowed')
            }
            if(payment.status ==='paid'){
                throw new apiError(400,'payment already paid')
            }

            payment.status = 'paid'
            payment.paidBy = req.user._id
            payment.paidAt = new Date()
            await payment.save()

            await deleteCache(`payments:${orgid}`)

            res.status(200).json({
                success:true,
                message:'payment marked as paid',
                payment
            })

            notifyorg(orgid,'paymentpaid',{
                message: `payment "${payment.title}" has been paid`,
                payment
            })
    }
    catch(error){
        next(error)
    }
}

export const cancelpayment = async(req,res,next)=>{
    try{
        const {id}=req.params
        const orgid = req.user.org

        const payment = await payment.findById(id)
        if(!payment) throw new apiError(404, 'payment not found')

        if(payment.org.toString()!==orgid.toString()){
            throw new apiError(403,'not allowed')
        }

        if(payment.status!== 'pending'){
            throw new apiError(403,'onlu pending payments can be cancelled')
        }

        payment.status = 'cancelled'
        await payment.save()

        await deleteCache(`payments:${orgid}`)

        res.status(200).json({
            success: true,
            message: 'payment cancelled',
            payment
        })
    }
    catch(error){
        next(error)
    }    
}