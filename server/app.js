const express = require('express')
// const multer = require('multer')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const { db, genid } = require("./db/config")
const port = 3000

app.get("/", (req, res) => {
    res.send("hello world")
})

//开放端口使用
app.all('*', function (req, res, next) {
    //设置跨域允许访问的类型
    res.header('Access-Control-Allow-Origin', '*');
    //设置前端带过来的访问请求头
    res.header('Access-Control-Allow-Headers', 'Content-Type,token');
    //设置请求方法
    res.header('Access-Control-Allow-Methods', '*');
    //设置参数传递的类型？是form-data形式还是json格式？
    // res.header('Content-Type', 'application/json;charset=utf-8');
    // 因为我还要上传图片，所以不能只用json格式,所以干脆不限制，让浏览器自动判断就行了。
    // res.header('Content-Type', 'multipart/form-data');
    next();
});

app.use(express.static(path.join(__dirname, 'public')))
//处理post请求,解析json数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 加入token验证
const ADMIN_TOKEN_PATH = "/_token"
app.all("*", async (req, res, next) => {
    if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
        let { token } = req.headers
        let admin_token_sql = "select * from `admin` where `token` = ?"
        let adminResult = await db.async.all(admin_token_sql, [token])
        if (adminResult.err != null || adminResult.rows.length == 0) {
            res.send({
                code: 403,
                msg: "请先登录"
            })
            return
        } else {
            next()
        }
    } else {
        next()
    }
})

app.use('/admin', require('./router/AdminRouter'))
app.use('/category', require('./router/CategoryRouter'))
app.use('/blog', require('./router/BlogRouter'))
app.use('/upload', require('./router/UploadRouter'))


app.listen(port, () => {
    console.log(`启动成功:http://localhost:${port}/`)
})