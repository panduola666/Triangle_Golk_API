const express = require('express');
const { isURL, isNumeric } = require('validator')

const router = express.Router()
const handleFetch = require('../service/handleFetch')
const response = require('../service/response');
const Comment = require('../models/Comment')

const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');
const pagination = require('../service/pagination');

// 前台

// 新增評價
router.post('/add', isAuth, handleFetch(async(req,res,next) => {
  const { courseId, image, showName, score, content, theme } = req.body

  if (!courseId) {
    return response.error(404, '請選擇一門課程來評價', next)
  }
  if(!image || !content ) {
    return response.isEmpty(req, ['image', 'content'], next)
  }
  if(!isURL(image)) {
    return response.error(404, '完課證明檔案格式錯誤', next)
  }
  const data = await Comment.create({
    userId: req.user._id,
    courseId, image, showName, score, content, theme})
  response.success(201, res, data)
}))
// 修改評價

// 課程內頁評價 - 依照 最新 or 最熱排序(分頁)
router.get('/:courseId/:sort', isAuth, handleFetch(async(req, res, next) => {
  const { courseId, sort } = req.params
  const option = {
    sort: {sort},
    filter: {courseId}
  }
  const data = await pagination(Comment, option, req, next)
  response.success(200, res, data)
}))

// 課程內頁評價點讚

// 後台

// 查看 - 依照審核狀態 日期間格查詢(分頁)
router.get('/admin', isAuth, isAdmin, handleFetch(async(req, res, next) => {
  const { isPassed = -1, startDate , endDate } = req.body

  if(![0, 1, -1].includes(isPassed)) {
   return response.isEmpty(req, ['isPassed'], next)
  }
  if(!isNumeric(isPassed)) {
    return response.error(400, 'isPassed 型別錯誤', next)
  }

  const option = {
    sort: {},
    filter: {isPassed}
  }

  if(startDate && endDate) {
    option.filter.timer =  {
      $gte: new Date(`${new Date(startDate).toLocaleDateString()} 00:00:00`).getTime(),
      $lte: new Date(`${new Date(endDate).toLocaleDateString()} 11:59:59`).getTime()
    }
  }

  const data = await pagination(Comment, option, req, next)
  response.success(200, res, data)
}))

// 修改審核結果

module.exports = router