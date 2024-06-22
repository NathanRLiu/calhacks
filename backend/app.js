const express = require("express");
const axios = require("axios");

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const app = express();

app.post("/upload", multipartMiddleware, (req, res) => {
    fetch("https://server.simpletex.cn/api/latex_ocr", {
        method: "POST",
        headers: {
            "token": "yJAfYlAvgWbtaw1MstE1c98neKLFZKUAmBRWB6RiWzNI6dpjheLhloOEESUyqv64"
        },
        body: req.files
    })
    .then((res) => console.log(res))
    .catch((err) => {console.log(err)});
});

app.listen(8000);