const mongoose = require('mongoose')

const interface = {
  email: {
    type: String,
    required: [true, '信箱不可為空'],
    unique: true, // 唯一性
  },
  password: {
    type: String,
    required: [true, '密碼不可為空'],
    select: false // 禁止 find() 顯示
  },
  avatars: [Number],
  avatarId: {
    // 等頭像建好要給 id
    type: Number,
    default: 4
  },
  nickName: {
    type: String,
    required: [true, '暱稱不可為空'],
    maxLength: [5, '暱稱最多 5 個字']
  },
  totalCheckIn: {
    type: Number,
    default: 0
  },
  checkInTimer: {
    type: Number,
    default: 0
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}

const option = {
  versionKey: false
}

const schema = new mongoose.Schema(interface, option)

const User = mongoose.model('user', schema)

module.exports = User