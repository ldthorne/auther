'use strict';

var router = require('express').Router(),
    _ = require('lodash');

var HttpError = require('../../utils/HttpError');
var User = require('./user.model');

function findOrCreate(model, properties) {
    return model.findOne(properties).exec().then(function(instance) {
        if (instance) return instance; // --> promise for found instance
        return model.create(properties); // --> promise for created instance
    });
}

router.param('id', function(req, res, next, id) {
    User.findById(id).exec()
        .then(function(user) {
            if (!user) throw HttpError(404);
            req.requestedUser = user;
            next();
        })
        .then(null, next);
});

router.get('/', function(req, res, next) {
    User.find({}).exec()
        .then(function(users) {
        		console.log("This is the req session userId",req.session.userId);
            res.json(users);
        })
        .then(null, next);
});

router.post('/signup', function(req, res, next) {
    findOrCreate(User, req.body)
        .then(function(user){
        	console.log("user created", user);
        	if (!req.session.userId) req.session.userId = user._id;
          res.status(201).json(user);
        }).then(null, function(user){
        	console.log("user was not successfully", user)
        	next();
        })
});

router.post('/login', function(req, res, next) {
    User.findOne(req.body)
        .then(function(user) {
            // console.log(user);
            if(!user){
                res.status(401).json(user);
            } else {
                if (!req.session.userId) req.session.userId = user._id;
                console.log("This is the req session userId",req.session.userId);
                res.status(201).json(user);
            }
        }).then(null, next);
});

router.get('/logout', function(req, res, next) {
    if (req.session.userId) { 
    	req.session.destroy();
    	console.log("Made it here !!!! !!!! !!!!")
    	res.status(201).send();
    } else {
    	res.status(401).send("You're not logged in! How are we gonna log you out?")
    }
});

router.get('/:id', function(req, res, next) {
    req.requestedUser.getStories()
        .then(function(stories) {
            var obj = req.requestedUser.toObject();
            obj.stories = stories;
            res.json(obj);
        })
        .then(null, next);
});

router.put('/:id', function(req, res, next) {
    _.extend(req.requestedUser, req.body);
    req.requestedUser.save()
        .then(function(user) {
            res.json(user);
        })
        .then(null, next);
});

router.delete('/:id', function(req, res, next) {
    req.requestedUser.remove()
        .then(function() {
            res.status(204).end();
        })
        .then(null, next);
});

module.exports = router;
