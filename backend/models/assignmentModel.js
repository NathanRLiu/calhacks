const mongoose = require('mongoose')

const assignmentSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    },
    { timestamps: true}
)

module.exports = mongoose.model("assignment", assignmentSchema);