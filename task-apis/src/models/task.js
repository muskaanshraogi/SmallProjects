const mongoose = require('mongoose')
const User = require('./user')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
},
{
    timestamps: true
})

const Task = new mongoose.model('Task', taskSchema)

module.exports = Task