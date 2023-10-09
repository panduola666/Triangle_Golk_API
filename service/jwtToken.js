const jwt = require('jsonwebtoken');
const response = require('./response')

// 註冊產生 token
function jwtToken(user, status, res) {

  const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY
  });
  const payload = jwt.verify(token, process.env.JWT_SECRET)

  response.success(status, res, {
    token,
    expires: payload.exp * 1000,
    msg: "登入成功"
  })

}

module.exports = jwtToken