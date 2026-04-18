import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL,{
    maxRetriesPerRequest: null,
    tls: process.env.NODE_ENV === 'production' ? {} : undefined
})

redis.on('connect',()=>{
    console.log('redis connected')
})

redis.on('error',(error)=>{
    console.log('redis connection failed', error.message)
})

export default redis