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
* like is a boolean value, true or false
*/
exports.saveLike =function (userId,songId,like){
	console.log('backend started')
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
		promise.reject(err)
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

//Returns a list of songId for the user
exports.getShares = function(userId){
	var promise = new Parse.Promise()
	var ids=[]
	var shareQuery = new Parse.Query("Shares")
	var likeQuery = new Parse.Query("Likes")
	likeQuery.equalTo("userId",userId)
	shareQuery.equalTo("recieverId",userId)
	shareQuery.doesNotMatchKeyInQuery("songId","songId",likeQuery)
	shareQuery.each(function(element){
		ids.push(element.attributes.songId)
	}).then(function(results){
		promise.resolve(ids)
	},function(err){
		promise.reject(err)
	})
	return promise
}

exports.getFriends = function(userId){
	var promise = new Parse.Promise()
	var friends = []
	var query1 = new Parse.Query("Friends")
	query1.equalTo('userId1',userId)
	var query2 = new Parse.Query("Friends")
	query2.equalTo('userId2',userId)
	var mainQuery = Parse.Query.or(query1,query2)
	mainQuery.include("user1")
	mainQuery.include("user2")
	//mainQuery.select('user1','user2')
	mainQuery.each(function(friendsObject){
		if(friendsObject.get("userId1") == userId){
			friendObject = {}
			friendObject.username = friendsObject.get("user2").get("username")
			friendObject.id = friendsObject.get("userId2")
			friends.push(friendObject)
		}else{
			friendObject = {}
			friendObject.username = friendsObject.get("user1").get("username")
			friendObject.id = friendsObject.get("userId1")
			friends.push(friendObject)
		}
	}).then(function(){
		promise.resolve(friends)
	},function(err){
		promise.reject(err)
	})
	return promise;
}

exports.saveSong = function(song){
	var promise = new Parse.Promise()
	var songObject = new Parse.Object("Songs")
	songObject.set("songId", song.spotifyId)
	songObject.set("artists", song.artists)
	songObject.set("title",song.title)
	songObject.set("previewUrl",song.previewUrl)
	if(song.genre){
		songObject.set("genre",song.genre)
	}
	songObject.save().then(function(results){
		promise.resolve(results)
	},function(err){
		promise.reject(err)
	})
	return promise
}

exports.getSongs = function(genre){
	var promise = new Parse.Promise()
	var songs=[]
	var query= new Parse.Query("Songs")
	query.equalTo("genre",genre)
	query.each(function(song){
		var songObject = {}
		songObject.title = song.get("title")
		songObject.artists = song.get("artists")
		songObject.songId = song.get("songId")
		songObject.genre = genre
		songObject.previewUrl = song.get("previewUrl")
		songs.push(songObject)
	}).then(function(){
		promise.resolve(songs)
	},function(err){
		promise.reject(err)
	})
	return promise
}

exports.getSongsForUser = function(genre,userId){
	var promise = new Parse.Promise()
	var songs=[]
	var query= new Parse.Query("Songs")
	query.equalTo("genre",genre)
	var likeQuery=new Parse.Query("Likes")
	likeQuery.equalTo("userId",userId)
	query.doesNotMatchKeyInQuery("songId","songId",likeQuery)
	query.each(function(song){
		var songObject = {}
		songObject.title = song.get("title")
		songObject.artists = song.get("artists")
		songObject.songId = song.get("songId")
		songObject.genre = genre
		songObject.previewUrl = song.get("previewUrl")
		songs.push(songObject)
	}).then(function(){
		promise.resolve(songs)
	},function(err){
		promise.reject(err)
	})
	return promise
}

exports.getLikes = function(userId){
	var promise = new Parse.Promise()
	var query = new Parse.Query("Likes")
	query.include("user")
	query.equalTo("userId",userId)
	query.equalTo("like",true)
	var likes=[]
	query.each(function(like){
		var likeObject= {}
		likeObject.username = like.get("user").get("username")
		likeObject.songId= like.get("songId")
		likes.push(likeObject)
	}).then(function(){
		promise.resolve(likes)
	},function(err){
		promise.reject(err)
	})
	return promise
}

exports.getGenres = function(){
	var promise = new Parse.Promise()
	var genres = []
	var query = new Parse.Query('Songs')
	query.select("genre")
	query.each(function(song){
		genre=song.attributes.genre
		if(!_.contains(genres,genre)){
			genres.push(song.attributes.genre)
		}
	}).then(function(){
		promise.resolve(genres)
	},function(err){
		promise.reject(err)
	})
	return promise
}

exports.getFriendsLikes = function(userId){
	var promise = new Parse.Promise()
	var promiseHolder= new Parse.Promise()
	var promises = [promiseHolder]
	var friendsLikes = []
	var friends = []
	exports.getFriends(userId).then(function(results){
		friends = results
		console.log(friends)
		_.each(friends,function(friend){
			var newPromise = new Parse.Promise()
			promises.push(newPromise)
			exports.getLikes(friend.id).then(function(results){
				console.log(promises)
				//console.log(results)
				friendsLikes.push(results)
				promise.resolve(friendsLikes)
			},function(err){
				//console.log(err)
				promise.reject(err)
			})
		})
		promiseHolder.resolve()
	},function(err){
		promise.reject(err)
	})
	return promise
}


//exports.getFriends('94g6NNsxZM').then(function(r){console.log(r)},function(err){console.log(err)})
//exports.getLikes('qs2dsZJNPJ').then(function(r){console.log(r.length)},function(err){console.log(err)})

//exports.getFriendsLikes('94g6NNsxZM').then(function(r){console.log(r)},function(err){console.log(err)})
//exports.getFriends('qs2dsZJNPJ').then(function(r){console.log(r)},function(err){console.log(err)})
//exports.getGenres().then(function(r){console.log(r)},function(err){console.log(err)})
//exports.createUser('rockandroll','password','rocker@mail.com')
//exports.getShares('qs2dsZJNPJ').then(function(r){console.log(r)},function(err){console.log(err)})
//exports.getSongs('rap').then(function(r){console.log(r)},function(err){console.log(err)})
//exports.saveShare('94g6NNsxZM','qs2dsZJNPJ','swag').then(function(r){console.log(r)},function(err){console.log(err)})
/*
num=0
SpotifyWrappers.getTracks("Rap").then(function(results){
	_.each(results,function(element){
		exports.saveSong('94g6NNsxZM','qs2dsZJNPJ',element.spotifyId).then(function(r){console.log(r)},function(err){console.log(err)})
	})
})
*/