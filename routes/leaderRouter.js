const express = require("express");
const bodyParser = require("body-parser");

const leaderRouter=express.Router();
leaderRouter.use(bodyParser.json());


leaderRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next)=>{
    res.end("Would send all the results")
})
.post((req,res,next)=>{
    res.end('Will send the request:'+ req.body.name+ 'with details:'+ req.body.description)
})
.delete((req,res,next)=>{
    res.end('Deleting all the request')
});



leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    res.end('Will send the details of the leader of' + req.params.leaderId)
})
.post((req,res,next)=>{
    res.end('Will send the promo request:'+ req.body.name+ 'with details:'+ req.body.description)
})
.put((req,res,next)=>{
    res.end('Will update the promo request:'+ req.body.name+ 'with details:'+ req.body.description);
})
.delete((req,res,next)=>{
    res.end('Deleting all the request')
})


module.exports=leaderRouter;