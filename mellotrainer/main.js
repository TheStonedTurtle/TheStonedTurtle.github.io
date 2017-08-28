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
	$scope.showEditables = false;

	var combinedJSON = $.getJSON("/JSON/combined-cleaned.json", function( data ) {
		$.each( data, function(key, jsonObject){
			
			var JS = {
				"menuName": key,
				"submenu": jsonObject,
				"editable": false
			}
			$scope.myinfo.push(JS)
		})

		$scope.$apply();
	})


	function downloadJSON(JSONString){
		var data = "data:text/json;charset=utf-8,"+encodeURIComponent(JSONString);
		var ele = $("#downloadEle")
		if(!ele.length){
			ele = $("<a id='downloadEle'></a>")
		} 

		ele.attr("href", data)
		ele.attr("download","mellotrainer.json")
		$("body").append(ele);
		$("#downloadEle")[0].click();
		ele.remove();
	}

	$scope.download = function(){
		var JSONString = angular.toJson($scope.myinfo, 2)
		downloadJSON(JSONString)
	}
	
	$scope.removeSubmenuElement = function(submenu, index){
		submenu.splice(index, 1)
	}

	$scope.createNewSubmenuElement = function(submenu){
		placeholderCount++
		var newEle = {
			"menuName": "Placeholder"+placeholderCount.toString()
		}
		submenu.push(newEle);
	}
})
.filter('underscoreme', function() {
  return function(text) {

    return String(text).replace(/\s/g, "_").replace(/[\(\)]/g,"_");
  };
});