import apiError from '../utils/apiError'

const errorhandler = (err,req,res,next)=>{
    const statuscode = err.statuscode || 500
    const message = err.message || 'something went wrong'


    if(err.name==='ValidationError'){
        const errors = Object.valuses(err.errors).mamp(e=>e.message)
        return res.status(400).json({
            success:false,
            message:errors
        })
    }

    if(err.code==='11000'){
        const field = Object.keys(err.keyValue)[0]
        return res.status(400).json({
            success:false,
            message:`${field}already exists`
        })
    }
    
    if(err.name==='JsonWebTokenError'){
        return res.status(401).json({
            success:false,
            message:'invalid token'
        })
    }

    if(err.name==='TokenExpiredError'){
        return res.status(401).json({
            success:false,
            message:'token expired'
        })
    }

        res.status(401).json({
            success:false,
            message
        })
}


export default errorhandler