'use strict';

angular.module('articles').filter('filterByTags', [
	function() {
		return function(inputs, tags, customCategory) {
		    var filtered = [];
			if(tags.length < 1){
				(inputs || []).forEach(function (input) {
				      var matches = (customCategory.health === input.category ||
				      	customCategory.technology === input.category  ||
				      	customCategory.education === input.category ||
				      	customCategory.finance === input.category  ||
				      	customCategory.travel === input.categor);

				      if (matches)
				        filtered.push(input);
			    });
			    return filtered;
			}
			else{
			    (inputs || []).forEach(function (input) {
			      var matches = tags.some(function (tag) {
			      	return input.tags.some(function(iTags){
			      		return (iTags.text === tag.text);
			        });
			      });
			      if (matches || (customCategory.health === input.category ||
			      	customCategory.technology === input.category  ||
			      	customCategory.education === input.category ||
			      	customCategory.finance === input.category  ||
			      	customCategory.travel === input.categor))
			        filtered.push(input);
			    });
			    return filtered;
			}



		};
	}
]);