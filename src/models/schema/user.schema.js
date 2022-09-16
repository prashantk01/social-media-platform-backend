const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Post = require('../schema/post.schema')
require('dotenv').config()

mongoose.Schema.Types.String.set("trim", true);
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    followersCount: {
        type: Number,
        default: 0,
        min: 0
    },
    followedBy: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    followingCount: {
        type: Number,
        default: 0,
        min: 0
    },
    followingTo: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    tokens: [{
        token: {
            type: String,
        }
    }],
})

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'postedBy'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.token

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Delete user Posts when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Post.deleteMany({ postedBy: user._id })
    next()
})


userSchema.set("timestamps", true);

const User = mongoose.model('User', userSchema);

module.exports = User