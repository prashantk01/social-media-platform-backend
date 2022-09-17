const mongoose = require('mongoose')
const validator = require('validator')

mongoose.Schema.Types.String.set("trim", true);
const post = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likeCount: {
        type: Number,
        default: 0
    },
    likedBy: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Comment"
        }
    ],
})


post.set("timestamps", true);

const Post = mongoose.model('Post', post)

module.exports = Post