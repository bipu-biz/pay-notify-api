import express from 'express'
import {
    createorg,
    getorg,
    invitemember,
    removemember
} from '../controllers/org.controller.js'
import {isloggedin} from '../middlewares/auth.middleware.js'
import {authorization} from '../middlewares/role.middleware.js'

const router = express.Router()

router.post('/', isloggedin,createorg)
router.get('/',isloggedin,getorg)
router.post('/invite',isloggedin,authorization('admin'),invitemember)
router.delete('/member/:memberid',isloggedin,authorization('admin'),removemember)


export default router