const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./../models/task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value))
                throw new Error('Invalid email.')
        }
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},
{
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {

    const userObject = this.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.methods.generateToken = async function () {

    const token = jwt.sign({ _id : this._id.toString() }, 'verificationbitches', { expiresIn : "1 day" })
    this.tokens = this.tokens.concat({ token }) 
    await this.save()
    return token
}

userSchema.statics.loginByCredentials = async (username, password) => {

    const user = await User.findOne({ username })
    if(!user) {
        throw new Error("Invalid credentials!")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        throw new Error("Invalid credentials!")
    }
    return user
}

userSchema.pre('remove', async function(next) {
    await Task.deleteMany({ owner : this._id })
    next()
})

userSchema.pre('save', async function(next) {

    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

const User = new mongoose.model('User', userSchema)

module.exports = User