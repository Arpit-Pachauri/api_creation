const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const book=Schema({
    title: String,
    author: String,
    pages: Number,
    genres: [{type: String}],
    rating: Number
});
module.exports=mongoose.model("books",book);
