const express = require('express');
const auth = require("../middleware/auth")
const postService = require('../services/post.service');

const router = express.Router();

router.get('/:id',
    async (req, res) => {
        try {
            const postId = req.params.id;
            const response = await postService.getPostById(postId);
            res.status(200).json({
                status: "success",
                data: {
                    title: response.title,
                    likeCount: response.likeCount,
                    numberOfComment: response.comments.length
                },
            })
        } catch (err) {
            res.status(400).send(err);
        }
    }

);

router.get('/',
    auth,
    async (req, res) => {
        try {
            const userId = req.user._id
            const response = await postService.getAllPostOfAUser(userId);
            res.status(200).send({
                data: response
            })
        } catch (err) {
            res.status(400).send(err);
        }
    }
);

router.post('/',
    auth,
    async (req, res) => {
        try {
            const { title, description } = req.body;
            const newPost = {
                title,
                description,
                postedBy: req.user
            }
            const response = await postService.createPost(newPost);
            res.status(200).send({
                data: {
                    id: response._id,
                    title: response.title,
                    description: response.description,
                    createdAt: response.createdAt,
                },
            })
        } catch (err) {
            res.status(400).send(err);
        }
    }
);

router.delete('/:id',
    auth,
    async (req, res) => {
        try {
            const postId = req.params.id;
            const userId = req.user._id;
            const resonse = await postService.deletePostById(
                postId,
                userId
            );
            res.status(200).json({
                status: "success",
                data: "deleted!!",
            })
        } catch (err) {
            res.status(400).send(err);
        }
    }
);

router.put('/like/:id',
    auth,
    async (req, res) => {
        try {
            const postId = req.params.id;
            const userId = req.user._id;
            const response = await postService.postLiked(userId, postId);
            res.status(200).send({
                status: "success",
                data: response,
            })
        } catch (err) {
            res.status(400).send(err);
        }
    }
);

router.put('/unlike/:id',
    auth,
    async (req, res) => {
        try {
            const postId = req.params.id;
            const userId = req.user._id;
            const response = await postService.postUnliked(userId, postId);
            res.status(200).send({
                status: "success",
                data: response,
            })
        } catch (err) {
            res.status(400).send(err);
        }
    }
);

router.put('/comment/:id',
    auth,
    async (req, res) => {
        try {
            const { comment } = req.body;
            const userId = req.user._id;
            const postId = req.params.id;
            const response = await postService.addComment(userId, postId, comment)
            res.status(200).send({
                status: "success",
                data: {
                    commentID: response._id,
                    comment: response.text,
                    createdBy: response.commentedBy._id,
                    createdAt: response.commentedAt
                },
            })
        } catch (err) {
            res.status(400).send(err);
        }
    }
);


module.exports = router;