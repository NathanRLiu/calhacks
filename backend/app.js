const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const session = require('express-session');

const loginRoute = require("./routes/login");
const signupRoute = require("./routes/signup");
const uploadRoute = require("./routes/upload");

const app = express();
app.use(session({
    secret: "automathicSecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(express.json());
app.use(cors({credentials: true, origin: "http://localhost:3000"}));



app.use("/login", loginRoute);
app.use("/signup", signupRoute);
app.use("/upload", uploadRoute);

mongoose.connect("mongodb+srv://cdevadhar:e8T7QG0vUOLiiffZ@cluster0.d3nb9yg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(async() => {
    app.listen(8000, () => console.log("App listening on 8000"));
}) 
