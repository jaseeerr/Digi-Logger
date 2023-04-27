const mongoose = require('mongoose')
const Schema = mongoose.Schema

const signupSchema = new Schema({
    name:String,
    phone:String,
    batch:String,
    password:String,
    domain:String,
    block:Boolean
   
})





module.exports = mongoose.model('users',signupSchema)
