const mongoose = require('mongoose');

let carouselSchema = mongoose.Schema({
    lec_id: String,
    img_id: String
})

let carouselsModel = mongoose.model('carousels', carouselSchema);

module.exports = carouselsModel;