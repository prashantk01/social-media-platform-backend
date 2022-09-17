const express = require('express');
const auth = require("../middleware/auth")
const postService = require('../services/post.service');

const router = express.Router();

router.get('/:id',
    postService.getPostById
);

router.get('/',
    auth,
    postService.getAllPostOfAUser);

router.post('/',
    auth,
    postService.createPost);

router.delete('/:id',
    auth,
    postService.deletePostById);

router.put('/like/:id',
    auth,
    postService.postLiked);

router.put('/unlike/:id',
    auth,
    postService.postUnliked);

router.put('/comment/:id',
    auth,
    postService.addComment);


module.exports = router;