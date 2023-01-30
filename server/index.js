const express = require('express')
const app = express();
const PORT = 4000;

// New Imports

const server = require('http').Server(app);
const cors = require('cors');  //Node.js. CORS is a Node.js package that allows communication between different domains.

app.use(cors());

// real-time connection with react front-end client
const socketIO = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

let users = [];

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    //sends the message to all the users on the server
    socket.on('message',(data)=>{
       socketIO.emit('messageResponse',data);
    })

    //Listens when a new user joins the server
  socket.on('newUser', (data) => {
    //Adds the new user to the list of users
    users.push(data);
    console.log(users);
    //Sends the list of users to the client
    socketIO.emit('newUserResponse', users);
  });

    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
          //Updates the list of users when a user disconnects from the server
       users = users.filter((user)=>user.socketID!==socket.id);
       socketIO.emit('newUserResponse', users);
    socket.disconnect();
    });
});




app.get('/api',(req,res)=>{
    res.json({message:'Hello Server'})
});

server.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}...`);
})