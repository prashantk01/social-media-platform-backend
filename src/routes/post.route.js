const express = require('express');
const postService = require('../services/post.service');

const router = express.Router();

router.get('/:id',
    postService.getPostById
);

router.get('/',
    postService.getAllPostOfAUser);

router.post('/',
    postService.createPost);

router.delete('/:id',
    postService.deletePostById);

router.put('/like/:id',
    postService.postLiked);

router.put('/unlike/:id',
    postService.postUnliked);

router.put('/comment/:id',
    postService.addComment);




module.exports = router;