const express = require("express");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const fs = require('fs');

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
  

app.post("/upload", upload.single("file"), (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    // console.log(req.files);
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    fetch("https://server.simpletex.cn/api/latex_ocr", {
        method: "POST",
        headers: {
            "token": "yJAfYlAvgWbtaw1MstE1c98neKLFZKUAmBRWB6RiWzNI6dpjheLhloOEESUyqv64"
        },
        body: formData
    })
    .then((res) => console.log(res))
    .catch((err) => {console.log(err)});
    res.send(req.files);
});

app.listen(8000);