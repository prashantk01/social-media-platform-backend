const Post = require("../models/schema/post.schema");
const User = require("../models/schema/user.schema")
const Comment = require("../models/schema/comment.schema")



exports.postLiked = async (currentUserId, postId) => {
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
        return new Error("current user not found");
    }
    return await Post.findByIdAndUpdate(
        postId,
        { $push: { likedBy: currentUser._id }, $inc: { likeCount: 1 } },
        { new: true, omitUndefined: true }
    );
};


exports.postUnliked = async (currentUserId, postId) => {
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
        return new Error("current user not found");
    }
    return await Post.findByIdAndUpdate(
        postId,
        { $pull: { likedBy: currentUser._id }, $inc: { likeCount: -1 } },
        { new: true, omitUndefined: true }
    )
};

exports.addComment = async (userId, postId, comment) => {
    try {
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return new Error("current user not found");
        }
        const newComment = {
            text: comment,
            commentedBy: currentUser,
            createdAt: new Date()
        }
        const createdComment = await new Comment(newComment).save();
        if (!createdComment)
            return new Error("comment not created");

        await Post.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: createdComment
                },
            },
            { new: true, omitUndefined: true }
        ).populate("comments");

        return createdComment;
    }
    catch (err) {
        throw new Error("error in creating comment")
    }
};

exports.getAllPostOfAUser = async (currentUserId) => {
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
        return new Error("current user not found");
    }
    return Post.find({ postedBy: currentUser._id })
        .sort({ createdAt: -1 })
    // populate("comments")
};

exports.getPostById = async (postId) => {
    const post = await Post.findById(postId).populate("comments")
    try {
        if (post)
            return post;
    }
    catch (e) {
        throw new Error("post not found !!")
    }
};


exports.createPost = async (newPost) => {
    const post = await new Post(newPost);
    post.save();
    if (!post) {
        throw new Error("error in creating post")
    }
    return post;
};


exports.deletePostById = async (postId, userId) => {
    const deletePost = await Post.findOneAndDelete({
        _id: postId,
        user: userId,
    });
    if (!deletePost) {
        throw new Error("error in deleting post")
    }
    return deletePost;
};
