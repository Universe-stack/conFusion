const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({

    rating: {
        type: Number,
        required:true,
    },
    comment: {
        type:String,
        required:true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type:Date,
    },
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }

}, {
    timestamps:true
});

var Comments = mongoose.model('Comment', commentSchema);

module.exports= Comments;