var _ = require('underscore');
var Parse = require('./parse_init').createParse();
var SpotifyWebApi = require('spotify-web-api-node');
var parseWrappers = require('./parse_wrappers')

// credentials are optional
var spotifyApi = new SpotifyWebApi();


exports.getTracks = function(title){
	var promise = new Parse.Promise()
	spotifyApi.searchTracks(title, {limit:50})
	  .then(function(data) {
	    results=data.body
	    var trackList=[]
		_.each(results.tracks.items,function(track){
			var trackObject={artists:[]}
			_.each(track.artists,function(artist){
				trackObject.artists.push(artist.name)
			})
			trackObject.spotifyId= track.id
			trackObject.title = track.name
			trackObject.previewUrl=track.preview_url
			trackList.push(trackObject)
			//REMOVE
			//trackObject.genre=title
		})
		promise.resolve(trackList)
	  }, function(err) {
	    promise.reject(err)
	  });
	  return promise
}

exports.getPreviewUrl = function(songId){
	var promise = new Parse.Promise()
	spotifyApi.getTrack(songId).then(function(results){
		promise.resolve(results.body.preview_url)
	},function(err){
		promise.reject(err)
	})
	return promise
}

exports.getSongInfo = function(songId){
	var promise = new Parse.Promise()
	spotifyApi.getTrack(songId).then(function(results){
		track = results.body
		var trackObject={artists:[]}
		_.each(track.artists,function(artist){
			trackObject.artists.push(artist.name)
		})
		trackObject.spotifyId= track.id
		trackObject.title = track.name
		trackObject.previewUrl=track.preview_url
		promise.resolve(trackObject)
	},function(err){
		promise.reject(err)
	})
	return promise
}


/*
spotifyApi.getArtist('2hazSY4Ef3aB9ATXW7F5w3')
  .then(function(data) {
    console.log('Artist information', data.body);
  }, function(err) {
    console.error(err);
  });
*/
//exports.getGenre('6J6yx1t3nwIDyPXk5xa7O8')
//.then(function(r){console.log(r)},function(err){console.log(err)})
/*
exports.getTracks("rap").then(function(results){
	_.each(results,function(element){
		parseWrappers.saveSong(element)
	})
})
*/