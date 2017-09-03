function sortJSONObjects(a, b) {
    var textA = a.menuName.toUpperCase();
    var textB = b.menuName.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
}

function reverseSortJSONObjects(a, b) {
    var textA = a.menuName.toUpperCase();
    var textB = b.menuName.toUpperCase();
    return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
}



// Angular Time.

var MelloTrainerApp = angular.module("MelloTrainerApp", []);


MelloTrainerApp.controller("JSONEditorController", function ($scope){
	var jsonInfo = []			  // Holds the JSON data from initial request
	$scope.loadedStatus = false;  // Has JSON finished loading?
	$scope.loading = false;       // Show the loading spinner?
	$scope.myinfo = []            // JSON Info displayed on the scope.
	$scope.showEditables = false; // Is this editable?

	var placeholderCount = 0


	// Load JSON into memory as soon as possible.
	$.getJSON("/JSON/combined-cleaned.json", function( data ) {
		$.each( data, function(key, jsonObject){
			
			var JS = {
				"menuName": key,
				"submenu": jsonObject,
				"editable": false
			}
			jsonInfo.push(JS)
		})
	});


	//
	// Editable Function
	//

	// Add/Remove elements
	$scope.createNewSubmenuElement = function(submenu,forwardToggle){
		placeholderCount++
		var newEle = {
			"menuName": "Placeholder "+placeholderCount.toString()
		}
		if(forwardToggle == true){
			submenu.unshift(newEle);
		} else {
			submenu.push(newEle);			
		}
	}

	$scope.removeSubmenuElement = function(submenu, index){
		submenu.splice(index, 1)
	}

	// Movement
	$scope.moveSubmenuElementUp = function(submenu, index){
		var newIndex = index - 1
		if(newIndex < 0){
			newIndex = submenu.length - 1
		}
		var ele = submenu[index]
		submenu.splice(index, 1)
		submenu.splice(newIndex, 0, ele)
	}

	$scope.moveSubmenuElementDown = function(submenu, index){
		var newIndex = index + 1
		if(newIndex >= submenu.length){
			newIndex = 0
		}
		var ele = submenu[index]
		submenu.splice(index, 1)
		submenu.splice(newIndex, 0, ele)
	}

	// Alphabatization
	$scope.alphabatizeSubmenu = function(submenu){
		submenu.sort(sortJSONObjects)
	}

	$scope.reverseAlphabatizeSubmenu = function(submenu){
		submenu.sort(reverseSortJSONObjects)
	}

	// Data Attributes
	$scope.createNewAttribute = function(dataobj){
		var keys = Object.keys(dataobj)
		var newKey = "key"
		var count = 0
		while(keys.indexOf(newKey) > -1){
			count++
			newKey = "key " + count
		}
		dataobj[newKey] = "value"
	}

	$scope.removeAttribute = function(dataobj, key){
		delete dataobj[key]
	}


	//
	// JSON Helper Functions
	//

	// Prompt the user to download a JSON string.
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
		var JSONObject = {}
		for (var i = $scope.myinfo.length - 1; i >= 0; i--) {
			var cur = $scope.myinfo[i]
			var data = {}

			for (var subI = cur.submenu.length - 1; subI >= 0; subI--) {
				var subcur = cur.submenu[subI]
				data[subcur.menuName] = subcur.submenu
			}

			JSONObject[cur.menuName] = data
		}
		var JSONString = angular.toJson(JSONObject, 2)
		downloadJSON(JSONString)		
	}



	// Reload the JSON view.
	$scope.reloadJSON = reloadJSON

	function reloadJSON(){
		$scope.myinfo = []
		$scope.loadedStatus = false
		$scope.loading = true
		$scope.myinfo = graduallyLoadJSON(jsonInfo, "submenu", 0, 25, 
			// Update callback
			function(){ 
				$scope.$digest();
			}, 
			// Finish Callback
			function(){
				$scope.loading = false
				$scope.loadedStatus = true
			}
		);
		
	}



	// Loads the JSON file without freezing the browser.
	// data = JSON | childKey = String | gap = Int (timeout delay)
	// count = Int (amount handled per timeout) | updateCb = Function | FinishCb = Function
	function graduallyLoadJSON(data, childKey, gap, count, updateCb, finishCb){
		const linearData = [];
		const retVal = []

		//
		// Loop over each element in the JSON looking for the child key
		// Add all data to a single dimension array for easier looping
		//
		function getLinearData(arr, position){
			// Add them to the linearData array
			arr.forEach(function (obj, index){
				const pos = position.concat([index])
				if(obj[childKey] && obj[childKey].length){
					var children = obj[childKey]
					obj[childKey] = [];
					linearData.push({
						obj,
						pos
					});
					getLinearData(children, pos);
				} else{
					linearData.push({
						obj,
						pos
					})
				}
			});
		}
		getLinearData(data, []);

		//
		// Insert the data into the retVal array.
		//
		function insertData({obj,pos}){
			var target = retVal;
			pos.forEach(function(i, index){
				if(index == pos.length - 1){
					target[i] = obj;
				} else {
					target = target[i][childKey]
				}
			})
		}

		var insertCount = 0;
		function doInsert(){
			let start = insertCount;
			let end = undefined;
			if(insertCount + count > linearData.length){
				end = linearData.length;
			} else {
				end = insertCount + count;
			}

			for(let i = start; i < end; i++){
				insertData(linearData[i]);
			}
			insertCount += count;
			if(insertCount < linearData.length){
				setTimeout(function(){
					doInsert();
					updateCb && updateCb()
				}, gap);
			} else {
				finishCb && finishCb();
			}
		}
		doInsert();
		//
		// Return the newly created array.
		//
		return retVal;
	}


})
.filter('underscoreme', function() {
  return function(text) {

    return String(text).replace(/\s/g, "_").replace(/[\(\)]/g,"_");
  };
})
.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });

      element.bind("keydown keypress", function (event){
      	if(event.keyCode == 13){
      		element[0].blur();
      		event.preventDefault();
      	}
      })
    }
  };
});