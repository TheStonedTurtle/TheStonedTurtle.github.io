function addNewTrainerOptions(newEle,currentObject,curIndex,idName){
	var defaultAction = ""

	for(var objectKey in currentObject){
		var curValue = currentObject[objectKey];

		//console.log(objectKey);
		//console.log(curValue);


        switch(objectKey){
            // Add all data attributes
            case "data":
                for(var dataKey in curValue){
                    var curDataValue = curValue[dataKey];

                    // Ensure unique IDs by using parent ID as starting point.
                    if(dataKey == "sub" || dataKey == "shareid"){
                        curDataValue = idName+curDataValue;
                    }

                    if(dataKey == "action" || dataKey == "hover"){
                        if(defaultAction){
                            curDataValue = defaultAction+" "+curDataValue
                        } else {
                            curDataValue = curDataValue
                        }
                    }

                    newEle.attr("data-"+dataKey,curDataValue);
                }

                break;

            // Add submenu (accompanies by data-sub)
            case "submenu":
                var newID = idName+currentObject["data"]["sub"];

                //Create Submenu Container Div
                var containerDiv = $("<div></div>");
                containerDiv.attr("id", newID);
                containerDiv.attr("data-parent",idName);


                // Loop over each subMenu and create the menu
                for(var subMenuI=0;subMenuI<curValue.length;subMenuI++){
                    var subObject = curValue[subMenuI];
                    var newSubEle = $(trainerOption);

                    newSubEle = addNewTrainerOptions(newSubEle,subObject,subMenuI,newID);
                    containerDiv.append(newSubEle);
                }

                container.append(containerDiv);
                break;

            // Option Name for the trainer
            case "menuName":
                newEle.text(curValue);
                break

            default:
                console.log("Nothinhg")
        }
    }
    return newEle
}


function appendAllElements(myarray){
	for(var index=0; index < myarray.length; index++){
		$("#jsoninfo").append(myarray[index])
	}



	$(".toggle").click(function(){
		var targetID = "#"+$(this).attr("id") + "container"
		var target = $(targetID)
		if(target.hasClass("hidden")){
			target.removeClass("hidden")
		} else {
			target.addClass("hidden")
		}
	})
}




$(document).ready(function(){
	var vehJSON = $.getJSON("/JSON/vehicles.json", function( data ) {
		//alphabetizeJSON(data)

		var items = [];

		$.each( data, function(key, objectArray){
			var myDiv = $("<div></div>")
			myDiv.attr("id",key)
			myDiv.addClass("toggle")
			myDiv.text(key)
			var containDiv = $("<div></div>")
			containDiv.attr("id",key+"container")
			containDiv.addClass("hidden")



			// Loop over each object in the array
			for(var index=0; index < objectArray.length; index++){
				var curObj = objectArray[index]

				var newEle = $("<div></div>")

				newEle = addNewTrainerOptions(newEle,curObj,index,key)

				containDiv.append(newEle);
			}

			myDiv.append(containDiv)
			items.push(myDiv)

		})



		console.log(items);
		appendAllElements(items);
	})

	console.log("ran")
});

function CreateMenuFromJSON(JSONObject){
	var htmlEles = [];
	
	// Loop over every Key-Value pair in the JSON. These will be creating container divs.
	// The container divs will contain a list of items (div tags)
	$.each( data, function(key, val){
		var myDiv = $("<div id='" + key +"'>" + key + "</li>") 
		items.push("<div id='" + key +"'>" + key + "</li>");
	});

	return htmlEles
}


function sortJSONObjects(a, b) {
    var textA = a.menuName.toUpperCase();
    var textB = b.menuName.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
}

function alphabetizeJSON(JSON){
	var newJSON = {}
	$.each(JSON, function(key, data){ 
		data.sort(sortJSONObjects)
		newJSON[key] = data
	})
	console.log(JSON.stringify(newJSON))
	return newJSON
}

//alphabetizeJSON(x)