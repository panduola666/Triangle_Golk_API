var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var logger = require('morgan');


require('./connections'); // 連接資料庫

const resError = require('./service/resError')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const keyWordsRouter = require('./routes/keyWords');
const courseRouter = require('./routes/course')

const app = express();

//  預期外的紅字錯誤 => 程式出現重大錯誤時
process.on('uncaughtException', (err) => {
    // err: 錯誤的物件資訊
    // 記錄錯誤下來，等到服務都處理完後，停掉該 process
    console.error('重大錯誤！');
  
    console.error(err.name);
    console.error(err.message);
    console.error(err.stack); // 可以追蹤到哪裡發生錯誤
  
    process.exit(1);
  });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// 路由新增
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/keyWords', keyWordsRouter);
app.use('/course', courseRouter);

// 404
app.use((req, res, next) => {
  res.status(404).json({
    code: 'error',
    msg: '查無此路由',
  });
});

// 如果 next 有帶參數, 則進此錯誤處理
app.use((err, req, res, next) => {
  console.log('統一錯誤管理');
  console.log('當前環境為:', process.env.NODE_ENV);
  err.status = err.status || 500
    // 開發模式
    if (process.env.NODE_ENV === 'dev') {
        resError.dev(err, res)
    }

    // 生產模式
    // 可預期錯誤
    if(err.name === 'ValidationError') {
        err.isOperational = true;
        const errKeys = Object.keys(err.errors)
        // 把每個錯誤資料抽出來
        err.message = errKeys.reduce((obj, item) => {
            const { properties: {message}  } =  err.errors[item]
            obj[item] = message
            return obj
        }, {})
        resError.production(err, res)
    }
   
    // 非預期錯誤
    resError.production(err, res)
});



// 未捕捉到的 catch
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
  // 記錄於 log 上
});

module.exports = app;
