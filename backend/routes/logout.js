const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    console.log(req.session);
    req.session = null;
    return res.send({message: "Logged out"});
});

module.exports = router;