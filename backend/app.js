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
        const lines = encodeURIComponent(result.res.latex).split("\\\\");
        let out = [];
        console.log(lines);
        for (let line of lines){
            console.log(line);
            await fetch(`http://api.wolframalpha.com/v2/query?appid=8KJERX-4X9LWJK2QL&input=${line}&output=json`)
            .then(async(resp) => {
                const result = await resp.json();
                console.log(result);
                console.log(result.queryresult.pods);
                out.push(result.queryresult.pods);
            })
        };
        return res.send(out);
    })
    .catch((err) => {
        console.log(err);
        res.send({'error': "no good"});
        return;
    });
});

app.listen(8000);