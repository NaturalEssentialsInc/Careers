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
			entries[i]["gsx$_cpzh4"] ? e.description = entries[i]["gsx$_cpzh4"].$t.replace(/(?:\r\n|\r|\n)/g, '<br>'): e.description = "";
			entries[i]["gsx$_cre1l"] ? e.duties = entries[i]["gsx$_cre1l"].$t.replace(/(?:\r\n|\r|\n)/g, '<br>'): e.duties = "";
			entries[i]["gsx$_chk2m"] ? e.skills = entries[i]["gsx$_chk2m"].$t.replace(/(?:\r\n|\r|\n)/g, '<br>'): e.skills = "";
			entries[i]["gsx$_ciyn3"] ? e.conditions = entries[i]["gsx$_ciyn3"].$t.replace(/(?:\r\n|\r|\n)/g, '<br>'): e.conditions = "";
			entries[i]["gsx$_ckd7g"] ? e.benefits = entries[i]["gsx$_ckd7g"].$t.replace(/(?:\r\n|\r|\n)/g, '<br>'): e.benefits = "";
			entries[i]["gsx$_clrrx"] ? e.type = entries[i]["gsx$_clrrx"].$t: e.type = "---";
			entries[i]["gsx$_cyevm"] ? e.status = entries[i]["gsx$_cyevm"].$t: e.status = "Inactive";

			console.log(e.status);

			list.push(e);

		}

		return list;

	}

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
		$("#position").append("Any");
	}

  // form.addEventListener('submit', e => {
  //   e.preventDefault();
    
  //   fetch(scriptURL, { method: 'POST', body: new FormData(form)})
  //     .then(response => console.log('Success!', response), 
  //     	alert('Your application has been successfully submitted!'),
  //     	$("#apply-now-careers").trigger("reset"),
  //     	$("#apply-now-modal").modal("hide"))
  //     .catch(error => alert('Error! Please re-submit your application!', error.message));

  // }) 
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