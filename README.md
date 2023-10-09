## 開始
### 開發環境
```
npm run start:dev
```
### 生產環境
```
npm run start:pro
```

## 資料夾結構
### connections
mongoDB 連線專用

### middleware
isAdmin: 判斷是否為管理員權限
isAuth: 判斷是否在登入狀態

### models
mongo 資料的 schema 和 model 定義

### routers
各種路由分類

### service
response: response 統一處理
jwtToken: jwt token 生成
handleFetch: 將 catch 另外統一處理
resError: handleFetch 的統一錯誤處理