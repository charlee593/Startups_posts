'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	category: {
		type: String,
		default: '',
		required: 'Title cannot be blank'
	},
	tags:[],
	vote: {
		like: {
			type: Number,
			default: 0 
		},
		dislike: {
			type: Number,
			default: 0 
		}
	}
});

ArticleSchema.methods.upLike = function(){
	this.vote.like += 1;
	this.save();
};

ArticleSchema.methods.downLike = function(){
	this.vote.like -= 1;
	this.save();
};

ArticleSchema.methods.upDislike = function(){
	this.vote.dislike += 1;
	this.save();
};

ArticleSchema.methods.downDislike = function(){
	this.vote.dislike -= 1;
	this.save();
};

mongoose.model('Article', ArticleSchema);