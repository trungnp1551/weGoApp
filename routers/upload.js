const multer = require("multer")
const path = require("path")
const cloudinary = require('./cloudinary')

/** Storage Engine */
const storageEngine = multer.diskStorage({
    cloudinary,
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname)
    }
})

//init
const upload = multer({
    storage: storageEngine,
    allowedFormats: ['jpg','png'],
    limits: { fileSize: 1024 * 1024 * 5 },
    // fileFilter: function (req, file, callback) {
    //     validateFile(file, callback)
    // }
})

// const validateFile = function (file, cb) {
//     let allowedFileTypes = /jpeg|jpg|png|gif/;
//     const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimeType = allowedFileTypes.test(file.mimetype);
//     if (extension && mimeType) {
//         return cb(null, true);
//     } else {
//         cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.");
//     }
// };

module.exports = upload;