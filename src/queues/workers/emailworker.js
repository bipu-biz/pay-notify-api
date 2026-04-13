import { Worker } from "bullmq";
import {createRequire} from 'module'
const require = createRequire(import.meta.url)
const nodemailer = require('nodemailer')
import redis from "../../config/redis.js";

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

const emailworker = new Worker('emailqueue',async(job)=>{
    const {type,data} = job

    if(job.name === 'welcomeEmail'){
        await transporter.sendMail({
            from: process.enc.EMAIL_USER,
            to:job.data.email,
            subject: 'welcome to PayNotify!',
            html: `<h1>welcome ${job.data.name}!</h1>
            <p>your account has been created successfully.</p>`
        })
    }

    if(job.name === 'paymentConfirmation'){
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: job.data.email,
            subject: 'payment Confirmed',
            html: `<h1>payment Confirmed!</h1>
            <p>payment of $${job.data.amount} for "${job.data.title}" has been paid.</p>`
        })
    }
},{connection: redis})

emailworker.on('completed',(job)=>{
    console.log(`email sent successfully: ${job.name}`)
})

emailworker.on('failed',(job,err)=>{
    console.log(`email failed: ${job.name}`,err.message)
})


export default emailworker