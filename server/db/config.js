const mysql = require('mysql')
const GenId = require('../utils/SnowFlake')

const genid = new GenId({ WorkerId: 1 })
var db = mysql.createConnection({
    host: '43.142.29.78',
    port: '3306',
    user: 'NeRain',
    password: "20030904llh@.",
    database: 'blog'
})
db.connect((err) => {
    if (err) {
        console.log('数据库连接失败')
    } else {
        console.log('数据库连接成功')
    }
})
db.async = {} //创建一个空对象
db.async.all = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, rows) => {
            resolve({ err, rows })
        })
    })
}

module.exports = {
    db,
    genid
}
