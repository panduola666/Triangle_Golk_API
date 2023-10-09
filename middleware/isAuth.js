const jwt = require('jsonwebtoken');
const handleFetch = require('../service/handleFetch')
const response = require('../service/response');
const User = require('../models/User');

// 驗證 token
const isAuth = handleFetch(async (req, res, next) => {
  const { authorization } = req.headers
  if(!authorization || !authorization.startsWith('Bearer')) {
    return response.error(401, 'token 驗證失敗, 請重新登入', next)
  }

  const token = authorization.split(' ')[1]

  // 驗證 token 是否正確
  const payload = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err,payload) => {
      if(err) {
        reject(err)
      } else {
        resolve(payload)
      }
    })
  })
  console.log(payload);
  const user = await User.findById(payload.id)

  // 信箱遮蔽
  const { email } = user
  const replaceStr = email.substring(1, email.indexOf('@') - 1)
  user.email = email.replace(replaceStr, '*'.repeat(replaceStr.length))
  req.user = user
  console.log('token 驗證成功');
  next()
})

module.exports = isAuth