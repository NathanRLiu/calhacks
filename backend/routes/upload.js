const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const handleAlgebra = (latex, out, promises) => {
    const lines = encodeURIComponent(latex).split("%5C%5C");
    console.log(lines);
    for (let [index, line] of lines.entries()) {
        line = line.replace("%5Cbegin%7Baligned%7D", "");
        line = line.replace("%5Cend%7Baligned%7D", "");
        console.log(line);
        const promise = fetch(`http://api.wolframalpha.com/v2/query?appid=8KJERX-4X9LWJK2QL&input=${line}&output=json`)
        .then(async(resp) => {
            const result = await resp.json();
            console.log(result);
            console.log(result.queryresult.pods);
            const solution = result.queryresult.pods.find((element) => element.title=="Solution");
            if (solution) out.push({"step": index, "solution": solution.subpods[0].img.title});
            else {
                const input = result.queryresult.pods.find((element) => element.title=="Input");
                out.push({"step": index, "solution": input.subpods[0].img.title});
            }
        });
        promises.push(promise);
    };
}

const handleMatrix = (latex, out, promises) => {
    const matrices = encodeURIComponent(latex).split("%5C%5C%5C");
    for (let [index, matrix] of matrices.entries()) {
        matrix = matrix.replaceAll("bmatrix", "matrix");
        if (!matrix.startsWith("%5C")) matrix = "%5C"+matrix;
        matrix = "rowReduce%20"+matrix;
        console.log(matrix);
        const promise = fetch(`http://api.wolframalpha.com/v2/query?appid=8KJERX-4X9LWJK2QL&input=${matrix}&output=json`)
        .then(async(resp) => {
            const result = await resp.json();
            // console.log(result);
            // console.log(result.queryresult.pods);
            const solution = result.queryresult.pods.find((element) => element.title=="Result");
            out.push({"step": index, "rref": solution.subpods[0].plaintext});
        })
        promises.push(promise);
    }
}

router.post("/", upload.single("file"), async (req, res) => {
    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    console.log(filePath);
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
        let promises = [];
        let out = [];
        if (result.res.latex.includes("matrix")) {
            // do matrix shit
            handleMatrix(result.res.latex, out, promises);
        }
        else {
            handleAlgebra(result.res.latex, out, promises);
        }
        await Promise.all(promises);
        return res.send(out);
    })
    .catch((err) => {
        console.log(err);
        res.send({'error': "no good"});
        return;
    });
});

module.exports = router;