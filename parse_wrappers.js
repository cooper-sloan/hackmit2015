var _ = require('underscore');
var Parse = require('./parse_init').createParse();
var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi();



/**
* Returns a Parse.Promise to save a users like
*/
function saveLike(userId,songId,like){
	var likeObject= new Parse.Object("Likes")
	likeObject.set("userId",userId)
	likeObject.set("sondId", songId)
	likeObject.set("like",like)
	return likeObject.save()
}

function createUser(username,password,email){
	var promise= new Parse.Promise();
	var user = new Parse.User();
	user.set("username", username);
	user.set("password", password);
	user.set("email", email);

	user.signUp().then(function(user){
		promise.resolve(user)
	},function(err){
		promise.reject(err)
	})
	return promise
}

function logIn(username,password){
	var promise = new Parse.Promise();
	Parse.User.logIn(username,password).then(function(user){
		promise.resolve(user)
	},function(err){
		promise.reject(err)
	})
	return promise
}

function saveFriendship(userId1,userId2){
	var friendObject= new Parse.Object("Friends")

	var a = [userId1,userId2].sort()
	friendObject.set("user1", a[0])
	friendObject.set("user2", a[1])
	return friendObject.save()
}



