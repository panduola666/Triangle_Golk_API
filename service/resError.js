const resError = {
  dev(err, res) {
    switch(err.message) {
      case 'invalid token':
        err.message = '此 token 無效'
        break
      case 'jwt expired':
        err.message = '請重新登入'
        break
      
        default:
          err.message = err.keyPattern ? Object.keys(err.keyPattern).map(item => `該 ${item} 已存在`).join('||') : err.message
          break
    }
    res.status(err.status).json({
      code: 'error',
      name: err.name,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  },
  production(err, res) {
    if(err.isOperational) {
      res.status(err.status).json({
        code: 'error',
        msg: err.message
      })
    } else {
      console.log('出現預期外的錯誤!', err);
      res.status(500).json({
        code: 'error',
        msg: '服務器內部錯誤'
      })
    }
  }
}

module.exports = resError