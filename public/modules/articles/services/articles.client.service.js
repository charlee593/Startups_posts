'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return {
			ArticlesRes: $resource('articles/:articleId', {
						articleId: '@_id'
					  }, {
					  update: {
						 method: 'PUT'
					  }}),
			UpvoteRes: $resource('articles/:articleId/vote/:like', {
						articleId: '@_id'
					  }),
			TopKRes: $resource('/articles/:getTopK/:fromDate/:toDate'),
			MarketRes: $resource('/articles/market')
	    };
	}
]);