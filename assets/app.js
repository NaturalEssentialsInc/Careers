$(document).ready(function() {
  const sheetID = "1InTwiH5M_JZ7MWmHHPD4TW1qDNAgN2ONOXCybSpzptg";
  const url = "https://spreadsheets.google.com/feeds/list/" + sheetID + "/1/public/values?alt=json";
  const scriptURL = "https://script.google.com/a/bulkapothecary.com/macros/s/AKfycbxzPHcIHjNMitxi04w3WQLXHaPyrCGNO1c4m9Qm/exec";
  const form = document.forms["apply-now-careers"];

	// AJAX call
	$.ajax({
    url : url,
    type : 'GET',
    dataType : 'jsonp',
    success : function(res, status){
        console.log('status : ' + status);
        console.log('res: ' + res.feed);
        var data = printResponse(res);
        elementBuilder(data);
    },
    error : function(res, status, error){
        console.log('status : ' + status);
        console.log(res);
        console.log(error);
    }
	});

	function printResponse(res) {

		var entries = res.feed.entry;
		var list = [];

		for (var i = 1; i < entries.length; i++) {

			var e = {};

			entries[i]["gsx$jobpostings"] ? e.id = entries[i]["gsx$jobpostings"].$t: e.id = "";
			entries[i]["gsx$_cokwr"] ? e.title = entries[i]["gsx$_cokwr"].$t: e.title = "TITLE UNAVAILABLE";
			entries[i]["gsx$_cpzh4"] ? e.description = entries[i]["gsx$_cpzh4"].$t: e.description = "";
			entries[i]["gsx$_cre1l"] ? e.duties = entries[i]["gsx$_cre1l"].$t: e.duties = "";
			entries[i]["gsx$_chk2m"] ? e.skills = entries[i]["gsx$_chk2m"].$t: e.skills = "";
			entries[i]["gsx$_ciyn3"] ? e.conditions = entries[i]["gsx$_ciyn3"].$t : e.conditions = "";
			entries[i]["gsx$_ckd7g"] ? e.benefits = entries[i]["gsx$_ckd7g"].$t: e.benefits = "";
			entries[i]["gsx$_clrrx"] ? e.type = entries[i]["gsx$_clrrx"].$t: e.type = "---";
			entries[i]["gsx$_cyevm"] ? e.status = entries[i]["gsx$_cyevm"].$t: e.status = "Inactive";

			console.log(e.status);

			list.push(e);

		}

		return list;

	}

	function listMaker(input) {

	  var list = "<ul class\"listing-list\">";
	  var arr = input.split("!!!");
	  console.log("input: " + arr);
	  if (arr.length > 1) {
		  for (var j = 1; j < arr.length; j++) {
		  	list = list + "<li>" + arr[j] + "</li>";
		  }
		  list = list + "</ul>";
		  return list;
		} else { 
			return input;
		}
	}

	function elementBuilder(data) {

		var element = "";
		var options = "";

		for (var i = 0; i < data.length; i++) {

      if (data[i].status === "ACTIVE") {

				var listing = "<div class=\"card\">" +
											  "<div class=\"card-header\" id=\"heading" + i + "\">" +
											    "<div class=\"row\">" +
											      "<div class=\"col-md-6\">" +
													    "<h2 class =\"mb-0\">" +
													      "<button class=\"btn btn-link collapsed\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapse" + i + "\" aria-expanded=\"false\" aria-controls=\"collapse" + i + "\">" +
													         data[i].title +
													      "</button>" +
													    "</h2>" +
													  "</div>" +
													  "<div class=\"col-md-6\">" +
													    "<h2 class=\"mb-0\">" +
													      "<button class=\"btn btn-link collapsed\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapse" + i + "\" aria-expanded=\"false\" aria-controls=\"collapse" + i + "\">" +
													         data[i].type +
													      "</button>" +
													    "</h2>" +
													  "</div>" +
												  "</div>" +
											  "</div>" +
											"<div id=\"collapse" + i + "\" class=\"collapse\" aria-labelledby=\"heading" + i + "\" data-parent=\"#jobs\">" +
											  "<div class=\"card-body\">" +
											    (data[i].description !== "" ? "<h3 class=\"listing-header\">Job Description:</h3>" + data[i].description: "") +
											    (data[i].duties !== "" ? "<h3 class=\"listing-header\">Duties and Responsibilities:</h3>" + listMaker(data[i].duties): "") +
											    (data[i].skills !== "" ? "<h3 class=\"listing-header\">Knowledge, Skills and Abilities Required:</h3>" + listMaker(data[i].skills): "") +
											    (data[i].conditions !== "" ? "<h3 class=\"listing-header\">Working Conditions and Physical Effort:</h3>" + listMaker(data[i].conditions): "") +
											    (data[i].benefits !== "" ? "<h3 class=\"listing-header\">Benefits:</h3>" + listMaker(data[i].benefits): "") +
											    "<button type=\"button\" class=\"btn btn-primary btn-block\" data-toggle=\"modal\" data-target=\".apply\">Apply Now</button>" +
											  "</div>" +
											"</div>";
				element = element + listing;

				var option = "<option>" + data[i].title + "</option>";

				options = options + option;
			}
		}

		$("#jobs").append(element);
		$("#position").append(options);
	}

  form.addEventListener('submit', e => {
    e.preventDefault();
    
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
      .then(response => console.log('Success!', response), alert('Your application has been successfully submitted!'))
      .catch(error => alert('Error! Please re-submit your application!', error.message));

    // $("#itemDescription").val("");
    // $("#partNumber").val("");
    // $("#quantity").val("");
    // $("#needBy").val("");
    // $("#allocatedTo").val("");
    // $("#requestedBy").val("");
    // $("#email").val("");
  }) 

});