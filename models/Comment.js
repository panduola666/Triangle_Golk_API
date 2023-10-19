const mongoose = require('mongoose')

const interface = {
    userId: mongoose.Schema.ObjectId,
    courseId: mongoose.Schema.ObjectId,
    canEdit: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        required: [true, '完課證明不可為空']
    },
    showName: {
        type: Number,
        default: 1
    },
    score: {
        type: Number,
        required: [true, '課程評分不可為空']
    },
    content: {
        type: String,
        require: [true, '內容不可為空']
    },
    theme: {
        type: Number,
        default: 1
    },
    isPassed: {
        // -1:待審核 0:未通過 1:已通過
        type: Number,
        default: -1
      },
      failContent: {
        type: String,
        required: [true, '失敗原因不可為空']
      },
      likes: {
        type: [mongoose.Schema.ObjectId],
        default: []
      },
      likesNum: {
        type: Number,
        default: 0
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

const Comment = mongoose.model('comment', schema)

module.exports = Comment

// {
//     "id": 1,
//     "userId": 1,
//     "courseId": 1,
//     "canEdit": false,
//     "image": "https://images.unsplash.com/file-1635990755334-4bfd90f37242image?dpr=2&auto=format&fit=crop&w=416&q=60",
//     "showName": 1,
//     "score": 5,
//     "content": "<p>非常推薦這門課, 深入淺出我覺得剛剛好, 建議想學習 JS 的小夥伴可以試看看</p>",
//     "theme": 1,
//     "isPassed": 1,
//     "failContent": "",
//     "likes": [
//       1,
//       6,
//       8,
//       10,
//       11,
//       14
//     ],
//     "likesNum": 6,
//     "timer": 1693643063871
//   }