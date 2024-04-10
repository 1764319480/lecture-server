const express = require('express');
const userRouter = require('./user');
const managerRouter = require('./manager');
const db = require('../db/mongo')
const UserModel = require('../db/UserModel');
const LectureModel = require('../db/LectureModel')
const app = new express();

db(() => {
    console.log('数据库连接成功！')
    // 每隔一分钟自动更新数据库
    setInterval(async () => {
        let today = new Date();
        let month = today.getMonth() + 1;// 月份
        let date = today.getDate();// 日
        let hour = today.getHours();// 时
        let minute = today.getMinutes();// 分
        let lectureData = await LectureModel.find({lec_status: {$ne: -1}}).select({lec_id: 1, lec_time: 1, _id: 0});
        // console.log(lectureData);
        for (let k of lectureData) {
            // console.log(k.lec_time);
            let timeArray = k.lec_time.split(/[-:~;]/);
            // console.log(timeArray)
            if (Number(timeArray[1]) == month) {// 判断月份
                if (Number(timeArray[2]) == date) {// 判断日
                    if (hour >= Number(timeArray[3]) && minute >= Number(timeArray[4])) {// 大于开始时间
                        if (hour <= Number(timeArray[5]) && minute <= Number(timeArray[6])) {// 小于结束时间
                            await LectureModel.updateOne({lec_id: k.lec_id}, {lec_status: 0});
                        } else {
                            await LectureModel.updateOne({lec_id: k.lec_id}, {lec_status: -1});
                        }
                    }
                } else {
                    if (date > Number(timeArray[2])) {
                        await LectureModel.updateOne({lec_id: k.lec_id}, {lec_status: -1});
                    }
                }
            } else {
                if (month > Number(timeArray[1])) {
                    await LectureModel.updateOne({lec_id: k.lec_id}, {lec_status: -1});
                }
            }

        };
        // console.log('数据库已更新');
    }, 1000*60);
    
    app.use(userRouter);
    app.use(managerRouter);
    app.listen(3000, () => {
        console.log('服务已启动...');
    })
})
