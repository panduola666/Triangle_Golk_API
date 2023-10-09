// 小知識: async 本身也是 Promise
const handleFetch = function(fn) {
  return function(req, res ,next) {
    // catch 統一處理
    fn(req, res ,next)
    .catch(err => next(err))
  }
}

module.exports = handleFetch