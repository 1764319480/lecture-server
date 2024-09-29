const express = require('express');
const userRouter = require('./user');
const managerRouter = require('./manager');
const db = require('../db/mongo')
const LectureModel = require('../db/LectureModel')
const app = new express();
const path = require('path');
const cors = require('cors');

db(() => {
    console.log('数据库连接成功！')
    // 每隔半分钟自动更新数据库
    setInterval(async () => {
        let today = new Date();
        let year = today.getFullYear();// 年份
        let month = today.getMonth() + 1;// 月份
        let date = today.getDate();// 日
        let hour = today.getHours();// 时
        let minute = today.getMinutes();// 分
        let lectureData = await LectureModel.find({ lec_status: { $ne: -1 } }).select({ lec_id: 1, lec_time: 1, _id: 0 });
        // console.log(lectureData);
        for (let k of lectureData) {
            // console.log(k.lec_time);
            let timeArray = k.lec_time.split(/[-:~;]/);
            // console.log(timeArray)
            if (year == Number(timeArray[0])) { // 判断年份
                if (month == Number(timeArray[1])) {// 判断月份
                    if (date == Number(timeArray[2])) {// 判断日
                        // 若timaArray[3]等于timeArray[5]，即开始和结束的小时相同，讲座将永远处于0状态（bug）
                        // 状态由报名中转进行中
                        if (hour > Number(timeArray[3]) && hour < Number(timeArray[5])) {// 开始到结束之间的小时
                            await LectureModel.updateOne({ lec_id: k.lec_id }, { lec_status: 0 });
                            return;
                        }
                        if (hour == Number(timeArray[3]) && minute >= Number(timeArray[4])) {// 等于开始的小时
                            await LectureModel.updateOne({ lec_id: k.lec_id }, { lec_status: 0 });
                            return;
                        }
                        if (hour == Number(timeArray[5]) && minute <= Number(timeArray[6])) {// 等于结束的小时
                            await LectureModel.updateOne({ lec_id: k.lec_id }, { lec_status: 0 });
                            return;
                        }
                        // 状态由进行中转已完结
                        if (hour == Number(timeArray[5]) && minute > Number(timeArray[6])) {// 等于结束的小时
                            await LectureModel.updateOne({ lec_id: k.lec_id }, { lec_status: -1 });
                            return;
                        }
                        if (hour > Number(timeArray[5])) {// 大于结束的小时
                            await LectureModel.updateOne({ lec_id: k.lec_id }, { lec_status: -1 });
                            return;
                        }
                    } else {
                        if (date > Number(timeArray[2])) {
                            await LectureModel.updateOne({ lec_id: k.lec_id }, { lec_status: -1 });
                        }
                    }
                } else {
                    if (month > Number(timeArray[1])) {
                        await LectureModel.updateOne({ lec_id: k.lec_id }, { lec_status: -1 });
                    }
                }
            } else {
                if (year > Number(timeArray[0])) {
                    await LectureModel.updateOne({ lec_id: k.lec_id }, { lec_status: -1 });
                    return;
                }
            }


        };
        // console.log('数据库已更新');
    }, 1000 * 30);
    // 检验token
    const noToken = ['/images', '/login', '/superLogin', '/allLecture', '/hotLecture', '/getUser', '/superList', '/getCarousel', '/isLogon', '/logon']
    function authenticationMiddleware(req, res, next) {
        const token = req.headers['authorization'];
        let skipAuth = false; // 用于跟踪是否需要跳过token验证
        for (let k of noToken) {
          if (req.path.startsWith(k)) {
            skipAuth = true; 
            next(); 
            return; 
          }
        }
        // 如果没有找到匹配路径且没有token，则返回401错误
        if (!skipAuth && !token) {
          return res.status(401).send('Unauthorized');
        }
        next();
      } 
      // 使用中间件
      app.use(authenticationMiddleware);
    // 静态资源目录
    app.use(express.static(path.join(__dirname, '../../public')));
    app.use(userRouter);
    app.use(managerRouter);
    app.use(cors())
    app.listen(3000, () => {
        console.log('服务已启动...');
    })
})
