import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL,{
    maxRetriesPerRequest: null
})

redis.on('connect',()=>{
    console.log('redis connected')
})

redis.on('error',()=>{
    console.log('redis connection failed', error.message)
})

export default redis