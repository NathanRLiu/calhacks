const express = require("express");
const axios = require("axios");

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const app = express();

app.post("/upload", multipartMiddleware, (req, res) => {
    axios.post("https://server.simpletex.cn/api/latex_ocr", req.files, {headers: {"token": "yJAfYlAvgWbtaw1MstE1c98neKLFZKUAmBRWB6RiWzNI6dpjheLhloOEESUyqv64"}})
    .catch((err) => {console.log(err)});
});

app.listen(8000);