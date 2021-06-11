const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')

const userRouter = require('./routers/user')
const postRouter = require('./routers/post')

mongoose
    .connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('mongo connected')
    })
    .catch(err => {
        console.log(err);
        console.log('connect fail')
    });

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/user',userRouter)
app.use('/post',postRouter)


module.exports = app