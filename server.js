const http = require('http')
const app = require('./app')
require('dotenv').config()

const cluster = require('cluster')
const os = require('os')

//const port = process.env.PORT

const server = http.createServer(app)

if (cluster.isMaster) {
    let numCpu = os.cpus().length
    console.log("Master process id: " + process.pid)
    console.log("numCpu: " + numCpu)

    for (let i = 0; i < numCpu; i++) {
        cluster.fork()
    }

    cluster.on('fork', function (worker) {
        console.log('Create ' + worker.process.pid)
    })

    // cluster.on('online',function(worker){
    //     console.log('Worker '+worker.process.pid+' is listening')
    // })

    // cluster.on('listening',function(worker,addr){
    //     console.log('Listening: '+worker.process.pid+' address: '+addr.address+' port: '+addr.port)
    // })

    // cluster.on('disconnect',function(worker){
    //     console.log("Disconnect: "+worker.process.pid)
    // })

    cluster.on('exit', function (worker, code, signal) {
        console.log("Worker " + worker.process.pid + " died with code: " + code + ", and signal: " + signal)
        if (!worker.suicide) {
            console.log('New create: ' + worker.process.pid)
            cluster.fork()
        }
    })

} else {
    server.listen(process.env.PORT || 3000, () => {
        console.log('server started port: ' + process.env.PORT + ", Worler process id: " + process.pid)
        //console.log(", Worler process id: "+process.pid)
    })
}