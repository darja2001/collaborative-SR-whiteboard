var app = require('express')();
var http = require('http').createServer(app);
const io = require('socket.io')(http,{
      cors:{
          origin:'*',
      }
  })
var bodyParser = require('body-parser');
app.use(bodyParser.json({type:'application/json'}));
app.use(bodyParser.urlencoded({extended:true}));

let connections = [];
io.on('connection', (socket)=> {
      connections.push(socket);
      console.log(`${socket.id} has connected`);

      socket.on("disconnect", (reason) => {
            console.log(`${socket.id} is disconnected`);
            connections = connections.filter((con) => con.id !== socket.id);
      });
      socket.on('canvas-data', (data)=> {
            console.log(data);
            socket.broadcast.emit('canvas-data', data);
            
      });
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, () => {
    console.log("Started on : "+ server_port);
})