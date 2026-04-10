import 'dotenv/config'
import http from 'http'
import app from './src/app.js'
import connectDB from './src/config/db.js'
// import {intisocket} from './src/sockets/socket.js'

const PORT = process.env.PORT || 8000

const server = http.createServer(app)

// intisocket(server)

const startserver = async()=>{
    try{
        await connectDB()

        server.listen(PORT,()=>{
            console.log(`server running on port ${PORT}`)
        })
    }
    catch(error){
        console.log('server failed to start')
        process.exit(1)
    }
}

startserver()