const express = require('express');
const { isURL, isNumeric } = require('validator')

const router = express.Router()
const handleFetch = require('../service/handleFetch')
const response = require('../service/response');
const Apply = require('../models/Apply');

const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');
const pagination = require('../service/pagination');
const Course = require('../models/Course');

// 前台
// 搜索全部課程(需分頁 排序)

// 單一課程(外連接評論 + 同 tag 推薦)

// 申請新課
router.post('/apply',isAuth, handleFetch(async(req, res, next) => {
  const {title, platform, reason, url} = req.body
  if(!title || !platform || !reason || !url) {
    return response.isEmpty(req, ['title', 'platform', 'reason', 'url'], next)
  }
  if(!isURL(url)) {
    return response.error(400, 'url 需為網址格式', next)
  }
  await Apply.create({
    userId: req.user.id,
    title,
    platform,
    reason,
    url
  })
  response.success(201, res, {msg: '感謝您的推薦，我們將於 7 - 14 天內給予您答覆！'})
}))

// 後台

// 新增課程
router.post('/admin/add', isAuth, isAdmin, handleFetch(async(req,res,next) => {
  const {title, platform, tags, cover, url, rooms} = req.body
  if(!title || !platform || !cover || !url) {
    return response.isEmpty(req, ['title', 'platform', 'cover', 'url'], next)
  }
  if(!isURL(url)) {
    return response.error(400, 'url 需為網址格式', next)
  }
  const data = await Course.create({title, platform, tags, cover, url, rooms})
  response.success(201, res, data)
}))

// 修改課程

// 刪除課程

// 查看申請新課
router.get('/admin/apply',isAuth,isAdmin, handleFetch(async(req, res, next) => {
  const { isPassed = -1, startDate , endDate } = req.body

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

  const data = await pagination(Apply, option, req, next)

  response.success(200, res, data)
}))

// 審核申請新課 - 未通過
router.patch('/admin/apply/:id',isAuth,isAdmin, handleFetch(async(req, res, next) => {
  const { id } = req.params
  if(!id) {
    return response.error(404, '請選擇申請編號', next)
  }
  
  try{
    const data = await Apply.findByIdAndUpdate(id, {isPassed: 0})
    response.success(200, res , {msg: '修改成功'})
  } catch(err) {
    response.error(404, '查無此 id', next)
  }
}))

module.exports = router