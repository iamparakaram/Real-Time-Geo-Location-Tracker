// const express = require('express')
// const app = express();

// const http = require("http");
// const socketio = require("socket.io");
// const path = require('path');
// //will make a server for us
// const server = http.createServer(app);

// const io = socketio(server);

// // Set the view engine to EJS
// app.set("view engine","ejs");

// // Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname,"public")));

// io.on("connection",function(socket){
//     socket.on("send-location",function(data){
//         io.emit("receive-location",{id: socket.id, ...data});
//     });
//     console.log("A user connected");
//     socket.on("disconnect",function(){
//         io.emit("user-disconnected",socket.id)
//     });
// });

// app.get("/",function(req,res){
//     res.render("index");
// });

// server.listen(3000);
const express = require('express');
const app = express();
const http = require("http");
const socketio = require("socket.io");
const path = require('path');
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const users = {}; // Store user profiles and device details

io.on("connection", function(socket) {
    console.log("A user connected");

    socket.on("send-location", function(data) {
        const {latitude, longitude, profile} = data;
        users[socket.id] = {latitude, longitude, ...profile};
        io.emit("receive-location", {id: socket.id, ...users[socket.id]});
    });

    socket.on("disconnect", function() {
        io.emit("user-disconnected", socket.id);
        delete users[socket.id];
    });
});

app.get("/", function(req, res) {
    res.render("index");
});

server.listen(3000);
