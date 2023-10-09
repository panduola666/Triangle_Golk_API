const express = require('express');
const { isURL } = require('validator')

const router = express.Router()
const handleFetch = require('../service/handleFetch')
const response = require('../service/response');
const Apply = require('../models/Apply');

const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');
const pagination = require('../service/pagination');

// 前台-申請新課
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

// 後台-查看申請新課
router.get('/apply',isAuth,isAdmin, handleFetch(async(req, res, next) => {
  const { isPassed = -1, startDate , endDate } = req.body

  const filter = {isPassed}
  if(startDate && endDate) {
    filter.timer =  {
      $gte: new Date(`${new Date(startDate).toLocaleDateString()} 00:00:00`).getTime(),
      $lte: new Date(`${new Date(endDate).toLocaleDateString()} 11:59:59`).getTime()
    }
  }

  const data = await pagination(Apply, filter, req, next)

  response.success(200, res, data)
}))

module.exports = router