import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors"

const port = 3000;

const app = express();
const server = new createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }

  // we can use above cors code without using cors packege that we have installed
  // use of cors packege is when we have to use api then cors packege is used as middleware
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}))

// here is how we can use cors package

app.get("/", (_, res) => {
  res.send("Hello there!");
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on('message', ({message, room}) => { 
    console.log(message, room)
    // io.emit('received-message', message, socket.id) // will be sent to entire circuit
    // socket.broadcast.emit('received-message', message, socket.id) // will be sent to entire circuit except the sender
    io.to(room).emit('received-message', message, socket.id) // will be sent to entire particular socket
  }) 

  socket.on("join-room" , (room) => {
    socket.join(room)
    console.log("User joined the room", room)
  })


  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`)
  })

  // socket.emit("welcome", `welcome to the server`)
  // socket.broadcast.emit("welcome", `${socket.id} joined the server`)
});

server.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
