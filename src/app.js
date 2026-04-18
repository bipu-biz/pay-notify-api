import express from 'express'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import errorhandler from './middlewares/error.middleware.js'
import authRoutes from './routes/auth.routes.js'
import orgroutes from './routes/org.routes.js'
import paymentroutes from './routes/payment.routes.js'
import adminroutes from './routes/admin.routes.js'
const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again after 15 minutes'
  }
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many attempts, please try again after 15 minutes'
  }
})

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())
app.use(limiter)

app.use('/api/auth',authLimiter,authRoutes)
app.use('/api/org',orgroutes)
app.use('/api/payments',paymentroutes)
app.use('/api/admin',adminroutes)

app.get('/',(req,res)=>{
    res.json({message: 'paynotify api is running'})
})

app.use(errorhandler)


export default app