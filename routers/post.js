const express = require('express')
const router = express.Router()
//const mongoose = require('mongoose')

//const Post = require('../models/post')
const PostController = require('../controllers/post')
const upload = require('./upload');

router.post('/',upload.array("image",10), PostController.createAPost)

router.get('/', PostController.getAll)

router.get('/:postId', PostController.getOne)

router.delete('/:postId', PostController.deletePost)

router.put('/:postId',PostController.update)

router.get('/reset/All',PostController.resetAll)

//router.delete('/:postId', PostController.deletePost)

module.exports = router