const express = require("express");
const router = express.Router();
const Submission = require('../models/submissionModel');
const { default: mongoose } = require("mongoose");
const path = require("path");

router.get("/byID/:submissionID", async(req, res) => {
    if (!mongoose.isValidObjectId(req.params.submissionID)) {
        res.send({"error": "Invalid submission id"});
        return;
    }
    const document = await Submission.findOne({"_id": req.params.submissionID});
    if (!document) {
        res.send({"error": "Submission does not exist"});
        return;
    }
    res.send(document);
    return;
})

router.get("/getImage/:submissionID", async(req, res) => {
    if (!mongoose.isValidObjectId(req.params.submissionID)) {
        res.send({"error": "Invalid submission id"});
        return;
    }
    const document = await Submission.findOne({"_id": req.params.submissionID});
    if (!document) {
        res.send({"error": "Submission does not exist"});
        return;
    }
    const filename = document.file_name;
    res.sendFile(path.join(__dirname, "../uploads", filename));
    return;
})

router.get("/all", async(req, res) => {
    const results = await Submission.find({});
    console.log(results);
    res.send(results);
    return;
})

router.get("/yours", async(req, res) => {
    if (!req.session.username) {
        res.send({"error": "not logged in"});
        return;
    }
    const results = await Submission.find({"student_name": req.session.username});
    console.log(results);
    res.send(results);
    return;
})

module.exports = router;