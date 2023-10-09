const mongoose = require('mongoose')

const interface = {
  title: {
    type: String,
    required: [true, '課程名稱不可為空']
  },
  platform: {
    type: String,
    required: [true, '所屬平台不可為空']
  },
  tags: {
    type: [String],
    default: []
  },
  cover: {
    type: String,
    required: [true, '封面不可為空']
  },
  url: {
    type: String,
    required: [true, '課程網址不可為空']
  },
}
const option = {
  versionKey: false
}

const schema = new mongoose.Schema(interface, option)

const Course = mongoose.model('course', schema)

module.exports = Course