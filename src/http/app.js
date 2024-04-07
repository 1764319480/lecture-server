const express = require('express');
const userRouter = require('./user');
const db = require('../db/mongo')

const app = new express();

db(() => {
    console.log('数据库连接成功！')
    app.use(userRouter);
    app.listen(3000, () => {
        console.log('服务已启动...');
    })
})
