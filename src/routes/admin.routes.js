import express from 'express'
import {
    getallorgs,
    getorgsdetails,
    banorg,
    unbanorg,
    getallusers,
} from '../controllers/admin.controller.js'
import { isloggedin } from '../middlewares/auth.middleware.js'
import { authorization } from '../middlewares/role.middleware.js'

const router = express.Router()

router.get('/orgs',isloggedin,authorization('superadmin'),getallorgs)
router.get('/orgs/:id',isloggedin,authorization('superadmin'),getorgsdetails)
router.patch('/orgs/:id/ban',isloggedin,authorization('superadmin'),banorg)
router.patch('/orgs/:id/unban',isloggedin,authorization('superadmin'),unbanorg)
router.get('/users',isloggedin,authorization('superadmin'),getallusers)

export default router