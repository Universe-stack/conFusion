const express= require("express");

const bodyParser = require("body-parser");

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());


promoRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send all the promotions details')
})
.post((req,res,next)=>{
    res.end('Will send the promo request:'+ req.body.name+ 'with details:'+ req.body.description)
})
.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT not supported on /promos')
})
.delete((req,res,next)=>{
    res.end('Deleting all the prom request')
});

//promoID

promoRouter.route('/:promoId')
.get((req,res,next)=>{
    res.end('Will send the details of the' + req.params.promoId);
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('Post req does not work on this route');
})
.put((req,res,next)=>{
    res.end('Will update the promo request:'+ req.body.name+ 'with details:'+ req.body.description);
})
.delete((req,res,next)=>{
    res.end('Deleting the'+ req.params.promoId+ 'prom request')
})

module.exports=promoRouter;