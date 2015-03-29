'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles.ArticlesRes({
				title: this.title,
				content: this.content,
				category: this.category,
				tags: this.tags
			});
			article.$save(function(response) {
				console.log('Client: ' + $scope);
				console.log(response);
				$location.path('articles/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			console.log('Update');
			console.log($scope.article);

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.ArticlesRes.query();
			$scope.search ='';
			$scope.isCollapsed = true;
			$scope.sort.nameTab = true; 
			$scope.sort.dateTab = false;
			$scope.sort.topTab = false;
			$scope.customUser = '';
			$scope.customCategory = {
				health: 'Health',
				technology: 'Technology',
				education: 'Education',
				finance: 'Finance',
				travel: 'Travel'
			};
			$scope.tags = [ ];
			$scope.getTopKFrom = '';
			$scope.getTopKTo = '';
			$scope.getTopKNum = 0;
			$scope.getTopKArticles = [];
		};

		$scope.findOne = function() {
			$scope.article = Articles.ArticlesRes.get({
				articleId: $stateParams.articleId
			});
			console.log($scope);
			if($scope.authentication.user.likePost.indexOf($stateParams.articleId) !== -1){
				$scope.upvoted = true;
			}
			if($scope.authentication.user.dislikePost.indexOf($stateParams.articleId) !== -1){
				$scope.downvoted = true;
			}


		};

		$scope.like = function() {
			Articles.UpvoteRes.get({articleId: $stateParams.articleId, like: 't'}, 
				function(res) { 
					$scope.article.vote = res.vote;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			$scope.upvoted=true; 
			$scope.downvoted=false;
		};

		$scope.dislike = function() {
			Articles.UpvoteRes.get({articleId: $stateParams.articleId, like: 'f'}, 
				function(res) { 
					$scope.article.vote = res.vote;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			$scope.upvoted=false; 
			$scope.downvoted=true;
		};
        
		$scope.sort = function(orderType) {
			$scope.sort.order = orderType;
			if(orderType === 'title'){
				$scope.sort.nameTab = true; 
				$scope.sort.dateTab = false;
				$scope.sort.topTab = false; 
			}
			else{
				$scope.sort.nameTab = false; 
				$scope.sort.dateTab = true;
				$scope.sort.topTab = false; 
			}

		};

		$scope.checkboxUser = function() {
			if($scope.customUserCheck === 't')
				$scope.customUser = $scope.authentication.user._id;
			else
				$scope.customUser = '';
		};

		$scope.checkboxUser = function() {
			if($scope.customUserCheck === 't')
				$scope.customUser = $scope.authentication.user._id;
			else
				$scope.customUser = '';
		};

//**************************************************************
		$scope.getTopK = function(k, from, to) {
			if(k > 0){
				Articles.TopKRes.query({getTopK: k, fromDate: from, toDate: to}, 
					function(res) { 
						console.log(res);
						$scope.getTopKArticles = res;
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			}
			else{
				$scope.getTopKArticles = [];
			}
		};

	  $scope.getMarketData = function(){
	  		Articles.MarketRes.get(function(res){
	  			$scope.data = res;
	  		});
	  };
//**************************************************************

		  $scope.today = function() {
		    $scope.dt = new Date();
		  };
		  $scope.today();

		  $scope.clear = function () {
		    $scope.dt = null;
		  };

		  // Disable weekend selection
		  $scope.disabled = function(date, mode) {
		    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
		  };

		  $scope.toggleMin = function() {
		    $scope.minDate = $scope.minDate ? null : new Date();
		  };
		  $scope.toggleMin();

		  $scope.open = function($event) {
		    $event.preventDefault();
		    $event.stopPropagation();

		    $scope.opened = true;
		  };

		  $scope.config = {
		    title: 'Products',
		    tooltips: true,
		    labels: false,
		    mouseover: function() {},
		    mouseout: function() {},
		    click: function() {},
		    legend: {
		      display: true,
		      //could be 'left, right'
		      position: 'left'
		    }
		  };

		  $scope.data = {
		    data: [{
		      x: 'Health',
		      y: [0],
		      tooltip: 'Health'
		    }, {
		      x: 'Technology',
		      y: [0]
		    }, {
		      x: 'Education',
		      y: [0]
		    }, {
		      x: 'Finance',
		      y: [0]
		    },{
		      x: 'Travel',
		      y: [0]
		    }]
		  };
	}
]);