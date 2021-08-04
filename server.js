const express=require("express");
const { readFileSync } = require("fs");
const app=express();
require("dotenv").config()
const http=require("http").createServer(app)
const PORT=process.env.PORT
http.listen(PORT,()=>{


})
app.use(express.static(__dirname+"/public"))
app.get("/",(req,res)=>{
    //const a=readFileSync("index.html")
    res.sendFile(__dirname + '/index.html');
})

const io =require("socket.io")(http)
const mysql = require("mysql");
const user={};
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chatapp"
  });
io.on("connection", (socket) =>{
    console.log('connected')
    socket.on("new-user-joined",name=>{
        console.log("user",name)
      user[socket.id]=name
      let m={
          user:name
      }
      socket.broadcast.emit("user-joined",m)  
    })
    socket.on("history",(name)=>{
        con.connect(()=>{
            con.query(`SELECT * FROM messages WHERE username = '${name}'`,(err,result)=>{
               let obj1 = JSON.parse(JSON.stringify(result));
                
               socket.emit("history",obj1)          
                
            })
        })
        //socket.broadcast.emit("history",obj1) 
    })
   socket.on("message",(msg)=>{
       con.connect(()=>{
           con.query(`INSERT INTO messages (username,message) VALUES ('${msg.user}','${msg.Message}')`,(err,result)=>{
               
           })
       })
        socket.broadcast.emit("message",msg)                 
    })
    socket.on("disconnect",room=>{
        socket.broadcast.emit("left",user[socket.id]);
        delete user[socket.id]
    })
})