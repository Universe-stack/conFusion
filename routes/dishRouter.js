const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json())

dishRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send all the details')
})
.post((req,res,next)=>{
    res.end('Will send the request:'+ req.body.name+ 'with details:'+ req.body.description)
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT not supported on /dishes')
})
.delete((req,res,next)=>{
    res.end('Deleting all the request')
});


//dishes/dishId
dishRouter.route('/:dishId')
.get((req,res,next)=>{
    res.end('Will send all the details of the dish of' + req.params.dishId)
})
.post((req,res,next)=>{
    res.end('POST not supported on /dishes/:dishId');
})
.put((req,res,next)=>{
    res.write('Updating the dish:'+ req.params.dishId)
    res.end('Will update the dish' + req.body.name+ 'with details:' + req.body.description);
})
.delete((req,res,next)=>{
    res.end('Deleting dish' + req.params.dishId);
})



module.exports= dishRouter;