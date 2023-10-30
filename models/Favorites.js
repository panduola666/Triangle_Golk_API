const mongoose = require('mongoose')

const interface = {
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  },
  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'course',
    required: [true, '請選擇要收藏的課程']
  },
}
const option = {
    versionKey: false
}

const schema = new mongoose.Schema(interface, option)

const Favorites = mongoose.model('favorites', schema)

module.exports = Favorites