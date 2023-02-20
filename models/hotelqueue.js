const mongoose = require('mongoose');

const hotelqueueSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    room_type: {
        type: String,
        required: true
    },
    checkin_date: {
        type: String,
        required: true,
    },
    checkout_date: {
        type: String,
        required: true,
    },
    total_days: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
});

const HotelQueue = mongoose.model('HotelQueue', hotelqueueSchema);

module.exports = HotelQueue;
