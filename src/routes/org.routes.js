import express from 'express'
import {
    createdorg,
    createorg,
    getorg,
    invitedmember,
    removemember
} from '../controllers/org.controller.js'
import {isloggedin} from '../middlewares/auth.middleware.js'
import {authorization} from '../middlewares/role.middleware.js'

const router = express.Router()

router.post('/', isloggedin,createorg)
router.get('/',isloggedin,getorg)
router.post('/invite',isloggedin,authorization('admin'),invitedmember)
router.delete('/member/:memberid',isloggedin,authorization('admin'),removemember)


export default router