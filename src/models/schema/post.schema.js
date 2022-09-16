const mongoose = require('mongoose')
const validator = require('validator')

mongoose.Schema.Types.String.set("trim", true);
const post = new mongoose.Schema({
    postTitle: {
        type: String,
        required: true,
    },
    postDescription: {
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
            ref : "User"
        }
    ],
    comments:[ {
        text: {
            type: String
        },
        commentedBy: {
             type: mongoose.Schema.Types.ObjectId,
             ref: "User"
        },
        commentedAt: {
            type: Date,
            default : Date.now()
        }

    }],
})


post.set("timestamps", true);

const Post = mongoose.model('Post', post)

module.exports = Post