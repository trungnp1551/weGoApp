const express = require('express');
const router = express.Router();
//const Post = require('../models/post')
//const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');

//const User = require('../models/user');
//const { replaceOne } = require('../models/user');

const checkAuth = require('../auth/auth')

const UserController = require('../controllers/user');
//const cloudinary = require('./cloudinary')
const upload = require('./upload');

router
    .route('/')
    .get(UserController.userGetAll)

router
    .route('/signup')
    .post(UserController.signUp)

router
    .route('/login')
    .post(UserController.logIn)

router
    .route('/:userId/like/:postId')
    .post(checkAuth, UserController.userLikePost)

router
    .route('/:userId/unlike/:postId')
    .post(checkAuth, UserController.userUnlikePost)

router
    .route('/:userId/comment/:postId')
    .post(checkAuth, UserController.userCommentPost)

router
    .route('/:userId/changepassword')
    .post(checkAuth, UserController.userChangePassword)

router
    .route('/:userId')
    .get(/*checkAuth, */UserController.userGetOne)
    .put(/*checkAuth,*/ UserController.update)
    .delete(/*checkAuth,*/ UserController.userDeleteUser)

router
    .route('/:userId/upavatar')
    .post(checkAuth, upload.single("avatar"), UserController.upAvatar)

router
    .route('/:userId/logout')
    .get(checkAuth, UserController.logout)


// router
//     .route('/deleteall')
//     .delete(UserController.userDeleteAll)

module.exports = router;