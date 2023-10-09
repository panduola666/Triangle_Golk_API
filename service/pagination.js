/**
 * 
 * @param {*} database 單一資料庫名稱
 * @param {*} filterOption 篩選方法
 * @returns 返回篩選後結果 + 分頁
 */
const pagination = async (database, filterOption, req) => {
  return await new Promise(async (resolve, reject) => {
      const { size = 5, page = 1 } = req.body
    
      const curPage = await database.find(filterOption).skip(size * (page - 1)).limit(size)
      const totalCount = await database.find(filterOption).count()
      const totalPage = Math.ceil(totalCount / size)
    
      if(page < 1 || page > totalPage) {
        const err = new Error('查無資料')
        err.status = 400
        reject(err)
      }
    
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
      resolve( data)
  })
}




module.exports = pagination