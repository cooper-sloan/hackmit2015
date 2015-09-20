
var _ = require('underscore');
var Parse = require('./parse_init').createParse();
var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi();

// Search tracks whose name, album or artist contains 'Love'
exports.getTracks = function(title){
	var promise = new Parse.Promise()
	spotifyApi.searchTracks(title)
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
