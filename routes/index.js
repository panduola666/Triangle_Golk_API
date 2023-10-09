var express = require('express');
const bcryptjs = require('bcryptjs')
const validator = require('validator');
var router = express.Router();

const response = require('../service/response');
const handleFetch = require('../service/handleFetch');
const jwtToken = require('../service/jwtToken')


const User = require('../models/User');
const isAuth = require('../middleware/isAuth');

/* 註冊 */
router.post('/register', handleFetch(async(req, res, next) => {
  const { email, password, nickName } = req.body
  if(!email || !password || !nickName) {
    return response.isEmpty(req, ['email', 'password', 'nickName'], next)
  }
  if(!validator.isEmail(email)) {
    return response.error(400, '信箱格式錯誤', next)
  }
  if(!validator.isLength(password, {min: 8})) {
    return response.error(400, '密碼最低 8 碼', next)
  }
  if(!validator.isLength(nickName, {max: 5})) {
    return response.error(400, '暱稱最多 5 個字元', next)
  }

  // 混淆密碼
  req.body.password = await bcryptjs.hash(password, 12)

  const user = await User.create({
    email, 
    password: req.body.password, 
    nickName
  })
  response.success(201, res, {msg: '註冊成功'})

  // jwtToken(user, 201, res)
}));

/* 登入 */
router.post('/login', handleFetch(async(req, res, next) => {
    const {email, password} = req.body; // 獲取 body 資料

    if(!email || !password) {
      return response.isEmpty(req, ['email', 'password'], next)
    }
    if(!validator.isEmail(email)) {
      return response.error(400, '信箱格式錯誤', next)
    }
    if(!validator.isLength(password, {min: 8})) {
      return response.error(400, '密碼最低 8 碼', next)
    }

    const user = await User.findOne({email}).select('+password')

    if(!user) {
      return response.error(404, '查無此用戶', next)
    }
    const auth = await bcryptjs.compare(password, user.password)
    if(!auth) {
      return response.error(400, '密碼錯誤', next)
    }
    jwtToken(user, 200, res)
  })
);

// 確認登入狀態
router.post('/checkLogin',isAuth, handleFetch(async(req, res ,next) => {
  const { avatars, avatarId, nickName, totalCheckIn, isAdmin, email } = req.user

  const data = {
    email,
    avatars,
    avatarId,
    nickName,
    totalCheckIn,
    isAdmin
  }
  response.success(200, res, data)
}))


// 忘記密碼 -> 會寄信到信箱



module.exports = router;
