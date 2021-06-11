const mongoose = require('mongoose')

const cloudinary = require('../routers/cloudinary')
const Post = require('../models/post')
const User = require('../models/user')

exports.getAll = (req, res) => {
    Post
        .find()
        .then(data => {
            res.status(200).json({
                message: 'getAll',
                data
            })
        })
}

exports.getOne = (req, res) => {
    Post
        .findById(req.params.postId)
        .then(data => {
            res.status(200).json({
                message: 'getOne',
                data
            })
        })
}

exports.createAPost = async (req, res) => {
    try {
        var today = new Date()
        let now = today.getFullYear() + "." + (today.getMonth() + 1) + "." + today.getDate() + " at " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        const post = new Post({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            update_date: now,
            tag: req.body.tag,
            locationURL: req.body.locationURL,
            content: req.body.content,
        })
        req.files.map(async file => {
            const result = await cloudinary.uploader.upload(file.path)
            post.listImage.push(result.secure_url)
            post.listCloudinary_id.push(result.public_id)
            await post.save()
        })
        res.status(200).json({
            message: "post successful",
            post
        })
    } catch (error) {
        console.log(error)
    }
}

exports.update = async (req, res) => {
    try {
        const updatePost = await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true })
        updatePost.save()
        console.log(updatePost)
        res.status(200).json({
            type: "update",
            message: "Update successful",
            updatePost
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error
        })
    }
}

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)

        for (let i = 0; i < post.listLikedUserId.length; i++) {
            const user = await User.findById(post.listLikedUserId[i])
            let y = await user.listLikedPostId.indexOf(post._id)
            user.listLikedPostId.splice(y, 1)
            await user.save()
        }

        for (let i = 0; i < post.listCloudinary_id.length; i++) {
            await cloudinary.uploader.destroy(post.listCloudinary_id[i])
        }
        post.remove()
        res.status(200).json({
            message: "deleted"
        })
    } catch (error) {
        console.log(error)
    }
}