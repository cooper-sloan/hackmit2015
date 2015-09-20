var _ = require('underscore');
var Parse = require('./parse_init').createParse();
var SpotifyWrappers = require('./spotify_wrappers.js')

exports.createUser =function(username,password,email){
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

exports.logIn =function(username,password){
	var promise = new Parse.Promise();
	Parse.User.logIn(username,password).then(function(user){
		promise.resolve(user)
	},function(err){
		promise.reject(err)
	})
	return promise
}

exports.saveFriendship = function (userId1,userId2){
	var promise = new Parse.Promise()
	var friendObject= new Parse.Object("Friends")
	var query = new Parse.Query("User")
	query.get(userId1).then(function(parseUser1){
		user1=parseUser1
		query.get(userId2).then(function(parseUser2){
			user2=parseUser2
			friendObject.set("user1", user1)
			friendObject.set("user2", user2)
			friendObject.set("userId1", userId1)
			friendObject.set("userId2", userId2)
			friendObject.save().then(function(results){
				promise.resolve(results)
			})
		})
	},function(err){
		promise.reject(err)
	})
	return promise
}

/**
* Returns a Parse.Promise to save a users like
*/
exports.saveLike =function (userId,songId,like){
	var promise= new Parse.Promise()
	var query = new Parse.Query("User")
	query.get(userId).then(function(user){
		var likeObject= new Parse.Object("Likes")
		likeObject.set("userId",userId)
		likeObject.set("user",user)
		likeObject.set("songId", songId)
		likeObject.set("like",like)
		likeObject.save().then(function(results){
			promise.resolve(results)
		})
	},function(err){
		proimse.reject(err)
	})
	return promise
}

exports.saveShare =function(senderId, recieverId, songId){
	var promise = new Parse.Promise()
	var query = new Parse.Query("Likes")
	query.equalTo("songId", songId)
	query.equalTo("userId", recieverId)
	query.count().then(function(count){
		if(count>0){
			promise.reject("Reciever has already heard this song")
		}
		else{
			var userQuery = new Parse.Query('User')
			userQuery.get(senderId).then(function(parseUser1){
				sender=parseUser1
				userQuery.get(recieverId).then(function(parseUser2){
					reciever=parseUser2
					var shareObject = new Parse.Object("Shares")
					shareObject.set("senderId", senderId)
					shareObject.set("recieverId", recieverId)
					shareObject.set("sender", sender)
					shareObject.set("reciever", reciever)
					shareObject.set("songId",songId)
					shareObject.save().then(function(){
						promise.resolve(shareObject)
					})
				})
			})
		}
	},function(err){
		promise.reject(err)
	})
	return promise
}

exports.getFriends = function(userId){
	var promise = new Parse.Promise()
	var friendIds = []
	var query1 = new Parse.Query("Friends")
	query1.equalTo('user1',userId)
	var query2 = new Parse.Query("Friends")
	query2.equalTo('user2',userId)
	var mainQuery = Parse.Query.or(query1,query2)
	mainQuery.find().then(function(results){
		_.each(results,function(element){
			_.each(element.attributes,function(value,key){
				if(value != userId){
					friendIds.push(value)
				}
			})
		})
		promise.resolve(friendIds)
	},function(err){
		promise.reject(err)
	})
	return promise;
}

/*
//exports.saveShare('94g6NNsxZM','qs2dsZJNPJ','swag').then(function(r){console.log(r)},function(err){console.log(err)})
num=0
SpotifyWrappers.getTracks("Medium").then(function(results){
	_.each(results,function(element){
		exports.saveShare('94g6NNsxZM','qs2dsZJNPJ',element.spotifyId).then(function(r){console.log(r)},function(err){console.log(err)})
	})
})
*/