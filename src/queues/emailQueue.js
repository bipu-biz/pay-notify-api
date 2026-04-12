import { Queue } from "bullmq";
import redis  from "../config/redis.js";

export const emailQueue = new Queue('emailQueue',{
    connection:redis
})

export const addemailjob = async (type,data)=>{
    await emailQueue.add(type,data,{
        attempts:3,
        backoff:{
            type:'exponential',
            delay:5000
        }
    })
}