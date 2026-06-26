require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const passport = require("./config/passport");
const session = require("express-session");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const conversationRoutes = require("./routes/conversationRoutes");


const app=express();

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





const PORT = process.env.PORT;


app.listen(PORT,()=>{
    console.log("Listining from port : ",PORT);
});