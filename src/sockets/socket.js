import { Server } from "socket.io";

let io 

export const initsocket = (server)=>{
    io = new Server(server,{
        cors:{
            origin: '*'
        }
    })

    io.on('connection',(socket)=>{
        console.log('new socket connnection ', socket.id)

        socket.on('joinorg',(orgId)=>{
            socket.join(orgId)
            console.log(`socket ${socket.id} joined org room: ${orgId}`)
        })

        socket.on('disconnet',()=>{
            console.log('socket disconneted',socket.id)
        })
    })
}

export const notifyorg = (orgId,event,data)=>{
    if(io){
        io.to(orgId.toString()).emit(event,data)
    }
}