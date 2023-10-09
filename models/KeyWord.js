const mongoose = require('mongoose')

const interface = {
    word:{
        type: String,
        required: [true, '關鍵字不可為空'],
    }
}
const option = {
    versionKey: false
}

const schema = new mongoose.Schema(interface, option)

const KeyWord = mongoose.model('keyword', schema)

module.exports = KeyWord