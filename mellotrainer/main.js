function sortJSONObjects(a, b) {
    var textA = a.menuName.toUpperCase();
    var textB = b.menuName.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
}

function alphabetizeJSON(json){
	var newJSON = {}
	$.each(json, function(key, data){ 
		data.sort(sortJSONObjects)
		newJSON[key] = data
	})
	//console.log(JSON.stringify(newJSON))
	return newJSON
}

//alphabetizeJSON(x)




// Angular Time.

var MelloTrainerApp = angular.module("MelloTrainerApp", []);


MelloTrainerApp.controller("JSONEditorController", function ($scope){
	$scope.myinfo = []

	var combinedJSON = $.getJSON("/JSON/combined-cleaned.json", function( data ) {
		$.each( data, function(key, jsonObject){
			
			var JS = {
				"menuName": key,
				"submenu": jsonObject,
			}
			$scope.myinfo.push(JS)
		})

		$scope.$apply();
	})
})
.filter('underscoreme', function() {
  return function(text) {

    return String(text).replace(/\s/g, "_").replace(/[\(\)]/,"_");
  };
});