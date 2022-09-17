const mongoose = require('mongoose')
const validator = require('validator')

mongoose.Schema.Types.String.set("trim", true);
const comment = new mongoose.Schema({
    text: {
        type: String
    },
    commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    commentedAt: {
        type: Date,
        default: Date.now()
    }
})


comment.virtual('comments', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'comments'
})

comment.set("timestamps", true);

const Comment = mongoose.model('Comment', comment)

module.exports = Comment