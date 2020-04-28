const express = require('express')
const Task = require('./../models/task')
const auth = require('./../middleware/auth')

const router = new express.Router()

router.post('/task', auth, async (req, res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    }
    catch(error) {
        res.status(400).send(error)
    }
})

router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const part = req.query.sortBy.split(':')
        sort[part[0]] = part[1] === 'desc' ? (-1) : (1)
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }
    catch(error) {
        res.status(500).send()
    }
})

router.delete('/task/:id', auth, async (req, res) => {

    try {
        const task = await Task.findOneAndDelete({ _id : req.params.id, owner : req.user._id })
        if(!task) {
            return res.status(404).send()
        }
    
        res.send(task)
    }
    catch(error) {
        res.status(500).send()
    }
})

router.patch('/task/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isAllowed = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isAllowed) {
        return res.status(400).send("Invalid update!")
    }

    try {
        const task = await Task.findOne({ _id : req.params.id, owner : req.user._id })
        if(!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => {
            return task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    }
    catch(error) {
        res.status(400).send() 
    }
})

module.exports = router