const handleFetch = require('../service/handleFetch')
const response = require('../service/response');

const isAdmin = handleFetch(async(req, res, next) => {
  if(!req.user.isAdmin) {
    return response.error(403, '僅管理員可操作', next)
  } 
  next()
})

module.exports = isAdmin