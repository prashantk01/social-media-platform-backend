const Post = require("../models/schema/post.schema");
const User = require("../models/schema/user.schema")
const Comment = require("../models/schema/comment.schema")



exports.postLiked = async (req, res) => {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
        return new Error("current user not found");
    }
    Post.findByIdAndUpdate(
        req.params.id,
        { $push: { likedBy: currentUser._id }, $inc: { likeCount: 1 } },
        { new: true, omitUndefined: true }
    )
        .then((post) =>
            res.status(200).json({
                status: "success",
                data: post,
            })
        )
        .catch((e) =>
            res.status(400).json({
                status: "Error",
                data: {
                    data: e,
                },
            })
        );
};


exports.postUnliked = async (req, res) => {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
        return new Error("current user not found");
    }
    await Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { likedBy: currentUser._id }, $inc: { likeCount: -1 } },
        { new: true, omitUndefined: true }
    )
        .then((doc) =>
            res.status(200).json({
                status: "success",
                data: "Post Unliked successfully!!!",
            })
        )
        .catch((e) =>
            res.status(400).json({
                status: "Error",
                data: {
                    data: e,
                },
            })
        );
};

exports.addComment = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        if (!currentUser) {
            return new Error("current user not found");
        }
        const { comment } = req.body;
        const newComment = {
            text: comment,
            commentedBy: currentUser,
            createdAt: new Date()
        }
        const createdComment = await new Comment(newComment).save();
        if (!createdComment)
            return new Error("comment not created");

        await Post.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: createdComment
                },
            },
            { new: true, omitUndefined: true }
        ).populate("comments");

        res.status(200).json({
            status: "success",
            data: {
                commentID: createdComment._id,
                comment: createdComment.text,
                createdBy: createdComment.commentedBy._id,
                createdAt: createdComment.commentedAt
            },
        })
    }
    catch (err) {
        res.status(500).send({
            data: err
        })
    }

};

exports.getAllPostOfAUser = async (req, res) => {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
        return new Error("current user not found");
    }
    await Post.find({ postedBy: currentUser._id })
        .sort({ createdAt: -1 })
        // populate("comments")
        .then((doc) =>
            res.status(200).json({
                status: "success",
                data: doc,
            })
        )
        .catch((e) =>
            res.status(500).json({
                status: "Error",
                data: {
                    data: e,
                },
            })
        );
};

exports.getPostById = async (req, res) => {
    console.log("id: ", req.params.id)
    const post = await Post.findById(req.params.id).populate("comments")
    try {
        const commentCount = post.comments.length;
        res.status(200).send({
            status: "success",
            data: {
                title: post.title,
                likeCount: post.likeCount,
                numberOfComment: commentCount
            },
        })
    }
    catch (e) {
        res.status(400).json({
            status: "Error",
            data: e,
        })
    }
};


exports.createPost = (req, res, next) => {
    const { title, description } = req.body;
    const newPost = {
        title,
        description,
        postedBy: req.user
    }
    const post = new Post(newPost);
    post
        .save()
        .then((post) =>
            res.status(201).json({
                status: "success",
                data: {
                    id: post._id,
                    title: post.title,
                    description: post.description,
                    createdAt: post.createdAt,
                },
            })
        )
        .catch((e) =>
            res.status(400).json({
                status: "Error",
                data: e,
            })
        );
};


exports.deletePostById = (req, res) => {
    const deletePost = Post.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
    });

    deletePost
        .then((doc) =>
            res.status(200).json({
                status: "success",
                data: "deleted!!",
            })
        )
        .catch((e) =>
            res.status(400).json({
                status: "Error",
                data: {
                    data: e,
                },
            })
        );
};
