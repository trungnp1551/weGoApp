const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        //required: true
    },
    update_date: String,
    tag: String,
    locationURL: String,
    content: String,
    listImage:[],
    listCloudinary_id:[],
    listComment: [], 
    listUserIdCommented:[],
    //listSavedUserId: [],
    listLikedUserId: []
})

module.exports = mongoose.model('Post', postSchema)