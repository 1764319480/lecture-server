const mongoose = require('mongoose');

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

let lecturesModel = mongoose.model('lectures', lectureSchema);

module.exports = lecturesModel;