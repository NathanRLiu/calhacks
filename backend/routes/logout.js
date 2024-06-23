const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    req.session.destroy();
    return res.send({message: "Logged out"});
});

module.exports = router;