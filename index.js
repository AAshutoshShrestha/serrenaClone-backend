const http = require('http')
const app = require('./src/config/express.config');
const { Socket } = require('socket.io');

const server = http.createServer(app)

const {Server} = ('socket.io');

// const io = new Server(server,{
// 	cors:"*"
// })

// io.on("connection",{socket}=>{
// 	// console.log(socket.id)
// 	Socket.on()
// })
// port no. : 0 to 2^16-1 [65535]
// ~ 100 port => well known port for different services


server.listen(5500,'127.0.0.1',(err)=>{
	if (!err) {
		console.log("Server is running on port 5500");
		console.log("press ctrl+c to discontinue server.....");
	}
})
