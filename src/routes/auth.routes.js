import express from 'express'

import{
    register,
    login,
    logout,
    refreshtoken
} from '../controllers/auth.controller'
import { isloggedin } from '../middlewares/auth.middleware'


const router = express = express.Router()

router.post('/register',register)
router.post('/login',login)
router.post('/logout',isloggedin,logout)
router.post('/refresh-token',refreshtoken)


export default router