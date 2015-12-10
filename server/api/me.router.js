var router = require('express').Router();
var _ = require('lodash');

var HttpError = require('../utils/HttpError');
var Story = require('./stories/story.model');
var User = require('./users/user.model');

router.post("/me", function(req,res,next){
	User.findOne({id:req.session.userId})
		.then(function(user){
			res.status(201).json(user);
		}).then(null, next)
})

module.exports = router;