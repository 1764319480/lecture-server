const mongoose = require('mongoose');
// 创建集合中文档的属性
let lectureSchema = mongoose.Schema({
    lec_title: String,
    lec_id: String,
    lec_master: String,
    lec_time: String,
    lec_place: String,
    lec_detail: String,
    lec_type: String,
    lec_status: Number,//1 报名中；0 进行中；-1 已完结
    lec_num: Number,
    lec_length: Number,
    lec_people: Array,
    lec_sign: String//签到码
})
// 创建模型对象，对集合users进行操作
let lecturesModel = mongoose.model('lectures', lectureSchema);

module.exports = lecturesModel;