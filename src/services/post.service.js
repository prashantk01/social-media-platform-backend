const Post = require("../models/schema/post.schema");

exports.postLiked = (req, res) => {
    Post.findByIdAndUpdate(
        req.params.id,
        { $push: { likedBy: req.user._id }, $inc: { likeCount: 1 } },
        { new: true, omitUndefined: true }
    )
        .populate("postedBy", "_id name")
        .then((doc) =>
            res.status(200).json({
                status: "success",
                data: doc,
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


exports.postUnliked = (req, res) => {
    Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { likedBy: req.user._id }, $inc: { likeCount: -1 } },
        { new: true, omitUndefined: true }
    )
        .populate("user", "_id name")
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

exports.addComment = (req, res) => {
    Post.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                comments: { commentText: req.body.comment, commentedBy: req.user._id, commentedAt: new Date() },
            },
        },
        { new: true, omitUndefined: true }
    )
        .populate("postedBy", "_id name")
        .then((doc) =>
            res.status(200).json({
                status: "success",
                data: {
                    data: doc,
                },
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

exports.getAllPostOfAUser = (req, res) => {
    Post.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .then((doc) =>
            res.status(200).json({
                status: "success",
                data: {
                    data: doc,
                },
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

exports.getPostById = (req, res) => {
    Post.findById(req.params.id)
        .then((doc) =>
            res.status(200).json({
                status: "success",
                data: {
                    data: doc,
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


exports.createPost = (req, res, next) => {
    const post = new Post(req.body);
    post.postedBy = req.user;
    post
        .save()
        .then((doc) =>
            res.status(201).json({
                status: "success",
                data: {
                    id: doc._id,
                    title: doc.postTitle,
                    description: doc.postDescription,
                    createdAt: doc.createdAt,
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
