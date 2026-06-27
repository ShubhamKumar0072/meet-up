require("dotenv").config();



const express = require("express");
const connectDB = require("./config/db");
const passport = require("./config/passport");
const session = require("express-session");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

//socket
const http = require("http");
const { Server } = require("socket.io");
const app=express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173",
        credentials:true
    }
})

app.set("io",io);  // now we can get io from req.app.get("io")

//This function run when user get connected to socket.io
// on -> used for listining
// emit -> used for sending
io.on("connection",(socket) => {

    socket.on("joinConv",(convId) => {
        socket.join(convId);
    });

    socket.on("leaveConv",(convId)=>{
        socket.leave(convId);
    })
})


app.use(cors({
    origin: "http://localhost:5173",
    credentials:true,
}));


app.use(express.urlencoded({extended:true})); // to deconstruct data from body
app.use(express.json()); //to convert/read jason data

connectDB();
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());


app.get("/",(req,res)=>{
    res.send("This is BackEnd");
});

app.use("/auth",authRoutes);
app.use("/conv",conversationRoutes);
app.use("/msg",messageRoutes);





const PORT = process.env.PORT;


server.listen(PORT,()=>{
    console.log("Listining from port : ",PORT);
});