const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('./../models/user')
const auth = require('./../middleware/auth')

const router = new express.Router()

const avatar = multer({
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload an image file."))
        }
        cb(undefined,true)
    }
})

router.post('/user', async (req, res) => {

    const user = new User(req.body)
    
    try {
        await user.save()
        res.status(201).send(user)
    }
    catch(error) {
        res.status(400).send(error)
    }
})

router.post('/user/login', async (req, res) => {

    try {
        const user = await User.loginByCredentials(req.body.username, req.body.password)
        const token = await user.generateToken()
        res.send({ user, token })
    }
    catch(error) {
        res.status(400).send("Invalid Credentials!")
    }
})

router.get('/user/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/user/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send("Logged out")
    }
    catch(error) {
        res.status(500).send()
    }
})

router.post('/user/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = []
        await req.user.save()
        res.send("Logged out of all devices")
    }
    catch(error) {
        res.status(500).send()
    }
})

router.patch('/user/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'username', 'password']
    const isAllowed = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isAllowed) {
        return res.status(400).send("Invalid update!")
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    }
    catch(error) {
        res.status(500).send() 
    }
})

router.delete('/user/me', auth, async(req, res) => {
    
    try {
        await req.user.remove()
        res.send("Deleted account")
    }
    catch(error) {
        res.status(500).send("Delete failed")
    }
})

router.post('/user/me/avatar', auth, avatar.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({ width: 250, height:250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send({ message: "Upload successful." })

}, (error, req, res, next) => {
    res.status(400).send({ error : error.message })
})

router.delete('/user/me/avatar', auth, async (req, res) => {

    req.user.avatar = undefined
    await req.user.save()
    res.send({ message: "Delete successful." })

}, (error, req, res, next) => {
    res.status(400).send({ error : error.message })
})

router.get('/user/me/avatar', auth, async (req, res) => {

    try {
        const user = await User.findOne({ _id : req.user._id })

        if(!user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }
    catch(error) {
        res.status(404).send({ error : "Picture not found."})
    }
})

module.exports = router
