
var app= angular.module("hackApp",['ui.bootstrap']);

app.controller("mainCtrl",['$scope', '$http','$sce', function($scope, $http,$sce){
	$scope.userId="94g6NNsxZM";
	//Begin navBar code
	
	$scope.notifications=[];
	$scope.getNotifications= function(){
		$http.post("/getNotifications",{userId: "qs2dsZJNPJ"}).then(function(response){
			var songIds= response.data;
			$http.post("/getTrackInfo",{trackIds: songIds}).then(function(response){
				$scope.notifications= response.data.body.tracks;
			})
		})
	}
	$scope.getNotifications();

	$scope.updateSong=function(songId){
		$scope.currentSongId= songId;
		$scope.currentSongUrl= $scope.makeUrl(songId);
	}
	//end navBar

	// Begin feed code

	//Category button code
	
	$scope.selectedCategory= "rap"; // rap by default

	$scope.categories=[];

	$scope.initCategories= function(){
		$http.get("/categories").then(function(response){
			console.log(response)
			$scope.categories= response.data;
		})
	};

	$scope.initCategories();

	$scope.updateCategory= function(category){
		$scope.selectedCategory= category
	};

	//end category code
	$scope.feedSongs=[];

	$scope.currentTab="globalFeed";

	$scope.updateFeed= function(category){
		

		$http.post("/updateFeed",{genre: category, tabState: $scope.currentTab, userId: $scope.userId}).then(function(response){
			
			$scope.feedSongs=response.data;
			//take list of song objects and add to feed songs
		})
	}

	$scope.makeUrl= function(songId){
		return $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:track:'+ songId)
	}

	$scope.updateFeed("rap");
	
	$scope.$watch("selectedCategory",
              function(newValue, oldValue) {
              	console.log('updating feed with: '+newValue);
                 $scope.updateFeed(newValue)
              }
             );

	
	//end feed 
	$scope.currentSongId="6nmz4imkDcmtwMjocAzFSx"; //drake's hotline bling is default
	$scope.currentSongUrl= $scope.makeUrl($scope.currentSongId);
	//begin like and share control code

	$scope.addLike= function(){
		console.log('clicked');
		$http.post("/addLike",{songId: $scope.currentSongId, userId: $scope.userId}).then(function(response){
			for (i=0,len= $scope.feedSongs.length;i<len;i++){
				if ($scope.feedSongs[i].songId == $scope.currentSongId){
					$scope.feedSongs.splice(i,1);	
					break;			
				}
			}
			$scope.currentSongId= $scope.feedSongs[0].songId;
			$scope.currentSongUrl= $scope.makeUrl($scope.currentSongId);
			//take list of song objects and add to feed songs
		})
	};


	$scope.addDislike= function(){
		$http.post("/addDislike",{songId:$scope.currentSongId, userId: $scope.userId}).then(function(response){
			console.log('added dislike');
			for (i=0,len= $scope.feedSongs.length;i<len;i++){
				if ($scope.feedSongs[i].songId == $scope.currentSongId){
					$scope.feedSongs.splice(i,1);	
					break;			
				}
			}
			$scope.currentSongId= $scope.feedSongs[0].songId;
			$scope.currentSongUrl= $scope.makeUrl($scope.currentSongId);
		})
	}
	$scope.userFriends= [];
	$scope.getUserFriends= function(){
		$http.post('/getFriends',{userId:  $scope.userId}).then(function(response){
			$scope.userFriends= response.data;
		})
	}
	$scope.getUserFriends();
	$scope.shareSong=function(userId){
		console.log('activated');
		console.log(userId)
		$http.post('/shareSong', {sender: $scope.userId, recipient: userId, songId: $scope.currentSongId}).then(function(response){
			console.log(response)
		})
	}
	//end like and share

}]); //end of main controller

