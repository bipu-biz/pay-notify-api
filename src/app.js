import express from 'express'
import cookieParser from 'cookie-parser'
import errorhandler from './middlewares/error.middleware.js'
import authRoutes from './routes/auth.routes.js'
import orgroutes from './routes/org.routes.js'
import paymentroutes from './routes/payment.routes.js'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cookieParser())
app.use('/api/org',orgroutes)
app.use('/api/payments',paymentroutes)

app.use('/api/auth',authRoutes)

app.get('/',(req,res)=>{
    res.json({message: 'paynotify api is running'})
})

app.use(errorhandler)


export default app