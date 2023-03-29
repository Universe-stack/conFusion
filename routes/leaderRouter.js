const express = require("express");
const bodyParser = require("body-parser");
var authenticate = require("../authenticate")

const mongoose =require("mongoose");


mongoose.Promise = global.Promise;
const Leaders =require('../models/leaders');

const leaderRouter=express.Router();
leaderRouter.use(bodyParser.json());


leaderRouter.route('/')
.get((req,res,next)=>{
    Leaders.find({})
    .then((leader)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json'); 
        res.json(leader)
    },(err)=>next(err))
    .catch((err)=> next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Leaders.create(req.body)
    .then((leader)=> {
        console.log('leader created', leader);
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json'); 
        res.json(leader)
    },(err)=>next(err))
    .catch((err)=> next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT not supported on /leaders')
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Leaders.remove({})
    .then((resp)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json'); 
        res.json(respr)
    },(err)=>next(err))
    .catch((err)=> next(err));
});



leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    Leaders.findById(req.params.leaderId)
    .then((leader)=> {
        if(req.params.leaderId){
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json'); 
            res.json(leader)
        }
    },(err)=>next(err))
    .catch((err)=> next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403;
    res.end('POST not supported on /leaders/:leaderId')
})
.put(authenticate.verifyUser,(req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderId,
        {
            $set:req.body
        }, {new: true}
    )
    .then((leader)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=> next(err))
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json'); 
        res.json(respr)
    },(err)=>next(err))
    .catch((err)=> next(err));
})


module.exports=leaderRouter;