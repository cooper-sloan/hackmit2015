
var app= angular.module("hackApp",['ui.bootstrap']);

app.controller("mainCtrl",['$scope', '$http','$sce', function($scope, $http,$sce){

	//Begin sideBar code

	//end sideBar

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

	$scope.updateFeed= function(category){
		$http.post("/updateFeed",{genre: category}).then(function(response){
			console.log(response);
			$scope.feedSongs=response.data;
			//take list of song objects and add to feed songs
		})
	}

	$scope.makeUrl= function(songID){
		return $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:track:'+ songID)
	}

	$scope.updateFeed("rap");
	$scope.$watch("selectedCategory",
              function(newValue, oldValue) {
              	console.log('updating feed with: '+newValue);
                 $scope.updateFeed(newValue)
              }
             );
	//end feed 

	//begin like and share control code

	//end like and share

}]); //end of main controller

