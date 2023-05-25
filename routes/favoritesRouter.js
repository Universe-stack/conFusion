const express = require('express');
const bodyParser = require('body-parser');

const Favorites = require('../models/favorites');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoritesRouter = express.Router();

favoritesRouter.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


favoritesRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate('user')
      .populate('dishes')
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
      })
      .catch((err) => next(err));
  })
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Favorites.findOne({ user: req.user._id })
    .then((favorites) => {
      if (favorites) {
        for (let dish of req.body) {
          if (favorites.dishes.indexOf(dish._id) === -1) {
            favorites.dishes.push(dish._id);
          }
        }
        favorites.save()
          .then((favorites) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
          })
          .catch((err) => next(err));
      } else {
        Favorites.create({ user: req.user._id, dishes: req.body })
          .then((favorites) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Favorites.findOneAndRemove({ user: req.user._id })
    .then((response) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
    })
    .catch((err) => next(err));
});

favoritesRouter.route('/:dishId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors,authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({user: req.user._id})
    .then((favorites)=>{
      if(!favorites){
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        return res.json({"exists":false, "favorites":favorites})
      }else {
        if(favorites.dishes.indexOf(req.params.dishId)<0){
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          return res.json({"exists":false, "favorites":favorites})
        }
        else{
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          return res.json({"exists":true, "favorites":favorites})
        }
      }

    }, (err)=>next(err))
    .catch((err)=>next(err))
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then((favorites) => {
        if (favorites) {
          if (favorites.dishes.indexOf(req.params.dishId) === -1) {
            favorites.dishes.push(req.params.dishId);
            favorites.save()
              .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
              })
              .catch((err) => next(err));
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
          }
        } else {
          Favorites.create({ user: req.user._id, dishes: [req.params.dishId] })
            .then((favorites) => {
              //favorites.dishes.push({"id":req.params.dishId});
              //favorites.save;
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorites);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
.delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
  Favorites.findOne({ user: req.user._id })
  .then((favorites) => {
    if (favorites != null && favorites.dishes.indexOf(req.params.dishId) !== -1) {
      favorites.dishes.remove(req.params.dishId);
      favorites.save()
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
      }, (err) => next(err))
      .catch((err) => next(err));
    } else {
      const err = new Error(`Dish ${req.params.dishId} not found in your favorites!`);
      err.status = 404;
      return next(err)
    }
})
})

module.exports= favoritesRouter;