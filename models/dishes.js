const mongoose= require('mongoose');
const Schema = mongoose.Schema;

//The structure of the react client data model is different from this. It doesn't contain comments as a sub model but rather
//...features it as an individual model while attaching dishes id to each comment
// const commentSchema = new Schema({

//     rating: {
//         type: Number,
//         required:true,
//     },
//     comment: {
//         type:String,
//         required:true
//     },
//     author: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     date: {
//         type:Date,
//     }

// });

const dishSchema= new Schema(

{
    name: {
        type: String,
        required: true,
        unique:true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    label:{
        type:String,
        default:''
    },
    price:{
        type:String,
        required:true,
        
    },
    featured:{
        type:String,
        required:false
    },
    
    //comments: [commentSchema]
},
{
    timestamps:true

}
);

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;