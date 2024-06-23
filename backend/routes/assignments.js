const express = require("express");
const router = express.Router();
const Assignment = require('../models/assignmentModel');

router.get("/", async(req, res) => {
    const assignments = await Assignment.find({});
    res.send(assignments);
    return;
})

module.exports = router;