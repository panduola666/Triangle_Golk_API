var express = require('express');
const bcryptjs = require('bcryptjs')
const validator = require('validator');

var router = express.Router();
const response = require('../service/response')
const handleFetch = require('../service/handleFetch')

const User = require('../models/User');
const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');




// 修改用戶資料
router.patch('/',isAuth, handleFetch(async(req, res, next) => {
  const {avatarId, password, newPwd, checkPwd} = req.body

  // 頭像
  if(avatarId) {
    if(!validator.isNumeric(avatarId)) {
      return response.error(400, 'avatarId 型別錯誤', next)
    }
    if(Number(avatarId) === Number(req.user.avatarId)) {
      return response.success(200, res, {})
    }
    const user = await User.findByIdAndUpdate(req.user.id, {avatarId})
    response.success(200, res, {msg: '修改成功'})
  }

  // 密碼
  if(password) {
    if(!validator.isLength(password, {min: 8}) || !validator.isLength(newPwd, {min: 8}) || !validator.isLength(checkPwd, {min: 8})) {
      return response.error(400, '密碼最低 8 碼', next)
    }
    if(!validator.equals(newPwd, checkPwd)) {
      return response.error(400, '兩次密碼不一致', next)
    }
    if(validator.equals(password, newPwd)) {
      return response.error(400, '不可使用原密碼', next)
    }

    const user = await User.findById(req.user.id).select('+password')
    const auth = await bcryptjs.compare(password, user.password)
    if(!auth) {
      return response.error(400, '密碼錯誤', next)
    }
    req.body.newPwd = await bcryptjs.hash(newPwd, 12)
    await User.findByIdAndUpdate(req.user.id, {password: req.body.newPwd})
    response.success(200, res, {msg: '修改成功'})
  }

  response.error(400, '無可修改事項', next)
}))


// 後台增加用戶(普通 or 管理員)
router.post('/admin/addUser', isAuth, isAdmin, handleFetch((async(req, res, next) => {

    const { email, password, nickName, isAdmin } = req.body
    if(!email || !password || !nickName || !isAdmin) {
      return response.isEmpty(req, ['email', 'password', 'nickName', 'isAdmin'], next)
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
    if(!validator.isBoolean(isAdmin)) {
      return response.error(400, 'isAdmin 型別錯誤', next)
    }
  
    // 混淆密碼
    req.body.password = await bcryptjs.hash(password, 12)

    await User.create({
      email, 
      password: req.body.password, 
      nickName,
      isAdmin
    })

    response.success(201, res, {msg: '新增用戶成功'})
})))

// 刪除全部測試資料
router.delete('/', async(req, res) => {
  await User.deleteMany({})
  res.status(200).json({
    code: 'success',
    msg: '已刪除全部'
})
})

module.exports = router;
