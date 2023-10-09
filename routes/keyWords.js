var express = require('express');
var router = express.Router();

const response = require('../service/response')
const handleFetch = require('../service/handleFetch')
const isAuth = require('../middleware/isAuth')

const KeyWord = require('../models/Keyword')
// 新增
router.post('/', isAuth, handleFetch(async(req, res, next) => {
    const { word } = req.body
    
    if(!word) response.isEmpty(req, ['word'], next)

    const data = await KeyWord.create({
        word: req.body.word
    })

    response.success(200, res, data)
}));


// 刪除
router.delete('/:id', async(req, res, next) => {
    const { id } = req.params
});







// 刪除全部測試資料
router.delete('/', async(req, res, next) => {
    await KeyWord.deleteMany({})
    res.status(200).json({
        code: 'success',
        msg: '已刪除全部'
    })
});

module.exports = router;
