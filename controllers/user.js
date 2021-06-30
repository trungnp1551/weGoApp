const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// const upload = require('../routers/upload')
const cloudinary = require('../routers/cloudinary')
const User = require('../models/user')
const Post = require('../models/post')
// const { findById, find } = require('../models/post')
// const { response } = require('express')


exports.signUp = (req, res) => {
    User
        .findOne({ username: req.body.username })
        .then(user => {
            if (user) {
                return res.status(200).json({ message: 'Username exists' })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: err })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            username: req.body.username,
                            password: hash,
                            fullName: req.body.username,
                            avatar: "https://res.cloudinary.com/weappuit2021/image/upload/v1625066704/unnamed_wt1gu3.png"
                        });
                        user
                            .save()
                            .then(user => {
                                res.status(200).json({
                                    message: 'Create successful'
                                    //CreatedUser: user
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(504).json({
                                    error: err
                                });
                            })
                    };
                })
            };
        })
        .catch(err => {
            res.status(500).json(err)
        })
}

exports.logIn = (req, res) => {
    User
        .findOne({ username: req.body.username })
        .then(user => {
            //console.log(user.length)
            if (!user) {
                console.log('type: Not exists user')
                return res.status(200).json({ type: 'Not exists user' })
            } else {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (result) {
                        const token = jwt.sign({
                            userId: user._id
                        }, process.env.JWT_KEY, {
                            expiresIn: '365d'
                        })
                        user.token = token
                        user.save()
                        console.log(user)
                        ///////////
                        // const decoded = jwt.verify(user.token, process.env.JWT_KEY)
                        // console.log('DECODE ' + decoded.username)
                        //////////////            
                        return res.status(200).json({
                            type: 'login successful',
                            user: user
                            //length: user.listLikedPostId.length
                        })
                    }
                    console.log('type: login fail')
                    return res.status(200).json({ type: 'Login fail' })
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}

exports.userGetAll = (req, res) => {
    User
        .find()
        .then(data => {
            res.status(200).json({
                message: 'getAll',
                user: data
            })
        })
}

exports.userGetOne = (req, res) => {
    User
        .findOne({ _id: req.params.userId })
        .then(user => {
            res.status(200).json({
                message: "getOne",
                User: user
            })
            console.log(user)
        })
        .catch(err => {
            res.status(500).json(err)
        })

}

exports.userChangePassword = (req, res) => {
    User
        .findOne({ _id: req.params.userId })
        .then(user => {
            bcrypt.compare(req.body.oldPassword, user.password, (err, result) => {
                if (result) {
                    bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                        user.password = hash
                        user.save()
                    })
                    return res.status(200).json({ message: 'Change password successful' })
                }
                res.status(200).json({ message: 'Old password does not match' })
            })
        })
}

exports.userDeleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        if (user.cloudinary_id != undefined) {
            await cloudinary.uploader.destroy(user.cloudinary_id)
        }
        //console.log(user.cloudinary_id)
        user.remove()
        res.status(200).json({
            message: 'Deleted'
        })
    } catch (error) {
        console.log(error)
    }
}

exports.userLikePost = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const post = await Post.findById(req.params.postId)

        for (let i = 0; i < user.listLikedPostId.length; i++) {
            if (user.listLikedPostId[i].equals(post._id)) {
                console.log(user.listLikedPostId[i])
                console.log(post._id)
                console.log("user liked post")
                res.status(200).json({
                    message: 'user liked post'
                })
                return;
            }
        }
        await user.listLikedPostId.push(post._id)
        await post.listLikedUserId.push(user._id)
        await user.save()
        await post.save()
        console.log("done")
        res.status(200).json({
            message: 'done',
            newList: user.listLikedPostId
        })
    } catch (error) {
        console.log(error)
    }
}

exports.userUnlikePost = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const post = await Post.findById(req.params.postId)

        //deleteUserId
        let x = await post.listLikedUserId.indexOf(user._id)
        post.listLikedUserId.splice(x, 1)
        await post.save()

        //deletePostId
        let y = await user.listLikedPostId.indexOf(post._id)
        user.listLikedPostId.splice(y, 1)
        await user.save()

        res.status(200).json({
            message: 'done',
            newList: user.listLikedPostId
        })
    } catch (error) {
        console.log(error)
    }
}

exports.userCommentPost = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const post = await Post.findById(req.params.postId)
        post.listUserIdCommented.push(user._id)
        post.listCommentContent.push(req.body.comment)
        let comment = user.fullName + ": " + req.body.comment
        post.listComment.push(comment)
        await post.save()
        res.status(200).json({
            message: 'comment success',
            newList: post.listComment
        })
    } catch (error) {
        res.status(200).json({
            error
        })
        console.log(error)
    }
}

exports.logout = (req, res) => {
    User
        .findOne({ _id: req.params.userId })
        .then(user => {
            user.token = undefined
            user.save()
            res.status(200).json({
                message: 'Logout successful',
                token: user.token
            })
        })
        .catch(err => {
            res.status(500).json({
                err: err
            })
        })
}

exports.upAvatar = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const user = await User.findById(req.params.userId)
        if (user.cloudinary_id != undefined) {
            await cloudinary.uploader.destroy(user.cloudinary_id)
        }
        user.avatar = result.secure_url
        user.cloudinary_id = result.public_id
        await user.save()
        res.status(200).json({
            message: "Up avatar successful",
            avatar: user.avatar
        })
    } catch (error) {
        res.status(200).json({
            message: "err",
            error: error
        })
        console.log(error)
    }
}

exports.update = async (req, res) => {
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true })
        await updateUser.save()
        console.log(updateUser)
        res.status(200).json({
            message: "Update successful",
            fullName: updateUser.fullName,
            email: updateUser.email
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error
        })
    }
}

// exports.forgotPasswordtoGmail = async (req, res, next) => {
//     waterfall([
//         function (done) {
//             crypto.randomBytes(3, (err, buf) => {
//                 if (err) throw err;
//                 const token = buf.toString('hex');
//                 done(err, token)
//             });
//         },

//         function (token, done) {
//             User.findOne({ email: req.body.email }, function (err, user) {
//                 if (!user) {
//                     return res.status(200).json({
//                         type: 'fail',
//                         message: 'No account with that email address exists'
//                     });
//                 }
//                 user.resetToken = token;
//                 user.resetTokenExpires = Date.now() + 360000; //1 hour

//                 user.save(function (err) {
//                     done(err, token, user)
//                 });
//             });
//         },

//         function (token, user, done) {
//             const transporter = nodemailer.createTransport({
//                 service: 'Gmail',
//                 auth: {
//                     user: process.env.GMAIL_USER,
//                     pass: process.env.GMAIL_PASSWORD
//                 }
//             });

//             const mailOptions = {
//                 from: '17520631@gm.uit.edu.vn',
//                 to: user.email,
//                 subject: 'Renew your password !!',
//                 text: 'Your verify string: ' + token
//             };
//             transporter.sendMail(mailOptions, function (err, data) {
//                 if (err) {
//                     console.log('Error occurs: %s', err);
//                     return res.status(401).json({
//                         error: err
//                     });
//                 } else {
//                     console.log('Email sent to ' + user.email + '. Please check your mail please ..');
//                     return res.status(200).json({
//                         type: 'success',
//                         message: 'Email sent to ' + user.email + '. Please check your mail please ..'
//                     });
//                 }
//             });
//         }
//     ]);
// },

// exports.forgotPasswordCheck = async (req, res, next) => {
//     User.findOne({ email: req.body.email })
//         .then(user => {
//             if (user.resetToken === undefined || user.resetTokenExpires === undefined) {
//                 return res.status(200).json({
//                     type: 'fail',
//                     message: 'You haven\'t send any verification to renew your password'
//                 });
//             } else {
//                 if (Date.now > user.resetTokenExpires) {
//                     user.resetToken = undefined;
//                     user.resetTokenExpires = undefined;
//                     user.save();
//                     return res.status(200).json({
//                         type: 'fail',
//                         message: 'Sorry, your token expired date has been out of date. Please send your verify notification through url http://localhost/user/login/forgotpassword'
//                     });
//                 } else {
//                     if (req.body.token === user.resetToken) {
//                         user.password = bcrypt.hashSync(req.body.newpassword, saltNumber);
//                         user.resetToken = undefined;
//                         user.resetTokenExpires = undefined;
//                         user.save();
//                         return res.status(200).json({
//                             type: 'success',
//                             message: 'Your password has been changed successfully'
//                         });
//                     } else {
//                         return res.json({
//                             error: 'Your token is incorrect, check your mail again!!!'
//                         });
//                     }
//                 }
//             }
//         });
// },