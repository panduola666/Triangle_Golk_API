// 自訂錯誤
const response = {
  isEmpty(req, required = [], next) {
    // required 傳入必填的欄位
    const msg = required.reduce((arr, key) => {
      req.body[key] ? '' : arr.push(`${key} 欄位缺失`)
       return arr
     }, [])
     if(msg.length) {
      this.error(400, msg.join('||'), next)
     }
  },
  success(status, res, data){
    res.status(status).json({
      code: 'success',
      data
  })
  },
  error(status, msg, next) {
    const err = new Error(msg);
  err.status = status;
  err.isOperational = true; // 是否為可預期錯誤

  next(err)
  }
}


module.exports = response;