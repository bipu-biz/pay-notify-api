import express from 'express'
import{
    createpayment,
    getpayments,
    markaspaid,
    cancelpayment
} from '../controllers/payment.controller.js'
import { isloggedin } from '../middlewares/auth.middleware.js'
import { authorization } from '../middlewares/role.middleware.js'

const router = express.Router()

router.post('/',isloggedin,authorization('admin','member'),createpayment)
router.get('/',isloggedin,getpayments)
router.patch('/:id/pay',isloggedin,authorization('admin',member),markaspaid)
router.patch('/:id.cancel',isloggedin,authorization('admin',),cancelpayment)

export default router