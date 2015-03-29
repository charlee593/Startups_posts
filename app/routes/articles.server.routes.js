'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	articles = require('../../app/controllers/articles.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/articles')
		.get(articles.list)
		.post(users.requiresLogin, articles.create);

	app.route('/articles/market')
		.get(users.requiresLogin, articles.getMarketData);

	app.route('/articles/:articleId')
		.get(articles.read)
		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);

	app.route('/articles/:articleId/vote/:like')
		.get(users.requiresLogin, articles.vote);

	app.route('/articles/:getTopK/:fromDate/:toDate')
		.get(users.requiresLogin, articles.getTopK);

	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);
};