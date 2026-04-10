import redis from "../config/redis";

export const setCache = async (key, data, expiry=3600)=>{
    await redis.setex(key, expiry, JSON.stringify(data))
}

export const getCache = async(key)=>{
    const data = await redis.get(key)
    if(!data) return null
    return JSON.parse(data)
}

export const deleteCache = async(key)=>{
    await redis.del(key)
}

export const deleteCacheByPattern = async(pattern)=>{
    const keys = await redis.keys(pattern)
    if(keys.length>0){
        await redis.del(...keys)
    }
}