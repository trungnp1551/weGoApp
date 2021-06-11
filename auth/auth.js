const jwt = require("jsonwebtoken")
const { findOne } = require("../models/user")

module.exports = async (req, res, next) => {
    try {
        //const token = req.headers.authorization.split(" ")[1]
        const token = req.headers.authorization

        const decoded = jwt.verify(token, process.env.JWT_KEY)
        console.log("DECODE: " + decoded)
        //console.log('123: '+ req.params.userId)
        //req.params.userId
        req.userData = decoded
        next()
    }
    catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "Auth failed due to token missing"
        })
    }
}