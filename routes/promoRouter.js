const express= require("express");
const bodyParser = require("body-parser");
const mongoose =require("mongoose");
var authenticate= require("../authenticate");

const cors = require('./cors')


mongoose.Promise = global.Promise;
const Promotions =require('../models/promotions');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());


promoRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{ res.sendStatus(200)})
.get(cors.cors,(req,res,next)=>{
    Promotions.find({})
    .then((promos)=> {
        console.log("dishes found", promos)
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
   },(err)=>next(err))
   .catch((err)=> next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.create(req.body)
    .then((promos)=> {
        console.log('Promotions made', promos);
        res.json(promos);
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
   },(err)=>next(err))
   .catch((err)=> next(err))
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT not supported on /promos')
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.remove({})
    .then((resp)=> {
        console.log('Promotions deleted', resp);
        res.json(resp);
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
   },(err)=>next(err))
   .catch((err)=> next(err))
});

//promoID

promoRouter.route('/:promoId')
.options(cors.corsWithOptions,(req,res)=>{ res.sendStatus(200)})
.get(cors.cors,(req,res,next)=>{
   Promotions.findById(req.params.promoId)
   .then((promos)=> {
    res.statusCode =200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promos);
},(err)=>next(err))
.catch((err)=> next(err))
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end('Post req does not work on this route');
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promoId,
        {
            $set:req.body
        }, {new: true}
    )
    .then((promos)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    },(err)=>next(err))
    .catch((err)=> next(err))
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.findByIdAndDelete(req.params.promoId)
    .then((resp)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=> next(err))
})

module.exports=promoRouter;