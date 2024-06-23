const express = require("express");
const multer = require("multer");
const path = require("path");
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
        console.log(encodeURIComponent(result.res.latex));
        fetch(`http://api.wolframalpha.com/v2/query?appid=8KJERX-4X9LWJK2QL&input=${encodeURIComponent(result.res.latex)}&output=json`)
        .then(async(resp) => {
            const result = await resp.json();

            console.log(result.queryresult.pods);
            return res.send(result.queryresult.pods);
        })
    })
    .catch((err) => {
        console.log(err);
        res.send({'error': "no good"});
        return;
    });
});

app.listen(8000);