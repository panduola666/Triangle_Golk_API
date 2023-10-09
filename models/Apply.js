const mongoose = require('mongoose')

const interface = {
  userId: {
    type: mongoose.Schema.ObjectId,
    required: [true, '申請人 id 不可為空']
  },
  title: {
    type: String,
    required: [true, '課程名稱不可為空']
  },
  platform: {
    type: String,
    required: [true, '所屬平台不可為空']
  },
  reason: {
    type: String,
    required: [true, '申請原因不可為空']
  },
  isPassed: {
    // -1:待審核 0:未通過 1:已通過
    type: Number,
    default: -1
  },
  url: {
    type: String,
    required: [true, '課程網址不可為空']
  },
  timer: {
    type: Number,
    default: new Date().getTime()
  },
}
const option = {
  versionKey: false
}

const schema = new mongoose.Schema(interface, option)

const Apply = mongoose.model('apply', schema)

module.exports = Apply