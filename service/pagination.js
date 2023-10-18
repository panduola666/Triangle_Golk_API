/**
 * 
 * @param {*} database 單一資料庫名稱
 * @param {*} option 篩選/排序方法
 * @returns 返回篩選後結果 + 分頁
 */
const pagination = async (database, option, req) => {
  return await new Promise(async (resolve, reject) => {
    const { size = 5, page = 1 } = req.body
    const {sort = {}, filter = {}} = option
    
      const curPage = await database.find(filter).sort(sort).skip(size * (page - 1)).limit(size)
      const totalCount = await database.find(filter).count()
      const totalPage = Math.ceil(totalCount / size)

      const data = {
        data: curPage,
        pagination: {
          totalCount,
          page,
          hasPre: page > 1,
          hasNext: page < totalPage,
          totalPage 
        }
      }

      // 當前無資料
      if(!totalCount) {
        resolve(data)
      }
    
      // 超過頁數
      if(page < 1 || page > totalPage) {
        const err = new Error('查無資料')
        err.status = 400
        reject(err)
      }
    
      
      resolve( data)
  })
}




module.exports = pagination