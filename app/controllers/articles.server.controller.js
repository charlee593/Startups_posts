'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Article = mongoose.model('Article'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a article
 */
exports.create = function(req, res) {
	var article = new Article(req.body);
	article.user = req.user;
	console.log('Server: ');
	console.log(req.body);
	console.log('Addddd: ');
	console.log(article);
	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
	res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
	var article = req.article;

	article = _.extend(article, req.body);

	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
	var article = req.article;

	article.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
	Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(articles);
			res.json(articles);
		}
	});
};

/**
 * Article middleware
 */
exports.articleByID = function(req, res, next, id) {
	Article.findById(id).populate('user', 'displayName').exec(function(err, article) {
		if (err) return next(err);
		if (!article) return next(new Error('Failed to load article ' + id));
		req.article = article;
		next();
	});
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.article.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};

/**
 * Article upvote middleware
 */
exports.vote = function(req, res) {
	if(req.params.like === 't'){
		if(req.user.likePost.indexOf(req.article._id) === -1){
			if(req.user.dislikePost.indexOf(req.article._id) === -1){
				req.user.addLikeVoted(req.article);
			}
			else{
				req.article.downDislike();
				req.user.popDisLikeVoted(req.article);
				req.user.addLikeVoted(req.article);
			}
			req.article.upLike();
		}
	}
	else{
		if(req.user.dislikePost.indexOf(req.article._id) === -1){
			if(req.user.likePost.indexOf(req.article._id) === -1){
				req.user.addDisLikeVoted(req.article);
			}
			else{
				req.article.downLike();
				req.user.popLikeVoted(req.article);
				req.user.addDisLikeVoted(req.article);
			}
			req.article.upDislike();
		}
	}
	res.json({vote: req.article.vote});
};

/**
 * Article top k article middleware
 */
exports.getTopK = function(req, res) {
	var temp = Article.find({'created': {
		$gte: new Date(req.params.fromDate),
		$lte: new Date(req.params.toDate)
	}});

	temp.sort({'vote.like': -1});

	temp.limit(req.params.getTopK);

	temp.exec(function(err, result){
		res.json(result);
	});
};

/**
 * Article top category data
 */
exports.getMarketData = function(req, res) {
	var result = {
	    data: [{
	      x: 'Health',
	      y: []
	    }, {
	      x: 'Technology',
	      y: []
	    }, {
	      x: 'Education',
	      y: []
	    }, {
	      x: 'Finance',
	      y: []
	    },{
	      x: 'Travel',
	      y: []
	    }]
	  };

	var done = function(){
		if(result.data[0].y.length > 0 && 
			result.data[1].y.length > 0 &&
			result.data[2].y.length > 0 &&
			result.data[3].y.length > 0 &&
			result.data[4].y.length > 0)
		res.json(result);
	};

	Article.count({category: 'Health'}, function(err, rt){
		result.data[0].y = [rt];
		done();
	});
	Article.count({category: 'Technology'}, function(err, rt){
		result.data[1].y = [rt];
		done();
	});
	Article.count({category: 'Education'}, function(err, rt){
		result.data[2].y = [rt];
		done();		
	});
	Article.count({category: 'Finance'}, function(err, rt){
		result.data[3].y = [rt];
		done();		
	});
	Article.count({category: 'Travel'}, function(err, rt){
		result.data[4].y = [rt];
		done();		
	});				
	
};