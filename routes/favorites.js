var express = require('express');
var router = express.Router();

const response = require('../service/response')
const handleFetch = require('../service/handleFetch')
const isAuth = require('../middleware/isAuth')

const pagination = require('../service/pagination');
const Favorites = require('../models/Favorites');


// 課程收藏列表
router.get('/', isAuth, handleFetch(async(req,res,next) => {
  const { platform, size = 6, page = 1 } = req.body

  if(!platform) {
    return response.isEmpty(req, ['platform'], next)
  }
}))

// 收藏切換
router.post('/toggle/:courseId', isAuth, handleFetch(async(req,res,next) => {
  const { courseId } = req.params
  const collected = await Favorites.findOne({courseId})

}))


module.exports = router;
