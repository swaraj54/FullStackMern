const mongoose = require('mongoose');

const User = new mongoose.Schema(
    {
        name:{type:String, required: true},
        email:{type:String, required: true , unique:true},
        password:{type:String, required: true}, 
        quote:{type:String}, 
        products:[{name:String, author:String, description:String, price:Number,image:String}]
    },
    {collection:'user-data'}
)
const model  = mongoose.model('UserData', User)

module.exports = model;