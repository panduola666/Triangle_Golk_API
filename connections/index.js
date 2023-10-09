const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const { DATABASE, DATABASE_PASSWORD } = process.env
const DB = DATABASE.replace('<password>', DATABASE_PASSWORD)

mongoose.connect(DB)
.then(() => console.log('資料庫連接成功'))