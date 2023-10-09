var express = require('express');
var router = express.Router();

const response = require('../service/response')
const handleFetch = require('../service/handleFetch')
const isAuth = require('../middleware/isAuth')
const isAdmin = require('../middleware/isAdmin')

const KeyWord = require('../models/Keyword')

router.get('/admin', isAuth, isAdmin, handleFetch(async(req, res, next) => {
    const data = await KeyWord.find()
    response.success(200, res, data)
}))

// 修改 => 覆蓋全部
router.put('/admin', isAuth, isAdmin, handleFetch(async(req, res, next) => {
    const { words = [] } = req.body
    await KeyWord.deleteMany({})
    if(words.length) {
        await KeyWord.create(words.map(word => ({word})))
    }

    response.success(200, res, {msg: '修改成功'})
}));


module.exports = router;
