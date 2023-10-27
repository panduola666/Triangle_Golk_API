const express = require('express');
const { isURL, isNumeric } = require('validator')

const router = express.Router()
const handleFetch = require('../service/handleFetch')
const response = require('../service/response');
const Comment = require('../models/Comment')
const Course = require('../models/Course')
const User = require('../models/User')

const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');
const pagination = require('../service/pagination');

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
router.patch('/admin/edit/:id', isAuth, isAdmin, handleFetch(async(req, res, next) => {
  const { id } = req.params
  if(!id) {
    return response.error(404, '請輸入要修改的評價 id', next)
  }

  const { isPassed , failContent = ''} = req.body
  switch(isPassed) {
    case 0: // 審核失敗
      if(!failContent) {
        return response.error(400, '請選擇錯誤原因', next)
      }

      break
    case 1: // 審核通過
    await Comment.findByIdAndUpdate(id)
      break
    default:
      return response.error(400, '錯誤操作', next)
      break
  }
}))


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
  response.success(201, res, {msg: '評價成功，我們將於 7-14 天內審核證明，若成功即可在課程頁面內查看自已的評價！'})
}))

// 修改評價
router.patch('/edit/:id', isAuth, handleFetch(async(req, res, next) => {
  const { id } = req.params
  if(!id) {
    return response.error(404, '請輸入要修改的評價 id', next)
  }
  
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
  await Comment.findByIdAndUpdate(id,{
    courseId, image, showName, score, content, theme})
  response.success(201, res, {msg: '修改完成'})
}))

// 課程內頁評價點讚
router.post('/like/:id', isAuth, handleFetch(async(req, res, next) => {
    const { id } = req.params
    const data = await Comment.findByIdAndUpdate(id, {
      $addToSet: {likes: req.user._id}
    })
  response.success(200, res, data)
}))

// 課程內頁評價 - 依照 最新 or 最熱排序(分頁)
router.get('/:courseId', isAuth, handleFetch(async(req, res, next) => {
  const { courseId } = req.params
  const {size = 5, page = 1, sort = 'timer' } = req.body

  const data = await Comment.find({courseId}).populate({path: 'userId', select: 'avatarId nickName'}).sort({[sort]: -1}).skip(size * (page - 1)).limit(size)
  response.success(200, res, data)
}))

module.exports = router