const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name:{type:String, required:true},
    author:{type:String, required:true},
    description:{type:String, required:true},
    price:{type:Number, required:true},
    image:{type:String},
    available:{type:String}

});

module.exports = mongoose.model("Products", bookSchema);
