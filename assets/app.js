// document.ready keept scripts from running until the page has loaded.  Everything else on this page is wrapped inside this function.
$(document).ready(function() {
  const sheetID = "1InTwiH5M_JZ7MWmHHPD4TW1qDNAgN2ONOXCybSpzptg"; // Reference to the sheet ID, abstracted so it can be changed easily.
  const url = "https://spreadsheets.google.com/feeds/list/" + sheetID + "/1/public/values?alt=json"; // URL that exposes the JSON
  // These next two are just for handling my form responses.  They aren't necessary for displaying data from a sheet
  const scriptURL = "https://script.google.com/a/bulkapothecary.com/macros/s/AKfycbxzPHcIHjNMitxi04w3WQLXHaPyrCGNO1c4m9Qm/exec";  // This is for handling my form responses
  const form = document.forms["apply-now-careers"]; // Reference my form

	// AJAX call
	$.ajax({
    url : url, // Declared above
    type : 'GET', // GET method pulls data.
    dataType : 'jsonp', // jsonp to avoid CORS issues
    success : function(res, status){
        console.log('status : ' + status); // Log responses to the console
        console.log('res: ' + res.feed); // the 'res' object contains the response fomr the AJAX call.
        var data = printResponse(res); // printResponse is a custom function that takes entries from 'res' and stores them in a new object for easier access.
        elementBuilder(data); // Custom function takes the data returned from printResponse and turns it into HTML on the page.
    },
    error : function(res, status, error){ // Error handling
        console.log('status : ' + status); // Prints status header
        console.log(res); // Logs response
        console.log(error); // Logs Errors
    }
	});

	function printResponse(res) { // Custom function that takes the 'res' object and strips out the parts I want.

		var entries = res.feed.entry; // If you look at the JSON in your browser, you will see that everything on the sheet is in res.feed.entry
		var list = []; // Empty array for storing my NEW object.

		// Next we loop through the Rows to pull out what we need.
		for (var i = 1; i < entries.length; i++) { // Looping through the 'entries' in 'res.feed.entry'

			var e = {}; // Empty object as a placeholder for injecting it into my array

			// ES6 syntax 'if [condition] ? then [execution] : else [execution]' the if and else are implied.
			// Basically I am checking if these entries exist, and if they don't applying some default value.
			entries[i]["gsx$jobpostings"] ? e.id = entries[i]["gsx$jobpostings"].$t: e.id = ""; // e.[variable] I am adding members to the empty object I initialized
			entries[i]["gsx$_cokwr"] ? e.title = entries[i]["gsx$_cokwr"].$t: e.title = "TITLE UNAVAILABLE";
			entries[i]["gsx$_cpzh4"] ? e.description = entries[i]["gsx$_cpzh4"].$t.replace(/(?:\r\n|\r|\n)/g, '<br>'): e.description = ""; // Don't worry about the .replace().  It is just formatting REGEX to make the career entries look nice.
			entries[i]["gsx$_cre1l"] ? e.duties = entries[i]["gsx$_cre1l"].$t.replace(/(?:\r\n|\r|\n)/g, '<br>'): e.duties = "";
			entries[i]["gsx$_chk2m"] ? e.skills = entries[i]["gsx$_chk2m"].$t.replace(/(?:\r\n|\r|\n)/g, '<br>'): e.skills = "";
			entries[i]["gsx$_ciyn3"] ? e.conditions = entries[i]["gsx$_ciyn3"].$t.replace(/(?:\r\n|\r|\n)/g, '<br>'): e.conditions = "";
			entries[i]["gsx$_ckd7g"] ? e.benefits = entries[i]["gsx$_ckd7g"].$t.replace(/(?:\r\n|\r|\n)/g, '<br>'): e.benefits = "";
			entries[i]["gsx$_clrrx"] ? e.type = entries[i]["gsx$_clrrx"].$t: e.type = "---";
			entries[i]["gsx$_cyevm"] ? e.status = entries[i]["gsx$_cyevm"].$t: e.status = "Inactive";

			console.log(e.status);

			list.push(e); // Then I push my new object into my array for accessing later.  I declare 'e = {}' at the beginning of the loop, so each iteration empties the object and starts again.  The list is declared outside the loop, so it does not get overwritten.

		}

		return list; // Return my array of objects.  This is what is returned on line 17 and captured under the variable 'data'

	}

	// This is a custom function I created to deal with the markup I provided HR with to add bulleted lists to the page.  It doesn't really have any use outside of this context.
	function listMaker(input) {

	  var list = "";
	  var arr = input.split("!!!");
	  console.log("input: " + arr);
	  if (arr.length > 1) {
		  for (var j = 1; j < arr.length; j++) {
		  	list = list + "<li>" + arr[j] + "</li>";
		  }
		  list = list + "</ul>";
		  list = "<ul class\"listing-list\">" + arr[0] + list;
		  return list;
		} else { 
			return input;
		}
	}

	// This is where the object created in printResponse() and stored as the variable 'data' gets turned into HTML
	function elementBuilder(data) {

		var element = ""; // Empty variables for filling later
		var options = ""; 

		// I loop through my array of objects contained in data which is really just looping htrough the rows in my sheet.
		// You could aslo access anything in data without looping (ie: data[position in array].member)
		for (var i = 0; i < data.length; i++) {
			// Then I create all my HTML based on my data and insert it into the page.  It's kind of roundabout, a templating engine like Handlebars would make this easier, but for somethign this simple, it was more straightforward to create the HTML myself.
      if (data[i].status === "ACTIVE") {
      
				var listing = "<div class=\"card\">" +
											  "<div class=\"card-header\" id=\"heading" + i + "\">" +
											    "<div class=\"row\">" +
											      "<div class=\"col-md-6\">" +
													    "<h2 class =\"mb-0\">" +
													      "<button class=\"btn btn-link collapsed\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapse" + i + "\" aria-expanded=\"false\" aria-controls=\"collapse" + i + "\"><span>" +
													         data[i].title +
													      "</span></button>" +
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

		$("#jobs").append(element); // adds the HTML I've created to the element with the #jobs id.
		$("#position").append(options);
		$("#position").append("Any");
	}


  $("input[name='phone'], input[name='prior1-phone'], input[name='prior2-phone'], input[name='prior3-phone']").keypress(function (e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
      return false;
    }
    var curchr = this.value.length;
    var curval = $(this).val();
    if (curchr == 3 && curval.indexOf("(") <= -1) {
      $(this).val("(" + curval + ")" + " ");
    } else if (curchr == 4 && curval.indexOf("(") > -1) {
      $(this).val(curval + ") ");
    } else if (curchr == 5 && curval.indexOf(")") > -1) {
      $(this).val(curval + "-");
    } else if (curchr == 9) {
      $(this).val(curval + "-");
      $(this).attr('maxlength', '14');
    }
  });

  (function() {
  	'use strict';
  	window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    var prior1Inputs = "#prior1-address, #prior1-city, #prior1-state, #prior1-zip, #prior1-phone, #prior1-supervisor, #prior1-title, #prior1-from, #prior1-to, #prior1-pay, #prior1-reason, #prior1-contact-affirmative, #prior1-contact-negative";
    var prior2Inputs = "#prior2-address, #prior2-city, #prior2-state, #prior2-zip, #prior2-phone, #prior2-supervisor, #prior2-title, #prior2-from, #prior2-to, #prior2-pay, #prior2-reason, #prior2-contact-affirmative, #prior2-contact-negative";
    var prior3Inputs = "#prior3-address, #prior3-city, #prior3-state, #prior3-zip, #prior3-phone, #prior3-supervisor, #prior3-title, #prior3-from, #prior3-to, #prior3-pay, #prior3-reason, #prior3-contact-affirmative, #prior3-contact-negative";
    
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
		  form.addEventListener('submit', e => {
		  	if ($("#prior1-employer").val() !== "" && $("#prior1-employer").val().toUpperCase().trim() !== "NONE") {
		  		$(prior1Inputs).prop("required", true);
		  	} else {
		  		$(prior1Inputs).prop("required", false);
		  	};

		  	if ($("#prior2-employer").val() !== "") {
		  		$(prior2Inputs).prop("required", true);
		  	} else {
		  		$(prior2Inputs).prop("required", false);
		  	};

		  	if ($("#prior3-employer").val() !== "") {
		  		$(prior3Inputs).prop("required", true);
		  	} else {
		  		$(prior3Inputs).prop("required", false);
		  	};

        if (form.checkValidity() === false) {
          e.preventDefault();
          e.stopPropagation();
        } else {
        	e.preventDefault();
				  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
				    .then(response => console.log('Success!', response), 
				      alert('Your application has been successfully submitted!'),
				    	$("#apply-now-careers").trigger("reset"),
				    	$("#apply-now-modal").modal("hide"))
				    .catch(error => alert('Error! Please re-submit your application!', error.message));
			  }
        var errorElements = document.querySelectorAll(
          "input.form-control:invalid");
        $('html, #apply-now-modal').animate({
          scrollTop: $(errorElements[0]).offset().top
        }, 2000);
				form.classList.add('was-validated');
      }, false);
		});
	}, false);
	})(); 

});