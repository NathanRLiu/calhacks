const mongoose = require('mongoose')

const submissionSchema = mongoose.Schema(
    {
        file_name: {
            type: String,
            required: true
        },
        stepChecks: {
            type: Array,
            required: true
        },
        correct: {
            type: Boolean,
            required: true
        },
        student_name: {
            type: String,
            required: true
        },
        student_id: {
            type: String,
            required: true
        },
        assignment_name: {
            type: String,
            required: true
        },
        assignment_id: {
            type: String,
            required: true
        }
    },
    { timestamps: true}
)

module.exports = mongoose.model("submission", submissionSchema);