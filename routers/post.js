const express = require('express')
const router = express.Router()
const PostController = require('../controllers/post')
const upload = require('./upload');

router.post('/', upload.array("image", 10), PostController.createAPost)

router.get('/', PostController.getAll)

router
    .route('/:postId')
    .get(PostController.getOne)
    .put(PostController.update)
    .delete(PostController.deletePost)

router.get('/reset/All', PostController.resetAll)

module.exports = router