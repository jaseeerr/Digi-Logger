const mongoose = require('mongoose')
const Schema = mongoose.Schema

const attendanceSchema = new Schema({
    
    sid:String,
    checkin:Array,
    checkout:Array,
    attendance:Number,
    limit:Number,
    limitexpire:Date

   
})





module.exports = mongoose.model('attendance',attendanceSchema)
