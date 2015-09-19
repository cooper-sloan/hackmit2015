
var _ = require('underscore');
var Parse = require('./parse_init').createParse();
var SpotifyWebApi = require('spotify-web-api-node');

// Search tracks whose name, album or artist contains 'Love'
function getTracks(title){
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
			trackList.push(trackObject)
		})
		promise.resolve(trackList)
	  }, function(err) {
	    promise.reject(err)
	  });
	  return promise
}

function getPlayer(sondId){
	return "<iframe src=\"https://embed.spotify.com/?uri="+songId+"\" width=\"300\" height=\"380\" frameborder=\"0\" allowtransparency=\"true\"></iframe>"
}