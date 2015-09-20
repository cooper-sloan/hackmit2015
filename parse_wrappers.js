var _ = require('underscore');
var Parse = require('./parse_init').createParse();


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

/**
* Returns a Parse.Promise to save a users like
*/
function saveLike(userId,songId,like){
	var likeObject= new Parse.Object("Likes")
	likeObject.set("userId",userId)
	likeObject.set("songId", songId)
	likeObject.set("like",like)
	return likeObject.save()
}

function saveShare(senderId, recieverId, songId){
	var promise = new Parse.Promise()
	var query = new Parse.Query("Likes")
	query.equalTo("songId", songId)
	query.equalTo("userId", reciever)
	query.count().then(function(count){
		if(count>0){
			promise.reject("Reciever has already heard this song")
		}
		else{
			var shareObject = new Parse.Object("Share")
			shareObject.set("senderId", senderId)
			shareObject.set("recieverId", recieverId)
			shareObject.set("songId",songId)
			shareObject.save().then(function(){
				promise.resolve(shareObject)
			},function(err){
				promise.reject(err)
			})
		}
	},function(err){
		promise.reject(err)
	})
	return promise
}
