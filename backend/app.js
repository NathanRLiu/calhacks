const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require("cors");
const session = require('express-session');
const loginRoute = require("./routes/login");
const signupRoute = require("./routes/signup");

const app = express();
app.use(session({
    secret: "automathicSecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(express.json());
app.use(cors({credentials: true, origin: "http://localhost:3000"}));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), async (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.file.filename);

    const blob = await fs.openAsBlob(filePath);
    const formData = new FormData();
    formData.append('file', blob, "name");
    fetch("https://server.simpletex.cn/api/latex_ocr", {
        method: "POST",
        headers: {
            "token": "yJAfYlAvgWbtaw1MstE1c98neKLFZKUAmBRWB6RiWzNI6dpjheLhloOEESUyqv64"
        },
        body: formData
    })
    .then(async(results) => {
        const result = await results.json();
        const lines = encodeURIComponent(result.res.latex).split("\\\\");
        let out = [];
        let promises = [];
        console.log(lines);
        for (let line of lines){
            console.log(line);
            const promise = fetch(`http://api.wolframalpha.com/v2/query?appid=8KJERX-4X9LWJK2QL&input=${line}&output=json`)
            .then(async(resp) => {
                const result = await resp.json();
                console.log(result);
                console.log(result.queryresult.pods);
                out.push(result.queryresult.pods);
            });
            promises.push(promise);
        };
        await Promise.all(promises);
        return res.send(out);
    })
    .catch((err) => {
        console.log(err);
        res.send({'error': "no good"});
        return;
    });
});

app.use("/login", loginRoute);
app.use("/signup", signupRoute);

mongoose.connect("mongodb+srv://cdevadhar:e8T7QG0vUOLiiffZ@cluster0.d3nb9yg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(async() => {
    app.listen(8000, () => console.log("App listening on 8000"));
}) 
