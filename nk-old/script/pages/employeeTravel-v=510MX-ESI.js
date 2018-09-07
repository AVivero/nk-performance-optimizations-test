var scrollInterval;
var ParternerAirlines = [];
var InterlineAirlinesData = [];
var tempScrollInterval = 1000; // 10 Sec

if (!console) {
	var console = {
		log: function () { },
		info: function () { }
	};
}

// Model Vars
var currentCulture = PageModel.culture;
var dayNameLabels = PageModel.dayNameLabels;
var childLabels = PageModel.childOptionLabels;
var adultLabels = PageModel.adultOptionLabels;

var bookingTypeLabels = (function () {
	var data = PageModel.bookingTypeOptionLabels;
	return data;
})();

var childLabel = PageModel.childLabel;

var monthData = (function () {
	var array = [];
	var data = PageModel.monthOptionLabels;
	if (data === undefined) {
		// do nothing
	} else {
		for (var i = 0, j = data.length; i < j; i++) {
			var txt = data[i];
			array.push({ key: i + 1, value: txt });
		}
	}
	return array;
})();

var dayData = (function () {
	var array = [];
	for (var i = 1; i <= 31; i++) {
		array.push({ key: i, value: i });
	}
	return array;
})();

var yearData = (function () {
	var array = [];
	for (var i = (new Date()).getFullYear(), j = i - 18; i >= j; i--) {
		array.push({ key: i, value: i });
	}
	return array;
})();

var yearDataFifties = (function () {
	var array = [];
	for (var i = (new Date()).getFullYear(), j = 1950; i >= j; i--) {
		array.push({ key: i, value: i });
	}
	return array;
})();

var maxPaxF = 9;
var maxPaxFH = 8;

// Support Vars
var minorDialogClosed = false;
var minorFeeAccepted = false;
var validPromoCode = false;
var childBirthDates = [];
var childLapOption = [];
var fromSearch, toSearch; // For station searches
var loginDialogClosed = false;
var dependentBirthDates = [];
var dependentsAge = [];

// Getter Functions
var adults = function () { return Number($("#paxAdults").val()); };
var children = function () { return Number($("#paxMinors").val()); };
var empAdult = 0;
var empInfant = 0;
var empChild = 0;
var UmnrNotAllowed = 0;

var stationFrom = function () { return $("#departCityCodeSelect").val(); };
var stationTo = function () { return $("#destCityCodeSelect").val(); };
var bookingType = function () { return $("#bookingType").val(); };
var autoCompleteText = function () { return $("#departCityAutoComplete").val(); };
var fromMultiCity1 = function () { return $("#fromMultiCity1").val(); };
var toMultiCity1 = function () { return $("#toMultiCity1").val(); };

var fromMultiCity2 = function () { return $("#fromMultiCity2").val(); };
var toMultiCity2 = function () { return $("#toMultiCity2").val(); };

var fromMultiCity3 = function () { return $("#fromMultiCity3").val(); };
var toMultiCity3 = function () { return $("#toMultiCity3").val(); };

var fromMultiCity4 = function () { return $("#fromMultiCity4").val(); };
var toMultiCity4 = function () { return $("#toMultiCity4").val(); };

var isMultiCity = function () { return $('#journeyMultiCity').prop('checked') === true; };

var globalDepartDate = function () { return moment($('#departDate').datepicker('getDate')); }
var globalReturnDate = function () { return moment($('#returnDate').datepicker('getDate')); }

var isInternationalFlight = function () {
	var from = stationFrom();
	var to = stationTo();

	var fromMultiCity = fromMultiCity1();
	var tomultiCity = toMultiCity1();

	var fromMultiCityOp2 = fromMultiCity2();
	var tomultiCityOp2 = toMultiCity2();

	var fromMultiCityOp3 = fromMultiCity3();
	var tomultiCityOp3 = toMultiCity3();

	var fromMultiCityOp4 = fromMultiCity4();
	var tomultiCityOp4 = toMultiCity4();

	if (isMultiCity()) {
		if (((fromMultiCity && fromMultiCity !== "" && stations[fromMultiCity].IsInternational === true) || (fromMultiCityOp2 && fromMultiCityOp2 != "" && stations[fromMultiCityOp2].IsInternational == true) || (fromMultiCityOp3 && fromMultiCityOp3 != "" && stations[fromMultiCityOp3].IsInternational == true) || (fromMultiCityOp4 && fromMultiCityOp4 != "" && stations[fromMultiCityOp4].IsInternational == true)) ||
			((tomultiCity && tomultiCity != "" && stations[tomultiCity].IsInternational == true) || (tomultiCityOp2 && tomultiCityOp2 != "" && stations[tomultiCityOp2].IsInternational == true) || (tomultiCityOp3 && tomultiCityOp3 != "" && stations[tomultiCityOp3].IsInternational == true) || (tomultiCityOp4 && tomultiCityOp4 != "" && stations[tomultiCityOp4].IsInternational == true))) {
			return true;
		}
	} else {
		if ((from && from != "" && stations[from].IsInternational == true) || (to && to != "" && stations[to].IsInternational == true)) {
			return true;
		}
	}
	return false;
};

function cultureSwitch(cultureCode) {
	$.cookie('cultureCode', cultureCode);
	$.cookie('currentTabSelected', key);
}

// Form Validation Rules
// Flight Search Tab
var FlightSearchValidator = new Validator();

FlightSearchValidator.addField("origin", [
	{ "fn": validateRequired, "msg": PageModel.originRequired }
]);

FlightSearchValidator.addField("destination", [
	{ "fn": validateRequired, "msg": PageModel.destinationRequired }
]);

FlightSearchValidator.addField("departuredate", [
	{ "fn": validateRequired, "msg": PageModel.departureRequired }
]);

FlightSearchValidator.addField("returndate", [
	{ "fn": validateRequired, "msg": PageModel.returnRequired, "condition": function () { return $('#journeyRoundTrip').prop('checked') == true; } }
]);

// Check-in Tab
var CheckInValidator = new Validator();
CheckInValidator.addField("checkin_name", [
	{ "fn": validateRequired, "msg": PageModel.lastNameRequired }
]);

CheckInValidator.addField("checkin_code", [
	{ "fn": validateRequired, "msg": PageModel.confirmationCodeRequired },
	{ "fn": validateConfirmationCode, "msg": PageModel.confirmationCodeFormatCheck }
]);

// Flight Status Tab
var FlightStatusValidator = new Validator();
FlightStatusValidator.addField("status_origin", [
	{ "fn": validateRequired, "msg": PageModel.originRequired }
]);

FlightStatusValidator.addField("status_destination", [
	{ "fn": validateRequired, "msg": PageModel.destinationRequired }
]);

FlightStatusValidator.addField("status_flightno", [
	{ "fn": validateRequired, "msg": PageModel.flightNoRequired }
]);

function CheckMarketRow(ctrlName) {
	return $("select[name='" + ctrlName + "'] option:selected").index() != 0;
}

function CheckAllMarketRow() {
	var bReturn = true;
	for (var i = 1; i <= 4; i++) {
		var toMultiCity = "toMultiCity" + i;
		var fromMultiCity = "fromMultiCity" + i;
		if (CheckMarketRow(toMultiCity) || CheckMarketRow(fromMultiCity)) {
			bReturn = false;
		}
	}
	return bReturn;
}

function MoveToNextPage(e, key) {
	e = window.event || e;
	if (e.keyCode == 13) {
		switch (key) {
			case "Booking":
				$("#book-travel-form").submit();
				break;

			case "Manage":
				$("#change-flight-form").find("button").click();
				break;

			case "Flight":
				$('#flight-status-form').submit();
				break;

			case "CheckIn":
				$("#check-in-form").find("button").click();
				break;

			//case "LoginPage":
			//    var loginBox = $("#login");
			//    loginBox.find("button").click();
			//    break;

			case "MultiCity":
				$("#book-travel-form").submit();
				break;

			case "YoungTravelers":
				if ($("#closePopup").length != 0 && $("#closePopup").is(':visible')) {
					$("#book-travel-form").submit();
				}
				break;
		}
	}
}

function CheckPreviousMarketRows(obj) {
	var bReturn = true;
	var CurrentRow = obj.id.substr(obj.id.length - 1);

	if (!CheckMarketRow("fromMultiCity" + CurrentRow))
		return bReturn;

	var toMultiCity = $("#toMultiCity" + CurrentRow).val();
	var fromMultiCity = $("#fromMultiCity" + CurrentRow).val();
	var departDate = $('#dateMultiCity' + CurrentRow).val();

	var toMultiCityTocheck;
	var fromMultiCityTocheck;
	var departDateTocheck;

	for (var i = CurrentRow - 1; i >= 1; i--) {
		toMultiCityTocheck = $("#toMultiCity" + i).val();
		fromMultiCityTocheck = $("#fromMultiCity" + i).val();
		departDateTocheck = $('#dateMultiCity' + i).val();

		if (toMultiCityTocheck == toMultiCity && fromMultiCityTocheck == fromMultiCity && departDateTocheck == departDate) {
			bReturn = false;
			break;
		}
	}
	return bReturn;
}

function CheckPreviousMarketDate(obj) {
	var bReturn = true;
	var CurrentRow = obj.id.substr(obj.id.length - 1);

	if (!CheckMarketRow("fromMultiCity" + CurrentRow))
		return bReturn;

	var departDate = new Date($('#dateMultiCity' + CurrentRow).val());

	var departDateTocheck;

	for (var i = CurrentRow - 1; i >= 1; i--) {
		departDateTocheck = new Date($('#dateMultiCity' + i).val());

		if (departDateTocheck > departDate) {
			bReturn = false;
			break;
		}
	}
	return bReturn;
}

// Flight Search Tab
var FlightSearchValidatorMulticity = new Validator();

FlightSearchValidatorMulticity.addField("originMutiCity1", [
	{ "fn": validateRequired, "msg": PageModel.originRequired, "condition": function () { return CheckAllMarketRow() || CheckMarketRow('toMultiCity1'); } }
]);

FlightSearchValidatorMulticity.addField("destinationMutiCity1", [
	{ "fn": validateRequired, "msg": PageModel.destinationRequired, "condition": function () { return CheckMarketRow('fromMultiCity1'); } }
]);

FlightSearchValidatorMulticity.addField("originMutiCity2", [
	{ "fn": validateRequired, "msg": PageModel.originRequired, "condition": function () { return CheckMarketRow('toMultiCity2'); } },
	{ "fn": CheckPreviousMarketRows, "msg": PageModel.sameMarket }
]);

FlightSearchValidatorMulticity.addField("destinationMutiCity2", [
	{ "fn": validateRequired, "msg": PageModel.destinationRequired, "condition": function () { return CheckMarketRow('fromMultiCity2'); } }
]);

FlightSearchValidatorMulticity.addField("originMutiCity3", [
	{ "fn": validateRequired, "msg": PageModel.originRequired, "condition": function () { return CheckMarketRow('toMultiCity3'); } },
	{ "fn": CheckPreviousMarketRows, "msg": PageModel.sameMarket }
]);

FlightSearchValidatorMulticity.addField("destinationMutiCity3", [
	{ "fn": validateRequired, "msg": PageModel.destinationRequired, "condition": function () { return CheckMarketRow('fromMultiCity3'); } }
]);

FlightSearchValidatorMulticity.addField("originMutiCity4", [
	{ "fn": validateRequired, "msg": PageModel.originRequired, "condition": function () { return CheckMarketRow('toMultiCity4'); } },
	{ "fn": CheckPreviousMarketRows, "msg": PageModel.sameMarket }
]);

FlightSearchValidatorMulticity.addField("destinationMutiCity4", [
	{ "fn": validateRequired, "msg": PageModel.destinationRequired, "condition": function () { return CheckMarketRow('fromMultiCity4'); } }
]);

FlightSearchValidatorMulticity.addField("dateMultiCityDisplay1", [
	{ "fn": validateRequired, "msg": PageModel.departureRequired, "condition": function () { return CheckMarketRow('toMultiCity1'); } }
]);

FlightSearchValidatorMulticity.addField("dateMultiCityDisplay2", [
	{ "fn": validateRequired, "msg": PageModel.departureRequired, "condition": function () { return CheckMarketRow('toMultiCity2'); } }
]);

FlightSearchValidatorMulticity.addField("dateMultiCityDisplay3", [
	{ "fn": validateRequired, "msg": PageModel.departureRequired, "condition": function () { return CheckMarketRow('toMultiCity3'); } }
]);

FlightSearchValidatorMulticity.addField("dateMultiCityDisplay4", [
	{ "fn": validateRequired, "msg": PageModel.departureRequired, "condition": function () { return CheckMarketRow('toMultiCity4'); } }
]);

// Check-in Tab
var CheckInValidator = new Validator();
CheckInValidator.addField("checkin_name", [
	{ "fn": validateRequired, "msg": PageModel.lastNameRequired }
]);
CheckInValidator.addField("checkin_code", [
	{ "fn": validateRequired, "msg": PageModel.confirmationCodeRequired },
	{ "fn": validateConfirmationCode, "msg": PageModel.confirmationCodeFormatCheck }
]);

// Change Flight Tab
var ChangeFlightValidator = new Validator();
ChangeFlightValidator.addField("change_name", [
	{ "fn": validateRequired, "msg": PageModel.lastNameRequired }
]);
ChangeFlightValidator.addField("change_code", [
	{ "fn": validateRequired, "msg": PageModel.confirmationCodeRequired },
	{ "fn": validateConfirmationCode, "msg": PageModel.confirmationCodeFormatCheck }
]);

var key;

// Toggling Tabs for Different Forms
function changeTab(e) {
	e.preventDefault();
	key = $(this).attr('href');
	if (key != '#') {
		switchToTab(key);
	}
}

function onTripTypeChange(e) {
	var $returnDate = $('#returnDate'),
		$returnDateDisplay = $('#returnDateDisplay'),
		$returnDateText = $('#returnDateText'),
		$returnDateParent = $('li.returnDateWrapper'),
		$adultsli = $("#adultsli"),
		$childrenli = $("#childrenli"),
		$dependentsli = $('#dependentsli'),
		$tripType = e ? e.target.value : $('input[name = "tripType"]').val();

	switch ($tripType) {

		case "roundTrip":
			$("#multiCity").hide();
			$("#returnOneway").show();
			$returnDateDisplay.trigger('blur');
			$returnDateText.trigger('blur');
			$returnDateParent.show();
			$("label[for='departDateDisplay']").text(PageModel.departureDateLabel);
			$("#placeHolder").before($dependentsli);
			$("#placeHolder").before($adultsli);
			$("#placeHolder").before($childrenli);
			$('#returnDateDisplay').show();
			$("label[for='returnDateDisplay']").show();
			break;

		case "multiCity":
			multiCityflightCounter = 0;
			$("#returnOneway").hide();
			$("#multiCity").show();
			$("#multiCityJourney3").hide();
			$("#multiCityJourney4").hide();
			$(".addFlight").show();
			$("#multiCityPlaceholder").before($dependentsli);
			$("#multiCityPlaceholder").before($adultsli);
			$("#multiCityPlaceholder").before($childrenli);
			if ($("#redeemMiles").is(":checked")) {
				$("#redeemMiles").attr("checked", false);
				$("#redeemMiles").val("false");
			}
			$('#paxAdults').setSelectByValue('1');
			$('#paxMinors').setSelectByValue('0');

			if (PageModel.culture == 'es-PR') {
				$(".addFlight").addClass('addFlightForSpanish');
			}
			else {
				$(".addFlight").addClass('addFlightForEnglish');
			}

			if ($("html").hasClass('ie8')) {
				if (PageModel.culture == 'es-PR') {
					$(".addFlight").addClass('addFlightForSpanishIE8');
				}
			}
			break;

		default:
			$("#multiCity").hide();
			$("#returnOneway").show();
			$("label[for='departDateDisplay']").text(PageModel.dateLabel);
			$returnDateText.val('');
			$returnDate.val('');
			$returnDateDisplay.val('');
			$returnDateParent.hide();
			//Reset Datepicker for one way
			$("#departDate").datepicker("option", "maxDate", '+1y');
			$("#placeHolder").before($dependentsli);
			$("#placeHolder").before($adultsli);
			$("#placeHolder").before($childrenli);

			break;
	}

	updateMarketingSection();

	AdjustPaxNumbers();

	//Hide error bubble in search widget
	$("#error_msg_bubble").hide();
	$("[validatekey]").removeClass('validationError');
}

function ShowForm(cultureCode) {
	$.cookie('cultureCode', cultureCode);
	if (key === "PBI") {
		var urlValue = String(window.location);
		var urlLength = urlValue.indexOf("#");
		if (urlLength > -1) {
			var urlHash = urlValue.substring(urlLength, urlValue.length);
			key = urlHash;
		}
	}
	if (key === "PBI") {
		window.location.href = "default.aspx?" + "culture=" + cultureCode;
	}
	else {
		window.location.href = "default.aspx?" + "culture=" + cultureCode + key;
	}
}

function switchToTab(key) {
	if (!key) return;

	var $tabs = $('#home_tabs').find('a');
	$tabs.removeClass('active');
	$tabs.filter('[href="' + key + '"]').addClass('active');
	ActiveTabContentArea(key);

	if (key !== "#booking-type") { FlightSearchValidator.hideBubble(); }
	else { $('#bookingType').focus(); }

	if (key !== "#check-in") CheckInValidator.hideBubble();
	else {
		if (_.isUndefined(UserLastName) || UserLastName == "") {
			$('#checkinLastName').focus();
		} else {
			$('#checkinConfirmationCode').focus();
		}
	}

	if (key !== "#change-flight") ChangeFlightValidator.hideBubble();
	else {
		if (_.isUndefined(UserLastName) || UserLastName === "") {
			$('#changeLastName').focus();
		} else {
			$('#changeConfirmationCode').focus();
		}
	}

	updateMarketingSection(key);
	key = key;
}

var formElems = {
	'flightOnly': {
		'bookingType': '#bookingType', 'select1': '#departCityCodeSelect', 'select2': '#destCityCodeSelect', 'radio1': '#journeyRoundTrip', 'radio2': '#journeyOneWay', 'radio3': '#journeyMultiCity', 'input1': '#departDateDisplay', 'input2': '#returnDateDisplay', 'select3': '#paxAdults', 'select4': '#paxMinors', 'input3': '#promoCode', 'checkbox': '#redeemMiles', 'select5': '#toMultiCity1', 'select6': '#fromMultiCity1', 'input4': '#dateMultiCityDisplay1', 'select7': '#toMultiCity2', 'select8': '#fromMultiCity2', 'input5': '#dateMultiCityDisplay2', 'select9': '#toMultiCity3', 'select10': '#fromMultiCity3', 'input6': '#dateMultiCityDisplay3', 'select11': '#toMultiCity4', 'select12': '#fromMultiCity4', 'input7': 'dateMultiCityDisplay4', 'div1': '#cbDependentList'
	},
};

var searchWidgetDefaultState = function () {
	resetSearchWidget();
	var defaultElem;
	for (defaultElem in formElems.flightOnly) {
		var eachDefaultElem = $(formElems.flightOnly[defaultElem]);
		eachDefaultElem.parent("li").show();
	}
}();


function resetSearchWidget() {
	$("#book-travel").find("ul.searchElems li").hide();
	$("ul.flightOnly").hide();
	$("#error_msg_bubble").hide();
}

function flightOptions() {
	$("#departCityAutoComplete").removeAttr("validatekey");
	$("#departCityCodeSelect").removeAttr("disable").attr("validateKey", "origin").show();
	$("#destCityCodeSelect").removeAttr("disable").attr("validateKey", "destination").show();
	$("label[for='departDateDisplay'], label[for='returnDateDisplay'], label[for='departCityCodeSelect']").show();
	$("label[for='checkInDate'], label[for='checkOutDate'], label[for='locationCodeSelect']").hide();
}

function flightOnly() {
	flightOptions();
	var defaultElem;
	for (defaultElem in formElems.flightOnly) {
		var eachDefaultElem = $(formElems.flightOnly[defaultElem]);
		eachDefaultElem.parents("li").show();
		if (eachDefaultElem.attr("id") == "journeyMultiCity") {
			eachDefaultElem.parents("li").show();
		}
	}

	$("label[for='departDateDisplay']").text(PageModel.departureDateLabel);

	if ($("html").hasClass('ie8')) {
		if (PageModel.culture == 'es-PR') {
			$(".flightOnlyType").addClass('flightOnlyTypeForSpanishIE8');
		}
		else {
			$(".flightOnlyType").addClass('flightOnlyTypeForEnglishIE8');
		}
	}
	else {
		if (PageModel.culture == 'es-PR') {
			$(".flightOnlyType").addClass('flightOnlyTypeForSpanish');
		}
		else {
			$(".flightOnlyType").addClass('flightOnlyTypeForEnglish');
		}
	}

	$("ul.flightOnly").show();
}

// Display selected tab content
function ActiveTabContentArea(key) {
	var $tabContent = $('.widget_container').children();
	$tabContent.removeClass('active');
	$tabContent.filter(key).addClass('active');
	if (key === "#booking-type") {
		resetSearchWidget();
		$('.show_all').hide();
		TriggerBookingTypeEvent('F');
	}
}

function TriggerBookingTypeEvent(bookingType) {
	ActiveTabContentArea('#book-travel');
	$("#bookingType").setSelectByValue(bookingType);
	$("#bookingType").trigger('change');
	$("#lblBookingType").text($('#bookingType :selected').text());
	resetSearchWidget();
	switch (bookingType) {
		case "F":
			flightOnly();
			break;
		default:
			flightOnly();
	}
	AdjustPaxNumbers();
}

function loadPlaceholders() {
	if (!Modernizr.input.placeholder) {
		$('input[placeholder]').each(function () {
			if ($.trim(this.value) == "") {
				this.value = $(this).attr('placeholder');
			}
		});
	}
}

function clearPlaceholders() {
	if (!Modernizr.input.placeholder) {
		$('input[placeholder]').each(function () {
			if (this.value == $(this).attr('placeholder')) {
				this.value = "";
			}
		});
	}
}

function getOptionsFragFromArray(array) {
	var frag = document.createDocumentFragment();
	for (var i = 0, j = array.length; i < j; i++) {
		var data = array[i];
		if (data) {
			var key = data.key;
			var value = data.value;
			//console.log(key+" = "+value);
			var opt = document.createElement("option");
			opt.value = key;
			opt.appendChild(document.createTextNode(value));
			frag.appendChild(opt);
		}
	}
	return frag;
}

function pupulatePartnerAirlines(partnerData) {
	var frag = document.createDocumentFragment();
	var optDefault = document.createElement("option");
	optDefault.value = "";
	optDefault.appendChild(document.createTextNode("Select"));
	frag.appendChild(optDefault);
	partnerData.sort(function (a, b) {
		return a.airlineName.toLowerCase() > b.airlineName.toLowerCase() ? 1 : -1;
	});
	for (var i = 0, j = partnerData.length; i < j; i++) {
		var data = partnerData[i];
		if (data) {
			var key = data.airlineName;
			var value = data.AirlineCode;
			var opt = document.createElement("option");
			opt.value = value;
			opt.appendChild(document.createTextNode(key));
			frag.appendChild(opt);
		}
	}
	var partnerAirlineSelect = document.getElementById('partnerAirlinesSelect');
	$("#partnerAirlinesSelect option").each(function () {
		$(this).remove();
	});
	partnerAirlineSelect.appendChild(frag);
}

function pushDataToSelects(target, data) {
	target.each(function () {
		var frag = getOptionsFragFromArray(data);
		$(this).append(frag);
		$(this).selectedIndex = 0;
	});
}

function populateBirthdateFields() {
	// Month Selects
	pushDataToSelects($("select.month"), monthData);
	// Day Selects
	pushDataToSelects($("select.day"), dayData);
	// Year Selects
	pushDataToSelects($("select.year"), yearData);
	// Year Selects fifty
	pushDataToSelects($("select.yearsFifties"), yearDataFifties);
}

function HeadlineController() {
	var target = $("#headlines dl");
	var content, newsItems, current, count, nextBtn, backBtn;

	function hide() {
		target.slideUp();
	}
	function show() {
		target.slideDown();
	}
	function showCurrent() {
		newsItems.removeClass('active');
		current.addClass('active');
	}
	function back() {
		//console.log("back()");
		var index = newsItems.index(current);
		if (index == 0) {
			current = newsItems.last();
		} else {
			current = current.prev();
		}
		//console.log("showing: " + index);
		showCurrent();
	}

	function next() {
		//console.log("next()");
		var index = newsItems.index(current);
		if (index == (count - 1)) {
			current = newsItems.first();
		} else {
			current = current.next();
		}
		//console.log("showing: " + index);
		showCurrent();
		if (scrollInterval == undefined) {
			scrollInterval = tempScrollInterval;
		}
		setTimeout(function () {
			next();
		}, scrollInterval);
	}

	(function () { // init
		content = target.find("ul");
		if (content.length > 0) {
			newsItems = content.children("li");
			count = newsItems.length;
			if (count > 0) {
				newsItems.each(function () {
					var $this = $(this);
					$this.attr('title', jQuery.trim($this.text()));
				});
				current = newsItems.first();
				showCurrent();
				show();
				var navItems = target.find('nav').children();
				if (count > 1) {
					backBtn = navItems.first();
					backBtn.click(back);
					nextBtn = navItems.last();
					nextBtn.click(next);
					if (scrollInterval == undefined) {

						scrollInterval = tempScrollInterval;
					}
					setTimeout(function () {
						next();
					}, scrollInterval);
				} else {
					navItems.hide();
				}
			} else {
				hide();
			}
		} else {
			hide();
		}
	})();
}

function copyHiddenDates() {
	var $departValue = $('#departDate'),
		$departDisplay = $('#departDateDisplay'),
		$returnValue = $('#returnDate'),
		$returnDisplay = $('#returnDateDisplay');
	var val = '';
	if ($departValue.val().trim() != "" && $departDisplay.val().trim() == "") {
		val = $departValue.val().trim();
		val = val.substring(0, val.indexOf(','));
		$departDisplay.val(val);
	}
	if ($returnValue.val().trim() != "" && $returnDisplay.val().trim() == "") {
		val = $returnValue.val().trim();
		val = val.substring(0, val.indexOf(','));
		$returnDisplay.val(val);
	}
}

var flightSearchSelects, flightStatusSelects;

//Fix Depart and return date if different just to make sure 
//both (actual hidden and user display) the date are same
function DepartReturnDateChangeCheck() {
	console.log("called DepartReturnDateChangeCheck()");
	var actualdepartDate = $("#departDate").val();
	actualdepartDate = actualdepartDate.substring(0, actualdepartDate.indexOf(','));
	console.log("actualdepartDate = " + actualdepartDate);
	var actualreturnDate = $("#returnDate").val();
	actualreturnDate = actualreturnDate.substring(0, actualreturnDate.indexOf(','));
	console.log("actualreturnDate = " + actualreturnDate);
	var displaydepartDate = $("#departDateDisplay").val();
	var displayreturnDate = $("#returnDateDisplay").val();
	if (actualdepartDate != "")
		$("#departDateDisplay").val(actualdepartDate);
	if (actualreturnDate != "")
		$("#returnDateDisplay").val(actualreturnDate);

}

function ChangeBookingType() {
	resetSearchWidget();

	switch (bookingType()) {
		case "F":
			flightOnly();
			break;
		default:
			flightOnly();
	}
	if (bookingType() == "F") {
		$('#paxAdults').setSelectByValue('1');
		$('#paxMinors').setSelectByValue('0');
	} else {
		$('#paxAdults').setSelectByValue('2');
		$('#paxMinors').setSelectByValue('0');
	}
	AdjustBookingMode();
}

function onlyNumber(obj) {
	if (/^\d+$/.test(obj.value) === false) {
		obj.value = "";
	}
}

// nkEmpLogin Tab
var nkEmpLogin = new Validator('#login-error');
nkEmpLogin.addField("login_nonrevorrev", [
	{ "fn": validateRequired, "msg": PageModel.nonrevorrevRequired }
]);

nkEmpLogin.addField("login_username", [
	{ "fn": validateRequired, "msg": PageModel.userIDRequired }
]);

nkEmpLogin.addField("login_password", [
	{ "fn": validateRequired, "msg": PageModel.pwdRequired }
]);

// oaLogin Tab
var oaLogin = new Validator('#login-error');
oaLogin.addField("partnerType", [
	{ "fn": validateRequired, "msg": PageModel.partnerTypeRequired }
]);

oaLogin.addField("partnerAirlines", [
	{ "fn": validateRequired, "msg": PageModel.partnerAirlines }
]);

oaLogin.addField("login_oaEmployeeID", [
	{ "fn": validateRequired, "msg": PageModel.empIDRequired },
	{ "fn": validateAlphanumeric, "msg": PageModel.empIDInvalid }
]);

oaLogin.addField("dohMonth", [
	{ "fn": validateRequired, "msg": PageModel.dohMonthRequired },
	{
		"fn": validateBirthDate,
		"msg": PageModel.dohRequired,
		"params": ["select[validatekey='dohDay']", "select[validatekey='dohYear']"],
		"dependents": ["select[validatekey='dohDay']", "select[validatekey='dohYear']"]
	}
]);

oaLogin.addField("dohDay", [
	{ "fn": validateRequired, "msg": PageModel.dohRequired }
]);

oaLogin.addField("dohYear", [
	{ "fn": validateRequired, "msg": PageModel.dohRequired }
]);

oaLogin.addField("login_verificationCode", [
	{ "fn": validateRequired, "msg": PageModel.verificationCodeRequired },
	{
		"fn": validateOAVerificationCode,
		"msg": PageModel.invalidVerificationCode,
		"params": [OAVerificationCode],
	}
]);

// Apply them here
$(document).ready(function () {
	$('#employee-login').modal({
		backdrop: 'static',
		keyboard: false
	});

	if ($.browser.msie) {
		$("body").addClass("ie");
	} else {
		$("body").addClass("no-ie");
	}

	// If placeholder functionality is not available, toggle input values with placeholder attr value
	if (!Modernizr.input.placeholder) {
		$('input[placeholder]').each(function () {
			var $this = $(this);
			var placeholder = $this.attr('placeholder');
			this.value = placeholder;
			$this.focus(function () {
				if (this.value === placeholder) { this.value = ""; }
			});
			$this.blur(function () {
				if ($.trim(this.value) === "") { this.value = placeholder; }
			});
			$this.blur();
		});
	}

	if (IsLoggedInEmployeePortal == "False") {
		pupulatePartnerAirlines(ParternerAirlines);     // populate partnerAirlines drop-down
	}
	else {
		// load dependents' DOBs
		var employee = getEmployeeData();
		if (employee != undefined && employee.Dependents != null) {
			var i = 0,
				dobIndex = -1;
			while (employee.Dependents[i] != undefined) {
				dobIndex = employee.Dependents[i].DateOfBirth.indexOf("T");
				//dob is in format yyyy-mm-dd
				dependentBirthDates.push(employee.Dependents[i].DateOfBirth.substring(0, dobIndex));
				i++;
			}
		}
	}

	LastNamePrepopulate();

	// Populate birthdate dropdowns 
	// TODO: maybe lazyload these for optimization
	populateBirthdateFields();

	//$("select.month,select.day,select.year").change(function () {
	$("#dateOfHireMonth,#dateOfHireDay,#dateOfHireYear").change(function () {
		var month = Number($("#dateOfHireMonth").val());
		var day = Number($("#dateOfHireDay").val());
		var year = Number($("#dateOfHireYear").val());
		AdjustDaysOfTheMonth("#dateOfHireDay", month - 1, year);
	});

	// Set tabbing events for homepage tabs
	$('#home_tabs').find('a').click(changeTab);
	$('.top_nav').find('a[href^="#"]').click(changeTab);

	var urlString = String(window.location);
	var urlHashIndex = urlString.indexOf("#");
	if (urlHashIndex > -1) {
		var urlHash = urlString.substring(urlHashIndex, urlString.length);
		if (urlHash != "#") {
			switchToTab(urlHash);
			window.scroll(0, 0);
			returnurlHash = urlHash;
		} else {
			returnurlHash = false;
		}
	} else {
		returnurlHash = false;
	}

	// Initialize Booking Type Drop Down
	var bookingTypeFrag = document.createDocumentFragment();
	var optionsCount = bookingTypeLabels.length;
	console.log(PageModel.culture);
	var typeField = $("#bookingType");
	var fieldParent = typeField.closest('li');
	fieldParent.show();

	var i = 0;
	var txt = '';
	var opt = null;
	for (; i < optionsCount; i++) {
		txt = bookingTypeLabels[i];
		opt = document.createElement("option");
		opt.appendChild(document.createTextNode(txt));
		switch (i) {
			case 0:
				opt.value = "F";
				opt.selected = true;
				break;
		}
		bookingTypeFrag.appendChild(opt);
		$('#bookingType')[0].appendChild(bookingTypeFrag);
	}

	$("#bookingType").change(function () {
		ChangeBookingType();
	});
	AdjustBookingMode();

	// Initialize Adult/Children Drop Downs
	var adultSelect = document.getElementById('paxAdults');
	var adultFrag = document.createDocumentFragment();
	for (i = 0, j = adultLabels.length; i < j; i++) {
		txt = adultLabels[i];
		opt = document.createElement("option");
		opt.value = i;
		opt.appendChild(document.createTextNode(txt));
		adultFrag.appendChild(opt);
	}
	adultSelect.appendChild(adultFrag);

	var childSelect = document.getElementById('paxMinors');
	var childFrag = document.createDocumentFragment();
	for (i = 0, j = childLabels.length; i < j; i++) {
		txt = childLabels[i];
		opt = document.createElement("option");
		opt.value = i;
		opt.appendChild(document.createTextNode(txt));
		childFrag.appendChild(opt);
	}
	childSelect.appendChild(childFrag);

	// Add/Remove options from Adults and Children drop-downs by
	$('#paxAdults,#paxMinors').change(function () {
		AdjustPaxNumbers();
	});

	// Event to toggle return flight date
	$('body').on('click', 'input[name="tripType"]', onTripTypeChange);
	onTripTypeChange();

	$('body').on('click', '#employee-login-form .details .employeeLoginElems label', function () {
		switch ($(this).prev().val()) {
			case "otherAirlines":
				$("#employeeTypeOA").prop('checked', true);  // Chrome needs to be explicitly set
				$("ul.nkEmpLogin").hide();
				$("ul.oaLogin").show();
				$("ul.travelType").hide();
				$(this).parent().parent().find('.active').removeClass('active');
				$(this).parent().addClass('active');
				$('#login-error,#login_fail').hide(); // Hide error message
				$('#login-button').text(PageModel.oaLoginBtn);
				break;

			default:
				$("#employeeTypeNK").prop('checked', true);  // Chrome needs to be explicitly set
				$("ul.nkEmpLogin").show();
				$("ul.oaLogin").hide();
				$("ul.travelType").show();
				$(this).parent().parent().find('.active').removeClass('active');
				$(this).parent().addClass('active');
				$('#login-error,#login_fail').hide(); // Hide error message
				$('#login-button').text(PageModel.nkEmpLoginBtn);
				break;
		}
	});

	if (jQuery.parseQuerystring() != undefined) {
		var queryString = jQuery.parseQuerystring();
		if ("oa" in queryString) {
			if (queryString.oa != 'undefined') {
				if (queryString.oa.toLowerCase() == "yes") {
					$('#employee-login-form .details .employeeLoginElems label').trigger('click');
				}
			}
		}
	}

	$('body').on('click', 'input[name="travelType"]', function () {
		switch (this.value) {
			case "oatravel":
				$("#oaTravelType").prop('checked', true);  // Chrome needs to be explicitly set
				$("ul.searchNKElems").hide();
				$("div.searchNKElems").hide();
				$("div.oaTravelNote").show();
				$("#spiritSearchSubmit").hide();
				$("#interlineSubmitButton").hide();
				populateInterlineAirlines(InterlineAirlinesData);
				break;

			default:
				$("#nkTravelType").prop('checked', true);  // Chrome needs to be explicitly set
				$("ul.searchNKElems").show();

				$("div.travelType").show();
				$("div.searchNKElems").show();
				if (!isMultiCity()) {
					$("div#multiCity").hide();
				}
				$("#spiritSearchSubmit").show();
				$("div.oaTravelNote").hide();
				$("#spiritSearchSubmit").show();
				$("div.oaTravelNote").hide();
				break;
		}

		updateMarketingSection();
	});

	$('body').on('click', 'select[name="businessLeisureSelect"]', function () {
		AdjustPaxNumbers();

		var employee = getEmployeeData();

		var selectedValue = $('#businessLeisureSelect').val();

		if (selectedValue == "LP") {

			// Display available Space Positive next to employee name and his/her dependents
			if (employee != null && employee.IsSpacePositiveAuthorized) {

				$('#cbDependentList').html('').append('<select id="cbDependentsSelect" multiple="multiple" name="Dependents" class="form-control" placeholder="Select Travelers" />');
				var name = GetName(employee.FirstName, employee.MiddleName, employee.LastName);
				var nameYear = '';
				if (employee.Dependents != null) nameYear = (IsNameMatch(name, -1, employee.Dependents) ? name + ' (' + employee.DateOfBirth.substring(0, 4) + ')' : name);
				var spacePositive = getSpacePositiveText(employee.PositiveSpacePassCount, employee.PositiveSpacePassUsed);
				
				$('#cbDependentsSelect').append('<option value="self">' + nameYear + spacePositive + '</option>');
				if (employee.Dependents != null) {
					var i = 0;
					dependentBirthDates = [];
					while (employee.Dependents[i] != undefined) {
						var yearOfBirth = '';
						if (IsNameMatch(name, i, employee.Dependents)) yearOfBirth = employee.Dependents[i].DateOfBirth.substring(0, 4);
						spacePositive = getSpacePositiveText(employee.Dependents[i].PositiveSpacePassCount, employee.Dependents[i].PositiveSpacePassUsed);
						addCheckBox(i, employee.Dependents[i].FirstName, employee.Dependents[i].MiddleName, employee.Dependents[i].LastName, yearOfBirth, spacePositive);
						dobIndex = employee.Dependents[i].DateOfBirth.indexOf("T");
						//employee.Dependents[i].DateOfBirth.substring(0, 10);
						//dob is in format yyyy-mm-dd
						dependentBirthDates.push(employee.Dependents[i].DateOfBirth.substring(0, dobIndex));
						i++;
					}
				}
				
				$('#cbDependentsSelect').select2({ dropdownAutoWidth: true, width: '100%', placeholder: 'Select Travelers' });
			}
		}
		else {
			if (selectedValue == "JS") {
				// For Jumpseat bookings, select OneWay as default
				var $oneWayRadio = $("#journeyOneWay");
				$oneWayRadio.prop('checked', true);
				$oneWayRadio.trigger('click');
			}

			// Display only employee name and his/her dependents + birth year
			if (employee != null) {
				$('#cbDependentList').html('').append('<select id="cbDependentsSelect" multiple="multiple" name="Dependents" class="form-control" placeholder="Select Travelers" />');
				var name = GetName(employee.FirstName, employee.MiddleName, employee.LastName);
				var nameYear = '';
				if (employee.Dependents != null) nameYear = (IsNameMatch(name, -1, employee.Dependents) ? name + ' (' + employee.DateOfBirth.substring(0, 4) + ')' : name);
				var spacePositive = '';
				
				$('#cbDependentsSelect').append('<option value="self">' + nameYear + spacePositive + '</option>');
				if (employee.Dependents != null) {
					var i = 0;
					dependentBirthDates = [];
					while (employee.Dependents[i] != undefined) {
						var yearOfBirth = '';
						if (IsNameMatch(name, i, employee.Dependents)) yearOfBirth = employee.Dependents[i].DateOfBirth.substring(0, 4);
						spacePositive = '';
						addCheckBox(i,
							employee.Dependents[i].FirstName,
							employee.Dependents[i].MiddleName,
							employee.Dependents[i].LastName,
							yearOfBirth,
							spacePositive);
						dobIndex = employee.Dependents[i].DateOfBirth.indexOf("T");
						employee.Dependents[i].DateOfBirth.substring(0, 10);
						//dob is in format yyyy-mm-dd
						dependentBirthDates.push(employee.Dependents[i].DateOfBirth.substring(0, dobIndex));
						i++;
					}
				}
				
				$('#cbDependentsSelect').select2({ dropdownAutoWidth: true, width: '100%', placeholder: 'Select Travelers' });
			}
		}

		if (selectedValue == 'SA' || selectedValue == 'LP' || selectedValue == 'SP') {
			$('#dependentsli').show();
		} else {
			$('#dependentsli').hide();
		}
		updateMarketingSection();

		AdjustPaxNumbers();
	});

	$('body').on('change', 'select[name="partnerTypeSelect"]', function () {
		var listAirlines = [];
		var filterValue = this.value;
		function containsValue(element, index, array) {
			return (element.jumpSeatFor.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0);
		};

		listAirlines = ParternerAirlines.filter(containsValue);
		pupulatePartnerAirlines(listAirlines);

	});

	// Setup Departure and Return Datepickers
	var today = new Date();
	var yearFromToday = new Date();
	yearFromToday.setFullYear(today.getFullYear() + 1);

	//fix for bug 18250 Unable to select the date for previous day at midnight
	var todayMinus3Hrs = new Date();
	todayMinus3Hrs.setHours(today.getHours() - 3);

	var dates = $("#departDate, #returnDate").datepicker({
		numberOfMonths: 2,
		dateFormat: 'MM dd, yy',
		monthNames: PageModel.monthOptionLabels,
		dayNamesMin: PageModel.dayNameLabels,
		minDate: todayMinus3Hrs, //today
		maxDate: yearFromToday,
		showOtherMonths: true,
		selectOtherMonths: true,

		beforeShowDay: function (date) {
			var drawDate = moment(date);

			var validDepart = globalDepartDate().isValid() && !globalDepartDate().isBefore(today, 'day') && !globalDepartDate().isAfter(globalReturnDate(), 'day');
			var validReturn = globalReturnDate().isValid() && !globalReturnDate().isBefore(today, 'day') && !globalReturnDate().isBefore(globalDepartDate(), 'day');

			var classes = '';

			if (validDepart && validReturn &&
				!drawDate.isSame(globalReturnDate(), 'day') &&
				!drawDate.isSame(globalDepartDate(), 'day') &&
				drawDate.isBetween(globalDepartDate(), globalReturnDate())) {
				classes = 'dateInRange';

			} else if (this.id === 'departDate') {
				// Depart date drawing logic
				if (!validDepart && drawDate.isSame(today, 'day')) {
					// We haven't selected a depart date, so blue dot shows on today
					classes = 'blueDotDate single';

				} else if (validDepart && drawDate.isSame(globalDepartDate(), 'day')) {
					// We have selected a depart date, and we're drawing that date.  
					// If the return date has also been selected, show a box around the depart date.
					// Otherwise, just show the blue dot with no outline.
					classes = validReturn && !globalReturnDate().isSame(globalDepartDate(), 'day') ? 'blueDotDate depart' : 'blueDotDate single';

				} else if (validReturn && drawDate.isSame(globalReturnDate(), 'day')) {
					// We have selected a return date, and we're drawing that date.  
					// If the depart date has also been selected, show a box around the return date.
					// Otherwise, just show the blue dot with no outline.
					classes = validDepart ? 'blueDotDate return' : 'blueDotDate single';
				}

			} else if (this.id === 'returnDate') {
				// Return date drawing logic
				if (!validReturn && drawDate.isSame(moment(today).add(7, 'days'), 'day')) {
					classes = 'blueDotDate single';

				} else if (validReturn && drawDate.isSame(globalReturnDate(), 'day')) {
					classes = validDepart && !globalDepartDate().isSame(globalReturnDate(), 'day') ? 'blueDotDate return' : 'blueDotDate single';

				} else if (validDepart && drawDate.isSame(globalDepartDate(), 'day')) {
					classes = validReturn ? 'blueDotDate depart' : 'blueDotDate single';
				}
			}

			return [true, classes];
		},
		beforeShow: function (input, instance) {
			var ele = $(input);
			var top = ele.parent().offset().top + ele.parent().outerHeight();

			setTimeout(function () {
				$('#ui-datepicker-div').css({ 'top': top });
			}, 1);

			if (!window.matchMedia) return;
			var mq = window.matchMedia("(max-width: 767px)");

			if (mq.matches) {
				$(this).datepicker("option", "numberOfMonths", [2, 1]);
			} else {
				$(this).datepicker("option", "numberOfMonths", 2);
			}
		},
		onSelect: function (selectedDate) {
			if (this.id == "departDate") {
				var $this = $(this);
				var instance = $this.data("datepicker"),
					date = $.datepicker.parseDate(
						instance.settings.dateFormat || $.datepicker._defaults.dateFormat,
						selectedDate,
						instance.settings
					);
				//set the front display value with the date selected with different format(MM dd)
				$this.next("input").val(selectedDate.substring(0, selectedDate.indexOf(',')));
				dates.not(this).datepicker("option", "minDate", date);
				var nextDate = dates.not(this).first().datepicker("getDate");
				if (!nextDate || date > nextDate) {
					dates.not(this).datepicker("setDate", date);
				}
				//Check if mask and front display have different values
			}
			DepartReturnDateChangeCheck();
			$("#ui-datepicker-div").hide();
		}
	});
	dates.not("#departDate").datepicker("option", "defaultDate", "+1w");

	//Bypass the Date display for Depart Date to Mask
	$("#departDateDisplay").focus(function () {
		$("#departDate").datepicker("show");
		$("#ui-datepicker-div").show();
	});

	//Bypass the Date display for Return Date to Mask
	$("#returnDateDisplay").focus(function () {
		$("#returnDate").datepicker("show");
		$("#ui-datepicker-div").show();
	});

	$("#paxAdults").focus(function () {
		$("#ui-datepicker-div").hide();
	});

	$("#destCityCodeSelect").focus(function () {
		$("#ui-datepicker-div").hide();
	});

	var datesMultiCity = $("#dateMultiCity1,#dateMultiCity2,#dateMultiCity3,#dateMultiCity4").datepicker({
		numberOfMonths: 2,
		dateFormat: 'MM dd, yy',
		monthNames: PageModel.monthOptionLabels,
		dayNamesMin: PageModel.dayNameLabels,
		minDate: today,
		maxDate: yearFromToday,
		showOtherMonths: true,
		selectOtherMonths: true,

		beforeShowDay: function (date) {
			var dt = moment(date);

			if ($(this).datepicker('getDate') == null && dt.isSame(new Date(), 'day')) {
				// we haven't picked a depart date yet, so default to today				
				return [true, 'blueDotDate single'];

			} else if (dt.isSame($(this).datepicker('getDate'), 'day')) {
				return [true, 'blueDotDate single'];
			}

			// drawing any other date.
			return [true, ''];
		},
		beforeShow: function (input, instance) {
			var ele = $(input);
			var top = ele.parent().offset().top + ele.parent().outerHeight();

			setTimeout(function () {
				$('#ui-datepicker-div').css({ 'top': top });
			}, 1);

			if (!window.matchMedia) return;
			var mq = window.matchMedia("(max-width: 767px)");

			if (mq.matches) {
				$(this).datepicker("option", "numberOfMonths", [2, 1]);
			} else {
				$(this).datepicker("option", "numberOfMonths", 2);
			}
		},
		onSelect: function (selectedDate) {
			if (this.id == "dateMultiCity1") {
				var $this = $(this);
				var instance = $this.data("datepicker"),
					date = $.datepicker.parseDate(
						instance.settings.dateFormat || $.datepicker._defaults.dateFormat,
						selectedDate,
						instance.settings
					);
				//set the front display value with the date selected with different format(MM dd)
				$this.next("input").val(selectedDate.substring(0, selectedDate.indexOf(',')));
			}
			else if (this.id == "dateMultiCity2") {
				var $this = $(this);
				var instance = $this.data("datepicker"),
					date = $.datepicker.parseDate(
						instance.settings.dateFormat || $.datepicker._defaults.dateFormat,
						selectedDate,
						instance.settings
					);
				//set the front display value with the date selected with different format(MM dd)
				$this.next("input").val(selectedDate.substring(0, selectedDate.indexOf(',')));
			}
			else if (this.id == "dateMultiCity3") {
				var $this = $(this);
				var instance = $this.data("datepicker"),
					date = $.datepicker.parseDate(
						instance.settings.dateFormat || $.datepicker._defaults.dateFormat,
						selectedDate,
						instance.settings
					);
				//set the front display value with the date selected with different format(MM dd)
				$this.next("input").val(selectedDate.substring(0, selectedDate.indexOf(',')));
			}
			else if (this.id == "dateMultiCity4") {
				var $this = $(this);
				var instance = $this.data("datepicker"),
					date = $.datepicker.parseDate(
						instance.settings.dateFormat || $.datepicker._defaults.dateFormat,
						selectedDate,
						instance.settings
					);
				//set the front display value with the date selected with different format(MM dd)
				$this.next("input").val(selectedDate.substring(0, selectedDate.indexOf(',')));
			}
		}
	});

	function SetMinMaxDate(marketIndex, date) {
		switch (marketIndex) {
			case 1:
				$("#dateMultiCity2").datepicker("option", "minDate", date);
				SetEmptyMinDate(3);
				SetEmptyMinDate(4);
				break;
			case 2:
				$("#dateMultiCity3").datepicker("option", "minDate", date);
				SetEmptyMinDate(4);
				$("#dateMultiCity1").datepicker("option", "maxDate", date);
				break;
			case 3:
				$("#dateMultiCity4").datepicker("option", "minDate", date);
				$("#dateMultiCity2").datepicker("option", "maxDate", date);
				SetEmptyMaxDate(1);
				break;
			case 4:
				$("#dateMultiCity3").datepicker("option", "maxDate", date);
				SetEmptyMaxDate(2);
				SetEmptyMaxDate(1);
				break;
		}
	}

	function SetEmptyMaxDate(marketIndexToSet) {
		var dateMarketToSet = $('#dateMultiCityDisplay' + marketIndexToSet).val();

		if (dateMarketToSet != '')
			return;

		for (var i = marketIndexToSet + 1; i <= 4; i++) {
			var dateMarketToCheck = $('#dateMultiCityDisplay' + i).val();
			if (dateMarketToCheck != '') {
				var date = dateMarketToCheck + ", " + $("#dateMultiCity" + i).data("datepicker").selectedYear;
				$("#dateMultiCity" + marketIndexToSet).datepicker("option", "maxDate", date);
				return;
			}
		}
	}

	function SetEmptyMinDate(marketIndexToSet) {
		var dateMarketToSet = $('#dateMultiCityDisplay' + marketIndexToSet).val();
		if (dateMarketToSet != '')
			return;

		for (var i = marketIndexToSet - 1; i > 0; i--) {
			var dateMarketToCheck = $('#dateMultiCityDisplay' + i).val();
			if (dateMarketToCheck != '') {
				var date = dateMarketToCheck + ", " + $("#dateMultiCity" + i).data("datepicker").selectedYear;
				$("#dateMultiCity" + marketIndexToSet).datepicker("option", "minDate", date);
				return;
			}
		}
	}

	$("#dateMultiCityDisplay1").focus(function () {
		$("#dateMultiCity1").datepicker("show");
	});

	$("#dateMultiCityDisplay2").focus(function () {
		$("#dateMultiCity2").datepicker("show");
	});

	$("#dateMultiCityDisplay3").focus(function () {
		$("#dateMultiCity3").datepicker("show");
	});

	$("#dateMultiCityDisplay4").focus(function () {
		$("#dateMultiCity4").datepicker("show");
	});

	$('#childBirthDates').on('hidden.bs.modal', MinorDialogClosed);
	$('#childBirthDates').on('hide.bs.modal', MinorDialogClosing);

	$("#childBirthDates").find("button").click(function () {
		minorDialogClosed = true;
		$("#childBirthDates").modal('hide');
	});

	$("#freeSpiritAwardNumber").modal();

	if (IsLoggedInEmployeePortal == "True" && $('#cbDependentsSelect option').length == 0) {
		$('#employee-login').modal('hide');
		$('#content, footer, .color_bar').show();

		// Add dependents to checkbox group        
		if ($("#travelers").val() != null) {
			$('#cbDependentList').html('').append('<select id="cbDependentsSelect" multiple="multiple" name="Dependents" class="form-control" placeholder="Select Travelers" />');
			var list = $("#travelers").val().split(",");
			for (var i = 0; i < list.length; i++) {
				if (i == 0) {
					
					$('#cbDependentsSelect').append('<option value="self">' + list[i] + '</option>');
				}
				else {
					var container = $('#cbDependentList');
					var select = $('#cbDependentsSelect');
					var inputs = container.find('input');
					var id = inputs.length + 1;
					$(select).append('<option class="dependantList" value="dependent' + i + '">' + list[i] + '</option>');
				}
			}
			if (list.length > 0) {
				$('#dependentsli').show();
			}

			$('#cbDependentsSelect').select2({ dropdownAutoWidth: true, width: '100%', placeholder: 'Select Travelers' });
		}
	}

	var originalAwardSubmitText = null;

	$("#employee-login-form").find("button").bind("click", function (event) {
		clearPlaceholders();
		var isNKemp = ($("#employeeTypeNK").prop('checked'));
		var loginData;
		if (isNKemp) {
			// Spirit employee
			var nonRevOrRev = encodeURIComponent($("#nonrevorrev").val());
			var username = encodeURIComponent($("#username").val());
			var pwd = encodeURIComponent($("#password").val());
			if (!nkEmpLogin.processForm(this)) {
				return false;
			} else {
				$("#login-button").attr('disabled', 'disabled');
				loginData = {
					username: username,
					pwd: pwd,
					type: nonRevOrRev,
					isNKemp: "true"
				};
			}
		} else {
			// Other Airlines employee
			var empID = encodeURIComponent($("#employeeID").val());
			var partner = encodeURIComponent($("#partnerAirlinesSelect").val());
			var type = encodeURIComponent($("#partnerTypeSelect").val());
			var dohMonth = encodeURIComponent(parseInt($("#dateOfHireMonth").val()));
			var dohDay = encodeURIComponent($("#dateOfHireDay").val());
			var dohYear = encodeURIComponent($("#dateOfHireYear").val());
			var verificationCode = encodeURIComponent($("#verificationCode").val());
			if (!oaLogin.processForm(this)) {
				return false;
			} else {
				$("#login-button").attr('disabled', 'disabled');
				loginData = {
					partner: partner,
					empid: empID,
					type: type,
					dohy: dohYear,
					dohm: dohMonth,
					dohd: dohDay,
					isNKemp: "false"
				};
			}
		}

		ajaxLogin(loginData);
		blockPage();
	});

	function ajaxLogin(loginData) {
		$.ajax({
			type: "POST",
			url: "AjaxEmployeeLogin.aspx",
			dataType: "json",
			data: loginData
		})
			.done(function (response, status, xhr) {
				if (response.result == "success") {
					IsLoggedInEmployeePortal = "True";
					IsRevenue = ($("#nonrevorrev").val() != null && $("#nonrevorrev").val() == "RV" ? "True" : "False");
					// Hide login popup and display widget
					$('#employee-login').modal('hide');
					$('#content, footer, .color_bar').show();

					// Display employee data
					$("li.employeeLoginElems").hide();
					$("p.employeeLoginElems").hide();
					$("#labelEmpID").text("Employee ID: " + response.employee.EmployeeID);
					if (response.employee.FirstName != null && response.employee.LastName != null) {
						// NK employee
						setEmployeeData(response.employee);
						$(".user_info").html(response.employee.FirstName);

						if (IsRevenue === "True") {
							// Revenue Travel
							if (enableRevenueBooking == 'true' && $("#businessLeisureSelect option[value='RV']").length == 0) {
								$("#businessLeisureSelect").append('<option value="RV">Revenue Booking</option>');
							}
							toggleForRevenue(IsRevenue);
						}
						else {
							// Non-Revenue Travel

							// Space Available
							if ($("#businessLeisureSelect option[value='SA']").length == 0) {
								$("#businessLeisureSelect").append('<option value="SA">Space Available</option>');
								$("#businessLeisureSelect").val("SA");
							}

							// Jumpseat
							if (response.employee.JumpSeatCertified && $("#businessLeisureSelect option[value='JS']").length == 0) {
								$("#businessLeisureSelect").append('<option value="JS">Jumpseat</option>');
								$("#businessLeisureSelect").val("JS");
							}
							else {
								$("#businessLeisureSelect option[value='JS']").remove();
							}

							// Leisure Positive
							if ((response.employee.SpacePositive && $("#businessLeisureSelect option[value='LP']").length == 0)
								|| (enableDirectorsLeisurePositive == 'true' && response.employee.IsSpacePositiveAuthorized && $("#businessLeisureSelect option[value='LP']").length == 0)) {
								$("#businessLeisureSelect").append('<option value="LP">Leisure Positive</option>');
							}
							else {
								$("#businessLeisureSelect option[value='LP']").remove();
							}

							// COBUS = Positive Space Business
							if (response.employee.COBUSAuthorized && $("#businessLeisureSelect option[value='SP']").length == 0) {
								$("#businessLeisureSelect").append('<option value="SP">Positive Space Business</option>');
							}
							else {
								$("#businessLeisureSelect option[value='SP']").remove();
							}

							// Buddy Pass
							if (enableBuddyPass == 'true' && $("#businessLeisureSelect option[value='P']").length == 0) {
								$("#businessLeisureSelect").append('<option value="P">Buddy Pass</option>');
							}
						}

						// Add dependents to checkbox group
						var i = 0;
						var dobIndex = 0;
						if (response.employee != null) {
							$('#cbDependentList').html('').append('<select id="cbDependentsSelect" multiple="multiple" name="Dependents" class="form-control" placeholder="Select Travelers"/>');
							var name = GetName(response.employee.FirstName, response.employee.MiddleName, response.employee.LastName);
							var nameYear = '';
							if (response.employee.Dependents != null) nameYear = (IsNameMatch(name, -1, response.employee.Dependents) ? name + ' (' + response.employee.DateOfBirth.substring(0, 4) + ')' : name);
							$('#cbDependentsSelect').append('<option value="self">' + nameYear + '</option>');
							dependentBirthDates = [];
							if (response.employee.Dependents != null) {
								var spacePositive = '';
								while (response.employee.Dependents[i] != undefined) {
									var yearOfBirth = '';
									if (IsNameMatch(name, i, response.employee.Dependents)) yearOfBirth = response.employee.Dependents[i].DateOfBirth.substring(0, 4);
									addCheckBox(i, response.employee.Dependents[i].FirstName, response.employee.Dependents[i].MiddleName, response.employee.Dependents[i].LastName, yearOfBirth, spacePositive);
									dobIndex = response.employee.Dependents[i].DateOfBirth.indexOf("T");
									response.employee.Dependents[i].DateOfBirth.substring(0, 10);
									//dob is in format yyyy-mm-dd
									dependentBirthDates.push(response.employee.Dependents[i].DateOfBirth.substring(0, dobIndex));
									i++;
								}
							}

							$('#dependentsli').show();

							$('#cbDependentsSelect').select2({ dropdownAutoWidth: true, width: '100%', placeholder: 'Select Travelers' });
						}
					}
					else {
						// Other Airline employee
						$("#businessLeisureSelect option[value='SA']").remove();
						if ($("#businessLeisureSelect option[value='JS']").length == 0) {
							$("#businessLeisureSelect").append('<option value="JS">Jumpseat</option>');
							$("#businessLeisureSelect").val("JS");
						}
						$(".user_info").html(response.employee.LastName + " " + PageModel.oaEmployeeLabel);
					}
					AdjustBookingMode();
					$(".log_in_user").show();
				}
				else {
					// ERROR - failed to logged in
					$('#login_fail').text(PageModel.loginFail).show();
					$("#login-button").removeAttr('disabled');
				}
				unBlockPage();
			})
			.fail(function (jqXHR, textStatus) {
				unBlockPage();
				$('#login_fail').text(PageModel.loginFail).show();
				$("#login-button").removeAttr('disabled');

			});
	}

	$('body').on('keydown', '#employee-login-form .nkEmpLogin input, #employee-login-form .oaLogin input', function (e) {
		var e = window.event || e;
		if (e.keyCode == 13) {
			$("#employee-login-form").find("button").click();
			return false;
		}
	});

	$('body').on('change', '#dateOfHireMonth,#dateOfHireDay,#dateOfHireYear', function () {
		//Hide error bubble in search widget
		$("#login-error").hide();
		$("[validatekey]").removeClass('validationError');
	});

	function addCheckBox(index, firstName, middleName, lastName, year, spacePositive) {
		var container = $('#cbDependentList');
		var select = $('#cbDependentsSelect');
		var inputs = container.find('input');
		var id = inputs.length + 1;

		var name = firstName;
		if (middleName == null)
			name = name + ' ' + lastName;
		else
			name = name + ' ' + middleName + ' ' + lastName;

		var nameYear = name;
		if (year.length > 0)
			nameYear = name + ' (' + year + ')';

		$(select).append('<option class="dependantList" value="dependent' + index + '">' + nameYear + spacePositive + '</option>');
	}

	$("#unaccompaniedMinorAccept").find("button").click(function () {
		minorFeeAccepted = true;
		$("#unaccompaniedMinorAccept").modal('hide');
		$("#book-travel-form").submit();
	});

	$("#unaccompaniedMinorNotAllowed").find("button").click(function () {
		childBirthDates = [];
		childLapOption = [];
		$("#childBirthDates").find("p[class='actions']").hide();
		$("#unaccompaniedMinorNotAllowed").modal('hide');
	});

	$("#cancelMinorFeeAcceptance").click(function () {
		minorFeeAccepted = false;
		childBirthDates = [];
		childLapOption = [];
		$("#childBirthDates").find("p[class='actions']").hide();
		$('#unaccompaniedMinorAccept').modal('hide');
	});

	$("#closePopup").click(function () {
		$('#childBirthDates').modal('hide');
	});

	$("#childBirthDates").find("p[class='actions']").hide();

	// Continue without hotel button should work same as
	// Flight Only path
	$("#continueWithoutHotel").click(function () {
		$("#bookingType").unbind("change");
		$("#bookingType").val("F");
		$("#book-travel-form").submit();
	});

	function clearValuesCarOnly() {
		$("#departCityAutoComplete, #departDateDisplay, #returnDateDisplay").val("");
	}

	// Event to trigger form validation
	$('#book-travel-form').submit(function (event) {
		//console.log("submitting!!!");
		//console.info(event.target);

		$('div.insufficientLP').hide();

		var lblBookingType = $("#lblBookingType").text();
		switch (lblBookingType) {
			case 'Car':
			case 'Auto':
				$("#bookingType").val("C");
				break;
			case 'Hotel':
				$("#bookingType").val("H");
				break;
			default:
				break;
		}
		clearStationLists(true);
		clearPlaceholders();
		copyHiddenDates();
		var target = this.elements[0];
		if (!VerifyTrip()) { loadPlaceholders(); event.preventDefault(); return; }
		if ($('#journeyMultiCity').prop('checked') == true) {
			if (!FlightSearchValidatorMulticity.processForm(target)) { loadPlaceholders(); event.preventDefault(); return; }
		}
		else {
			if (!FlightSearchValidator.processForm(target)) { loadPlaceholders(); event.preventDefault(); return; }
		}

		if ($("#businessLeisureSelect").val() == "P") {
			// Buddy Passes
			//if (!VerifyPassengers()) { loadPlaceholders(); event.preventDefault(); return; }
			//if (!VerifyMinors()) { loadPlaceholders(); event.preventDefault(); return; }
			//if (!VerifyBirthDates()) { loadPlaceholders(); event.preventDefault(); return; }
		}
		else {

			if ($("#businessLeisureSelect").val() == "LP") {
				var employee = getEmployeeData();
				if (employee != null && employee.IsSpacePositiveAuthorized) {
					// validate the available LPs
					var numberOfJourneys = 1;
					if ($('#journeyRoundTrip').prop('checked') == true || $('#journeyMultiCity').prop('checked') == true) {
						numberOfJourneys = 2 + multiCityflightCounter;
					}

					var selectedCounter = 0;

					for (var i = 0; i < $('#cbDependentsSelect option').length; i++) {
						if ($('#cbDependentsSelect option')[i].selected) {

							selectedCounter++;

							if (i == 0) {
								// employee
								if (!verifyLeisurePositiveAllowance(numberOfJourneys, employee.PositiveSpacePassCount, employee.PositiveSpacePassUsed)) {
									// Cannot proceed... Employee has insufficient LPs available							        
									event.preventDefault();
									return;
								}
							}
							else {
								// dependents
								if (!verifyLeisurePositiveAllowance(numberOfJourneys, employee.Dependents[i - 1].PositiveSpacePassCount, employee.Dependents[i - 1].PositiveSpacePassUsed)) {
									// Cannot proceed... Dependent has insufficient LPs available
									event.preventDefault();
									return;
								}
							}
						}
					}

					if (selectedCounter == 0) {
						// There was no selection, assume only the employee is traveling
						// Verify employee has Leisure Positive allowance
						if (!verifyLeisurePositiveAllowance(numberOfJourneys, employee.PositiveSpacePassCount, employee.PositiveSpacePassUsed)) {
							// Cannot proceed... Employee has insufficient LPs available							        
							event.preventDefault();
							return;
						}
					}
				}

			}

			getDependentsAge(dependentBirthDates);

			CollectChildBirthDates();
			$("#birthdates").val(childBirthDates.toString());
			$("#lapoption").val(childLapOption.toString());

			empInfant = 0;
			empAdult = 0;
			empChild = 0;
			var selectedCount = 0;
			var selectedIndex = "";
			for (var i = 0; i < $('#cbDependentsSelect option').length; i++) {
				if ($('#cbDependentsSelect option')[i].selected) {
					selectedCount++;
					if (selectedIndex.length > 0) selectedIndex += ",";
					selectedIndex += i;
					if (i > 0) {
						if (dependentsAge[i - 1] < 2) {
							//Infants
							empInfant++;

						}
						else if (dependentsAge[i - 1] >= 2 && dependentsAge[i - 1] < 15) {
							//Child
							empChild++;
							if (dependentsAge[i - 1] <= 5) {
								UmnrNotAllowed++;
							}
						}
						else if (dependentsAge[i - 1] >= 15) {
							//Adult
							empAdult++;
						}
					}
					else {
						empAdult++;
					}
				}
			}

			if (empInfant > empAdult) {
				$('#lapchildMismatch').modal({ modal: true }); // Show mismatch popup error
				childBirthDates = [];
				childLapOption = [];
				// Cannot proceed... Number of lap infants is greater than number of adults
				event.preventDefault();
				return;
			}

			//  There was no selection, assume only the employee is traveling
			if (selectedCount == 0) {
				selectedCount = 1;
				selectedIndex = "0";
				empAdult = 1;
			}

			$("#paxAdults").val(empAdult);
			$("#paxMinors").val(empChild);
			$("#paxInfants").val(empInfant);
			$("#travelers").val(selectedIndex);

			adults = function () { return Number(empAdult); };
			children = function () { return Number(empChild + empInfant); };
		}

		if (!VerifyPassengers()) { loadPlaceholders(); event.preventDefault(); return; }
		if (!VerifyMinors()) { loadPlaceholders(); event.preventDefault(); return; }
		if (!VerifyBirthDates()) { loadPlaceholders(); event.preventDefault(); return; }

		setSearchSelectionCookie();
		PageModel.issubmitClicked = true;

		blockPage();
	});

	$('#flight-status-form').submit(function (event) {
		clearStationLists(true);
		clearPlaceholders();
		var target = this.elements[0];
		if (!FlightStatusValidator.processForm(target)) { loadPlaceholders(); event.preventDefault(); return; }
		blockPage();
	});

	flightSearchSelects = new StationSearchBySelect($("#departCityCodeSelect"), $("#destCityCodeSelect"), $("#bookingType"), $("#locationCodeSelect"));
	flightStatusSelects = new StationSearchBySelect($("#statusDepartCitySelect"), $("#statusDestCitySelect"));
	flightSearchMultiCity1Selects = new StationSearchBySelect($("#fromMultiCity1"), $("#toMultiCity1"), $("#bookingType"));
	flightSearchMultiCity2Selects = new StationSearchBySelect($("#fromMultiCity2"), $("#toMultiCity2"), $("#bookingType"));
	flightSearchMultiCity3Selects = new StationSearchBySelect($("#fromMultiCity3"), $("#toMultiCity3"), $("#bookingType"));
	flightSearchMultiCity4Selects = new StationSearchBySelect($("#fromMultiCity4"), $("#toMultiCity4"), $("#bookingType"));

	$('#fromMultiCity1,#fromMultiCity2,#fromMultiCity3,#fromMultiCity4,#toMultiCity1,#toMultiCity2,#toMultiCity3,#toMultiCity4,#departCityCodeSelect,#destCityCodeSelect,#locationCodeSelect').change(function () {
		AdjustPaxNumbers();
	});

	SetDefaultValues();
	CheckForLoadErrors();

	$('#closeButton_Under5').click(function () {
		$('#childUnder5').modal('hide');
	});

	$('#closeButton_Lapchild').click(function () {
		$('#lapchildMismatch').modal('hide');
	});

	$('#closeButton_childSixDay').click(function () {
		$('#childSixDay').modal('hide');
	});

	$('#closeButton_namePnrMismatch').click(function () {
		$('#namePnrMismatch').modal('hide');
	});

	$("#check-in-form").find("button").click(function (event) {
		clearPlaceholders();
		if (!CheckInValidator.processForm(this)) {
			loadPlaceholders();
			event.preventDefault();
			return false;
		} else {
			$("#check-in-button").attr('disabled', 'disabled');
			var dataString = 'recordlocator=' + $("#checkinConfirmationCode").val() + '&lastname=' + $("#checkinLastName").val() + '&type=check-in';
			RetrieveBooking(dataString);
			blockPage();
		}
	});

	$("#change-flight-form").find("button").click(function (event) {
		clearPlaceholders();
		if (!ChangeFlightValidator.processForm(this)) {
			loadPlaceholders();
			event.preventDefault();
			return false;
		} else {
			$("#change-flight-button").attr('disabled', 'disabled');
			var dataString = 'recordlocator=' + $("#changeConfirmationCode").val() + '&lastname=' + $("#changeLastName").val() + '&type=change-flight';
			RetrieveBooking(dataString);
			blockPage();
		}
	});

	$("#cancel-flight-form").find("button").click(function (event) {
		clearPlaceholders();
		if (!CancelFlightValidator.processForm(this)) {
			loadPlaceholders();
			event.preventDefault();
			return false;
		} else {
			$("#cancel-flight-button").attr('disabled', 'disabled');
			var dataString = 'recordlocator=' + $("#cancelConfirmationCode").val() + '&lastname=' + $("#cancelLastName").val() + '&type=cancel-flight';
			RetrieveBooking(dataString);
			blockPage();
		}
	});

	if ($.browser.msie == true && $.browser.version == '7.0' && (document.documentMode === 7 || typeof (document.documentMode) === "undefined")) {
		$("#fsNumber").find("li").show();
	}

	if (location.hash === "#book-travel") {
		
	}

	switch (location.hash) {
		case '#book-travel':
			$("#lblBookingType").text($('#bookingType :selected').text());
			$('a[href="#booking-type"]').click();
			break;

		case '#my-trips':
			$('a[href="#change-flight"]').click();
			break;

		case '#checkin':
			$('a[href="#check-in"]').click();
			break;

		case '#flight-status':
			$('a[href="#flight-status"]').click();
			break;
	}
});

$(window).on('load', function () {
	setEmployeeData(employee);
	switchToTab($.cookie('currentTabSelected'));
	toggleForRevenue(IsRevenue);
});

function VerifyTrip() {
	var from, to, departDate, toDate;
	var retVal = true;

	if ($('#journeyMultiCity').prop('checked') == true) {
		from = fromMultiCity1();
		to = toMultiCity1();
		departDate = new Date(ToENStringDate($("#dateMultiCity1").val()));
		toDate = '';

		var from2 = $("#fromMultiCity2").val();
		var to2 = $("#toMultiCity2").val();
		var departDate2 = new Date(ToENStringDate($("#dateMultiCity2").val()));

		var from3 = $("#fromMultiCity3").val();
		var to3 = $("#toMultiCity3").val();
		var departDate3 = new Date(ToENStringDate($("#dateMultiCity3").val()));

		var from4 = $("#fromMultiCity4").val();
		var to4 = $("#toMultiCity4").val();
		var departDate4 = new Date(ToENStringDate($("#dateMultiCity4").val()));

		retVal = validateCityPairRules(from, to, departDate, toDate) && validateCityPairRules(from2, to2, departDate2, toDate)
			&& validateCityPairRules(from3, to3, departDate3, toDate) && validateCityPairRules(from4, to4, departDate4, toDate);
	}
	else {
		//oneWay and roundtrip
		from = stationFrom();
		to = stationTo();
		departDate = new Date(ToENStringDate($("#departDate").val()));
		toDate = new Date(ToENStringDate($("#returnDate").val()));

		//toDate isnt set on one way so may have invalid value
		if ($('#journeyOneWay').prop('checked') == true) toDate = '';

		retVal = validateCityPairRules(from, to, departDate, toDate);
	}

	return retVal;
}

function VerifyBirthDates() {
	for (var i = 0; i < childBirthDates.length; i++) {

		var departDate;
		if ($('#journeyMultiCity').prop('checked') == true) {
			departDate = new Date($('#dateMultiCity1').datepicker("getDate"));
		}
		else {
			departDate = new Date($('#departDate').datepicker("getDate"));
		}

		var birthDate = new Date(childBirthDates[i]);

		departDate = new Date(departDate.getTime() - 6 * 24 * 60 * 60 * 1000); // remove 6 days to the departure date for infants 6 days and under
		if (birthDate >= departDate) {
			$('#childSixDay').modal();
			childBirthDates = [];
			childLapOption = [];
			return false; // infant is 6 days old or under
		}
	}
	return true;
}

function setSearchSelectionCookie() {
	CookieHelper.erase("FlightSearch");
	var json = [];
	json.push('{"BookingType":"');
	json.push($("#bookingType").val());

	json.push('","From":"');
	json.push($("#departCityCodeSelect").val());

	json.push('","To":"');
	json.push($("#destCityCodeSelect").val());

	json.push('","TripType":"');
	json.push("roundTrip");

	json.push('","DepartureDate":"');
	json.push($("#departDate").val());

	json.push('","ReturnDate":"');
	json.push($("#returnDate").val());

	json.push('","Adults":"');
	json.push($("#paxAdults").val());

	json.push('","Children":"');
	json.push($("#paxMinors").val());

	json.push('","Language":"');
	json.push(PageModel.culture);

	json.push('"}');
	var jsonString = escape(json.join('')); // Escape the character not supported by Cookie engine 
	//console.log(jsonString);
	var days = 0.00625; // 9 mins converted to fraction of one day
	CookieHelper.create("FlightSearch", jsonString, days);
}

function setMultiCityValues() {
	if (bookingType() == "F" && isMultiCity()) {
		departCityCodeSelect.val(fromMultiCity1());
		destCityCodeSelect.val(toMultiCity1());
	}
}

function PopulateSearchWidget() {
	if (jQuery.parseQuerystring() != undefined) {
		var searchData = jQuery.parseQuerystring();
		var selection = searchData;
		if ("BookingType" in searchData) {
			if (selection.ReturnDate != undefined) {
				var formatReturnDate = selection.ReturnDate.split("/");
				var buildReturnDate = dateFormat.monthsEn[formatReturnDate[0] - 1] + " " + formatReturnDate[1] + ", " + formatReturnDate[2];
				selection.ReturnDate = buildReturnDate;
			}
			if (selection.DepartureDate != undefined) {
				var formatDepartDate = selection.DepartureDate.split("/");
				var buildDepartDate = dateFormat.monthsEn[formatDepartDate[0] - 1] + " " + formatDepartDate[1] + ", " + formatDepartDate[2];
				selection.DepartureDate = buildDepartDate;
			}
			selection.Language = "en-US";

			//Assign Trip Type
			selection.TripType = selection.BookingType == "F" ?
				(selection.TripType != undefined ? (selection.TripType == "OW" ? "oneWay" : "roundTrip")
					: "roundTrip")
				: "roundTrip";

			//ReturnDate date is unavailable TripType will be one way
			if (selection.DepartureDate != undefined && (selection.ReturnDate == undefined || selection.ReturnDate == null) && selection.BookingType == "F") {
				selection.TripType = "oneWay";
			}

		} else {
			if ("error" in searchData) {
				//if error then populate search widget from cookies for "continue without" options
				var searchData = unescape(CookieHelper.read("FlightSearch")); // UnEscape the character not supported by Cookie engine back
				var selection = jQuery.parseJSON(searchData);
			}
			else {
				searchData = null;
			}
		}
	} else {
		var searchData = unescape(CookieHelper.read("FlightSearch")); // UnEscape the character not supported by Cookie engine back
		var selection = jQuery.parseJSON(searchData);
	}
	if (searchData != null && searchData != 'null') {
		$("#bookingType").val(selection.BookingType.toUpperCase());
		if (returnurlHash == false || returnurlHash == "#book-travel") {
			TriggerBookingTypeEvent(selection.BookingType.toUpperCase());
		}
		if (selection.Adults != undefined) { $("#paxAdults").setSelectByValue(selection.Adults); }
		if (selection.Children != undefined) { $("#paxMinors").setSelectByValue(selection.Children); }

		var savedReturnDate = selection.ReturnDate;
		var savedDepartDate = selection.DepartureDate;
		if (PageModel.culture != selection.Language && selection.ReturnDate != undefined) {
			savedReturnDate = SwapStringDateCulture(savedReturnDate, selection.Language);
		}
		if (PageModel.culture != selection.Language && selection.DepartureDate != undefined) {
			savedDepartDate = SwapStringDateCulture(savedDepartDate, selection.Language); //ToENStringDate
		}
		if (selection.HotelOnlyAutoComplete != undefined) { $("#departCityAutoComplete").val(selection.HotelOnlyAutoComplete); }
		if (selection.HotelOnlyAutoCompleteHidden != undefined) { $("#autoCompleteValue").val(selection.HotelOnlyAutoCompleteHidden); }
		if (selection.DepartureDate != undefined && new Date(selection.DepartureDate) >= new Date()) {
			$("#departDate").val(savedDepartDate);
			var depDate = new Date($('#departDate').datepicker("getDate"));
			$("#returnDate").datepicker("option", "minDate", depDate);
			$("#returnDate").datepicker("setDate", depDate);
		}
		if (selection.ReturnDate != undefined && new Date(selection.ReturnDate) >= new Date()) { $("#returnDate").val(savedReturnDate); }
		if (selection.ReturnDate != undefined && new Date(selection.ReturnDate) >= new Date()) { $("#returnDateDisplay").val(savedReturnDate.substring(0, savedReturnDate.indexOf(","))); }
		if (selection.DepartureDate != undefined && new Date(selection.DepartureDate) >= new Date()) { $("#departDateDisplay").val(savedDepartDate.substring(0, savedDepartDate.indexOf(","))); }
		$("input[name='tripType']").removeProp("checked");
		if (selection.PromoCode != undefined) { $("input#promoCode").val(selection.PromoCode.toUpperCase()); }
		if (selection.TripType == "roundTrip") {
			$("#journeyRoundTrip").prop("checked", true); //replaced prop with attr as it does not work in chrome
			//refersh the content: chrome does not referesh after removeProp: bug 8744
			$("#journeyRoundTrip").parent().html($("#journeyRoundTrip").parent().html());
			//make sure the return date box is visible
			var $returnDate = $('#returnDate'),
				$returnDateParent = $returnDate.closest('li');
			$returnDateParent.show();
			$('#returnDateDisplay').show();
			$("label[for='returnDateDisplay']").show();
		} else if (selection.TripType == "multiCity") {
			$("#journeyMultiCity").prop("checked", true); //replaced prop with attr as it does not work in chrome
			//refersh the content: chrome does not referesh after removeProp: bug 8744
			$("#journeyMultiCity").parent().html($("#journeyMultiCity").parent().html());
		} else {
			$("#journeyOneWay").prop("checked", true);
			$("#journeyOneWay").parent().html($("#journeyOneWay").parent().html());
			var $returnDate = $('#returnDate'),
				$returnDateDisplay = $('#returnDateDisplay'),
				$returnDateText = $('#returnDateText'),
				$returnDateParent = $returnDate.closest('li');
			$returnDateText.val('');
			$returnDate.val('');
			$returnDateDisplay.val('');
			$returnDateParent.hide();
		}

		if (selection.From != undefined) {
			if ($.trim(selection.From) != "" && $("#departCityCodeSelect option[value=" + $.trim(selection.From.toUpperCase()) + "]").length > 0) {
				flightSearchSelects.setFromStation($.trim(selection.From.toUpperCase()));
			}
		}

		if (selection.To != undefined) {
			if ($.trim(selection.To) != "" && $("#destCityCodeSelect option[value=" + $.trim(selection.To.toUpperCase()) + "]").length > 0) {
				flightSearchSelects.setToStation($.trim(selection.To.toUpperCase()));
			}
		}

		if ((selection.BookingType.toUpperCase() == "H" || selection.BookingType.toUpperCase() == "HC") && selection.Location != undefined) {
			var result = $.grep(hotelOnlyList, function (value) {
				return value.Name.toLowerCase() == selection.Location.toLowerCase() || value.Station.toLowerCase() == selection.Location.toLowerCase();
			});
			if (result.length > 0) {
				$("#departCityAutoComplete").val(result[0].Name);
				$("#autoCompleteValue").val(result[0].Station);
			}
		}

		DepartReturnDateChangeCheck();

	} else {
		loadPlaceholders();
		$("#paxAdults").setSelectByValue('1');
		$("#paxMinors").setSelectByValue('0');
	}
}

function SetDefaultValues() {
	PopulateSearchWidget();
	AdjustPaxNumbers();
}

function SelectionDateFormat(selectionDate) {
	return selectionDate.getMonth() + 1 + "/" + selectionDate.getDate() + "/" + selectionDate.getFullYear();
}

function GetMulticityDepartDate() {
	if (CheckMarketRow('fromMultiCity1') && $('#dateMultiCityDisplay1').val() != '')
		return SelectionDateFormat($('#dateMultiCity1').datepicker("getDate"));
	else if (CheckMarketRow('fromMultiCity2') && $('#dateMultiCityDisplay2').val() != '')
		return SelectionDateFormat($('#dateMultiCity2').datepicker("getDate"));
	else if (CheckMarketRow('fromMultiCity3') && $('#dateMultiCityDisplay3').val() != '')
		return SelectionDateFormat($('#dateMultiCity3').datepicker("getDate"));
	else if (CheckMarketRow('fromMultiCity4') && $('#dateMultiCityDisplay4').val() != '')
		return SelectionDateFormat($('#dateMultiCity4').datepicker("getDate"));
}

function GetMulticityReturnDate() {
	if (CheckMarketRow('fromMultiCity4') && $('#dateMultiCityDisplay4').val() != '')
		return SelectionDateFormat($('#dateMultiCity4').datepicker("getDate"));
	else if (CheckMarketRow('fromMultiCity3') && $('#dateMultiCityDisplay3').val() != '')
		return SelectionDateFormat($('#dateMultiCity3').datepicker("getDate"));
	else if (CheckMarketRow('fromMultiCity2') && $('#dateMultiCityDisplay2').val() != '')
		return SelectionDateFormat($('#dateMultiCity2').datepicker("getDate"));
	else if (CheckMarketRow('fromMultiCity1') && $('#dateMultiCityDisplay1').val() != '')
		return SelectionDateFormat($('#dateMultiCity1').datepicker("getDate"));
}

function MinorDialogClosing() {
	$("#paxInfants").val($("input[id$='_lapChild']:checked").length);
	return true;
}

function CollectChildBirthDates() {
	// yyyy-mm-dd = "2006-06-14"
	childBirthDates = [];
	childLapOption = [];
	if ($("#businessLeisureSelect").val() == "P") {
		// Buddy Pass
		for (var i = 0, j = children(); i < j; i++) {
			var month = $("select#child_" + i + "_month").val();
			var day = $("select#child_" + i + "_day").val();
			var year = $("select#child_" + i + "_year").val();
			if (month >= 0) {
				childBirthDates.push((Number(month) + 1) + "/" + day + "/" + year);
				childLapOption.push($("input[id$='" + i + "_lapChild']:checked").length);
			}
		}
	}
	else {
		var dateIndex = 0;
		for (var i = 0; i < $('#cbDependentsSelect option').length; i++) {
			if ($('#cbDependentsSelect option')[i].selected) {
				if (i > 0 && dependentsAge[i - 1] < 15) {
					// collect birth date mm/dd/yyyy
					var currentDOB = dependentBirthDates[i - 1];
					var year = currentDOB.substring(0, 4);
					currentDOB = currentDOB.substring(5);
					dateIndex = currentDOB.indexOf("-");
					var month = currentDOB.substring(0, 2);
					var day = currentDOB.substring(dateIndex + 1);
					if (month >= 0) {
						childBirthDates.push((Number(month) + 1) + "/" + Number(day) + "/" + year);
					}
					if (dependentsAge[i - 1] < 2) {
						childLapOption.push(1);
					}
					else {
						childLapOption.push(0);
					}
				}
			}
		}
	}

}

function MinorDialogClosed() {
	// Hide International minor message
	$("#lapInternationalMsg").hide();

	if (minorDialogClosed) {
		// Write child birth dates to a form input
		CollectChildBirthDates();
		$("#birthdates").val(childBirthDates.toString());
		$("#lapoption").val(childLapOption.toString());

		if ($("input[id$='_lapChild']:checked").length > adults()) {
			$('#lapchildMismatch').modal();
			childBirthDates = [];
			childLapOption = [];
			$("#paxInfants").val("0");
		}
		else {
			if (ValidateBirthDates())
				$("#book-travel-form").submit();
			else
				$("#childBirthDates").find("p[class='actions']").hide();
		}
	}
	else {
		childBirthDates = [];
		childLapOption = [];
		$("#childBirthDates").find("p[class='actions']").hide();
	}
	minorDialogClosed = false;
}

function ValidateBirthDates() {
	if (childBirthDates.length == children()) {
		for (var i = 0; i < childBirthDates.length; i++) {
			var dateRegEx = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
			if (!dateRegEx.test(childBirthDates[i])) {
				return false;
			}
		}
		return true;
	}
	return false;
}

function VerifyPassengers() {
	if ($("#businessLeisureSelect").val() == "P" || $("#businessLeisureSelect").val() == "RV") {
		// Buddy Pass
		if (adults() == 0 && children() == 0) {
			$('#passengersRequired').modal();
			return false;
		}
	}
	else {
		//Not doing a check b/c if customer does not select any particular pax, the employee will always be selected by default
	}
	return true;
}
var radioTemplate = "<input type='radio' />";

function VerifyMinors() {
	if (adults() == 0 && children() > 0) {

		// Check for flight-only mode
		if (bookingType() != "F") {
			$('#childFlightOnly').modal();
			return false;
		}
		CollectChildBirthDates();
		if (childBirthDates.length == children()) {
			// Check for minors under 5
			var underFiveYrs = false;
			var over15Yrs = false;
			// var fiveYearsOld = (1000 * 60 * 60 * 24 * 365 * 5);
			// var fifteenYearsOld = (1000 * 60 * 60 * 24 * 365 * 15);
			//Child compare Date should be on Date of Departure rather than Booking Date
			var departDate;
			if ($('#journeyMultiCity').prop('checked') == true) {
				departDate = SelectionDateFormat($('#dateMultiCity1').datepicker("getDate"));
			}
			else {
				departDate = SelectionDateFormat($('#departDate').datepicker("getDate"));
			}

			var fiveYearsOld = new Date(departDate);
			fiveYearsOld.setFullYear(fiveYearsOld.getFullYear() - 5);

			var fifteenYearsOld = new Date(departDate);
			fifteenYearsOld.setFullYear(fifteenYearsOld.getFullYear() - 15);

			for (var i = 0, j = childBirthDates.length; i < j; i++) {
				var childage = new Date(departDate) - new Date(childBirthDates[i]);
				var isFiveYearsOld = new Date(departDate) - new Date(fiveYearsOld);
				var isFifteenYearsOld = new Date(departDate) - new Date(fifteenYearsOld);

				if (childage < isFiveYearsOld) {
					underFiveYrs = true;
				}
				if (childage >= isFifteenYearsOld) {
					over15Yrs = true;
				}
			}

			// Display Minor not allowed popup if its International flight
			if (isInternationalFlight() && !over15Yrs) {
				//console.log("isInternationalFlight() is true");
				//$('#unaccompaniedMinorNotAllowed').dialog({ modal: true, position: GetDefaultModalPosition(), width: '400px' }); // Show international popup error
				$('#unaccompaniedMinorNotAllowed').modal();
				return false;
			}

			// Display child under 5 popup if date of birt is  under five yrs
			if (underFiveYrs && !over15Yrs) {
				$('#childUnder5').modal();
				childBirthDates = []; // clear the birth dates for them to try again
				childLapOption = [];
				return false;
			}

			// Display unaccompanied minor fee popup 
			if ((!underFiveYrs && !over15Yrs) && !minorFeeAccepted) {
				if (IsRevenue === "True") $("p.revenueUMNR").show();
				$('#unaccompaniedMinorAccept').modal();
				return false;
			}
		}
	}

	if (children() > 0 && childBirthDates.length != children()) {
		$("#birthDatesArea").empty();

		var oneSpace = " ";
		var dateFrag = document.createDocumentFragment();
		for (var i = 0, j = children(); i < j; i++) {
			var prefix = "child_" + i;
			var dateClone = $("#dateClones>ul>li").clone(),
				dateSelects = dateClone.find('select');
			// Setup DOB drop-downs
			dateSelects.first().attr("id", prefix + "_month").change(function () { ChildDateChange($(this)); });
			dateSelects.filter('.day').attr("id", prefix + "_day").change(function () { ChildDateChange($(this)); });
			dateSelects.last().attr("id", prefix + "_year").change(function () { ChildDateChange($(this)); });
			dateClone.find('label').first().text(childLabel + oneSpace + (i + 1)).attr("for", prefix + "_month");

			// Setup radio buttons
			var lapOption = dateClone.find('.lap_child').first(),
				lapLabels = lapOption.find("label");

			var seatChildId = prefix + "_seatChild";
			var seatRadio = $("<input type='radio' value='0' >").attr("id", seatChildId);
			lapLabels.first().before(seatRadio);
			seatRadio.prop("defaultChecked", true);
			lapLabels.first().attr("for", seatChildId);

			var lapChildId = prefix + "_lapChild";
			var lapRadioRadio = $("<input type='radio' value='1' />").attr("id", lapChildId);
			lapLabels.last().before(lapRadioRadio);
			lapLabels.last().attr("for", lapChildId);

			var lapRadios = lapOption.find("input");
			lapRadios.attr("name", seatChildId);

			lapOption.attr("id", "lapOption_" + i);
			lapOption.hide();

			dateFrag.appendChild(dateClone[0]);
		}
		$("#birthDatesArea")[0].appendChild(dateFrag);
		if ($('html').hasClass('ie7')) {
			$("#birthDatesArea").find(':radio').mouseup(function (event) {
				this.blur();
				this.focus();
				var $this = $(this);
				var radios = $this.closest("li").find(':radio');
				var lapRadioRadio = radios.first();
				var seatRadio = radios.last();
				var seatChildId = seatRadio.attr('id');
				if (this.checked != true) {
					if (this.id == seatChildId) {
						lapRadioRadio.prop("checked", false);
						seatRadio.prop("checked", true);
						LapChildClick(lapRadioRadio.attr('id') + "Class", '1');
					} else {
						seatRadio.prop("checked", false);
						lapRadioRadio.prop("checked", true);
						LapChildClick(lapRadioRadio.attr('id') + "Class", '0');
					}
				}
			});
		}
		if ($("#businessLeisureSelect").val() == "P" || $("#businessLeisureSelect").val() == "RV") {
			$("#childBirthDates").modal(); // We can't wait here, so we have to pop this and return false
			if ($("#businessLeisureSelect").val() == "P") $("ul#birthDatesArea li").show();
			return false;
		}
	}
	return true;
};

// International msg for Lap Child decision 1 = display, 0 = none
function LapChildClick(className, decision) {

	if (isInternationalFlight() && adults() > 0) {

		var target = $("#lapInternationalMsg");
		if (decision === '0') {
			target.removeClass(className);
			if (!target.attr("class"))
				target.css("display", "none");
		}

		if (decision === '1') {
			target.css("display", "block")
				.addClass(className);
		}
	}
}

var multiCityflightCounter = 0;
function addNewMultiCityFlight() {
	multiCityflightCounter++;
	switch (multiCityflightCounter) {
		case 1:
			var $multiCityFlightThree = $('#multiCityJourney3');
			$multiCityFlightThree.show();
			break;
		case 2:
			var $multiCityFlightFour = $('#multiCityJourney4');
			var $addFlight = $('.addFlight');
			$multiCityFlightFour.show();
			$addFlight.hide();
			break;
	}
}

function AdjustBookingMode() {
	var $oneWayRadio = $("#journeyOneWay"),
		$radioParent = $oneWayRadio.closest("li");
	var $roundTripRadio = $('#journeyRoundTrip');
	var $businessLeisureSelect = $("#businessLeisureSelect");
	if (bookingType() == "F") {
		$radioParent.show();
		$("ul.flightOnly").show();
		$('#returnDateDisplay').hide();
		$("label[for='returnDateDisplay']").hide();
		$("label[for='departDateDisplay']").text(PageModel.dateLabel);
	}
	if ($businessLeisureSelect.val() == "JS") {
		//OneWay as default 
		$oneWayRadio.prop('checked', true);
		$oneWayRadio.trigger('click');
	}
	else {
		//Roundtrip as default 
		$roundTripRadio.prop('checked', true);
		$roundTripRadio.trigger('click');
	}
	AdjustContentVerbiage();
	AdjustPaxNumbers();
	if (typeof flightSearchSelects != "undefined") {
		flightSearchSelects.setToStation("");
		flightSearchSelects.setFromStation("");
		flightSearchSelects.init(); // reset stations
	}
	if (typeof flightSearchMultiCity1Selects != "undefined") {
		flightSearchMultiCity1Selects.setToStation("");
		flightSearchMultiCity1Selects.setFromStation("");
		flightSearchMultiCity1Selects.init(); // reset stations
	}
	if (typeof flightSearchMultiCity2Selects != "undefined") {
		flightSearchMultiCity2Selects.setToStation("");
		flightSearchMultiCity2Selects.setFromStation("");
		flightSearchMultiCity2Selects.init(); // reset stations
	}
	if (typeof flightSearchMultiCity3Selects != "undefined") {
		flightSearchMultiCity3Selects.setToStation("");
		flightSearchMultiCity3Selects.setFromStation("");
		flightSearchMultiCity3Selects.init(); // reset stations
	}
	if (typeof flightSearchMultiCity4Selects != "undefined") {
		flightSearchMultiCity4Selects.setToStation("");
		flightSearchMultiCity4Selects.setFromStation("");
		flightSearchMultiCity4Selects.init(); // reset stations
	}
};

function AdjustPaxNumbers() {
	var tmpAdults = adults();
	var tmpChildren = children();
	var pax = tmpAdults + tmpChildren;
	var isFlightOnly = bookingType() == "F";
	var max = isFlightOnly ? maxPaxF : maxPaxFH;
	var isInternational = isInternationalFlight();
	var adultMax = (max - tmpChildren);
	var minorMax = (max - tmpAdults);

	$('#paxAdults, #paxMinors').children().remove();

	var adultSelect = document.getElementById('paxAdults');
	var adultFrag = document.createDocumentFragment();

	if ($("#businessLeisureSelect").val() == "JS" || $("#businessLeisureSelect").val() == "SP") {
		// Only one pax when Jumpseat travel or positive space (COBUS)
		var txt = adultLabels[1];
		var opt = document.createElement("option");
		opt.value = 1;
		opt.appendChild(document.createTextNode(txt));
		opt.selected = true;
		adultFrag.appendChild(opt);
	}
	else if ($("#businessLeisureSelect").val() == "P") {
		// Adult and children for Buddy Passes
		for (var i = 0, j = (max + 1), k = adultLabels.length; i < j; i++) {
			var txt = adultLabels[i];
			var opt = document.createElement("option");
			opt.value = i;
			opt.appendChild(document.createTextNode(txt));
			if (i == tmpAdults) { opt.selected = true; }
			adultFrag.appendChild(opt);
			if (i >= adultMax) { break; }
		}
		var childSelect = document.getElementById('paxMinors');
		var childFrag = document.createDocumentFragment();
		for (var i = 0, j = (max + 1), k = childLabels.length; i < j; i++) {
			var txt = childLabels[i];
			var opt = document.createElement("option");
			opt.value = i;
			opt.appendChild(document.createTextNode(txt));
			if (i == tmpChildren) { opt.selected = true; }
			childFrag.appendChild(opt);
			if (i >= minorMax) { break; }
		}
		childSelect.appendChild(childFrag);
	}
	else {
		for (var i = 0, j = (max + 1), k = adultLabels.length; i < j; i++) {
			var txt = adultLabels[i];
			var opt = document.createElement("option");
			opt.value = i;
			opt.appendChild(document.createTextNode(txt));
			if (i == tmpAdults) { opt.selected = true; }
			adultFrag.appendChild(opt);
			if (i >= adultMax) { break; }
		}
	}
	adultSelect.appendChild(adultFrag);

	$businessLeisureSelect = $('#businessLeisureSelect');
	$dependentList = $('#dependentsli');
	$adultList = $('#adultsli');
	$childList = $('#childrenli');
	switch ($businessLeisureSelect.val()) {
		case "JS":
		case "SP":
			//$dependentList.hide();
			$adultList.hide();
			$childList.hide();
			break;

		case "P":
			$dependentList.hide();
			if ($('[name=tripType]:checked').val() !== "multiCity") {
				$adultList.show();
				$childList.show();
			} else {
				//$adultList.css({ display: "inline-block", width: "155px", float: "left" });
				//$childList.css({ display: "inline-block", margin: "0 0 0 15px", float: "left" });
			}
			break;

		default:
			//case "SA":
			//case "LP":
			//case "RV":
			if ($('[name=tripType]:checked').val() !== "multiCity") {
				//$dependentListParent.css({ display: "list-item", float: "none" });
			} else {
				//$dependentListParent.css({ display: "list-item", float: "left" });
			}
			$adultList.hide();
			$childList.hide();
			break;
	}
}

//Fix the number of days available for a particular month
function AdjustDaysOfTheMonth(controlID, month, year) {
	//Calculate exact number of day's in a month
	correctDaysInMonth = 32 - new Date(year, month, 32).getDate();
	var maxDayValue = Number($(controlID + " option:last-child").val());
	if (maxDayValue != correctDaysInMonth) {
		if (maxDayValue < correctDaysInMonth) {
			//Add element from the range of month
			for (var count = maxDayValue + 1; count <= correctDaysInMonth; count++) {
				//Create option element
				var dayElementOption = document.createElement('option');
				dayElementOption.text = count;
				dayElementOption.value = count;
				//Add it to control
				try {
					$(controlID)[0].add(dayElementOption, null); // Fail in IE
				}
				catch (ex) {
					select = document.getElementById($(controlID).attr("id"));
					select.options[select.options.length] = new Option(dayElementOption.value, dayElementOption.text); //work in IE only
				}
			}
		}
		else {
			//Remove element not in the range of month
			for (var count = maxDayValue + 1; count > correctDaysInMonth; count--) {
				$(controlID)[0].remove(count);
			}
		}
	}
}

function ChildDateChange(object) {
	var childNum = Number(object.attr("id").replace("child_", "").replace("_month", "").replace("_day", "").replace("_year", ""));
	var month = Number($("select#child_" + childNum + "_month").val());
	var day = Number($("select#child_" + childNum + "_day").val());
	var year = Number($("select#child_" + childNum + "_year").val());

	//Adjust number of days depending on Days and Month
	AdjustDaysOfTheMonth("select#child_" + childNum + "_day", month, year);

	if (month >= 0 && day > 0 && year > 0) {
		var bdate = new Date(year + 2, month, day);
		var checkDate = new Date(ToENStringDate($("#returnDate").val()));
		//  var pair = from + to;

		if ($('#journeyOneWay').prop('checked') == true) {
			//toDate isnt set on one way so may have invalid value
			//   toDate = departDate;
			checkDate = new Date(ToENStringDate($("#departDate").val()));
		}

		if ($('#journeyMultiCity').prop('checked') == true) {
			//toDate isnt set on one way so may have invalid value
			//   toDate = departDate;
			checkDate = new Date(GetMulticityReturnDate());
		}

		$("#child_" + childNum + "_seatChild").click(function () {
			var $this = $(this);
			LapChildClick("child_" + childNum + "_seatChildClass", '0');
			$this.prop("checked", true);
			$("#child_" + childNum + "_lapChild").prop("checked", false);
		});

		$("#child_" + childNum + "_lapChild").click(function () {
			var $this = $(this);
			LapChildClick("child_" + childNum + "_seatChildClass", '1');
			$("#child_" + childNum + "_seatChild").prop("checked", false);
			$this.prop("checked", true);
		});

		//date shoudl check against return because navitiare wont allow .infant to be 2
		if (bdate > checkDate) {
			$("#lapOption_" + childNum).css("display", "block");
		}
		else {
			$("#child_" + childNum + "_lapChild").prop("checked", false);
			$("#child_" + childNum + "_seatChild").prop("checked", true);
			$("#lapOption_" + childNum).css("display", "none");
			LapChildClick("child_" + childNum + "_seatChild" + "Class", '0');
		}
	}
	CollectChildBirthDates();
	if (ValidateBirthDates()) {
		$("#childBirthDates").find("p[class='actions']").show();
	} else {
		$("#childBirthDates").find("p[class='actions']").hide();
	}
}

function IsEmpty(obj) {
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) return false;
	}
	return true;
}

function ToJsonDate(obj) {
	return new Date(Number(obj.toString().replace("/Date(", "").replace(")/", "")));
}

function SwapStringDateCulture(obj, lang) {
	var monthsEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		monthsES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
	var objLower = obj.toLowerCase();
	var temp;
	var monthsFrom, monthsTo;
	if (lang == "en-US") {
		monthsFrom = monthsEN;
		monthsTo = monthsES;
	} else {
		monthsFrom = monthsES;
		monthsTo = monthsEN;
	}
	for (var i = 0, j = monthsFrom.length; i < j; i++) {
		var month = monthsFrom[i];
		if (objLower.indexOf(month.toLowerCase()) != -1) {
			temp = obj.replace(month, monthsTo[i]);
			break;
		}
	}
	return temp;
}

function ToENStringDate(obj) {
	var temp = obj;
	if (obj.toLowerCase().indexOf("enero") != -1) { temp = obj.replace("Enero", "January"); }
	if (obj.toLowerCase().indexOf("febrero") != -1) { temp = obj.replace("Febrero", "February"); }
	if (obj.toLowerCase().indexOf("marzo") != -1) { temp = obj.replace("Marzo", "March"); }
	if (obj.toLowerCase().indexOf("abril") != -1) { temp = obj.replace("Abril", "April"); }
	if (obj.toLowerCase().indexOf("mayo") != -1) { temp = obj.replace("Mayo", "May"); }
	if (obj.toLowerCase().indexOf("junio") != -1) { temp = obj.replace("Junio", "June"); }
	if (obj.toLowerCase().indexOf("julio") != -1) { temp = obj.replace("Julio", "July"); }
	if (obj.toLowerCase().indexOf("agosto") != -1) { temp = obj.replace("Agosto", "August"); }
	if (obj.toLowerCase().indexOf("septiembre") != -1) { temp = obj.replace("Septiembre", "September"); }
	if (obj.toLowerCase().indexOf("octubre") != -1) { temp = obj.replace("Octubre", "October"); }
	if (obj.toLowerCase().indexOf("noviembre") != -1) { temp = obj.replace("Noviembre", "November"); }
	if (obj.toLowerCase().indexOf("diciembre") != -1) { temp = obj.replace("Diciembre", "December"); }

	return temp;
}

function RetrieveBooking(dataString) {
	$.ajax({
		type: "POST",
		url: "AJAXRetrieveBooking.aspx",
		dataType: "json",
		data: dataString,
		success: function (data) {
			RetrieveBookingResponseData(data);
		}
	});
}

function RetrieveBookingResponseData(response) {
	if (response.success) {
		$("#" + response.type + "-form").submit();
	}
	else {
		unBlockPage();
		$("#" + response.type + "-button").removeAttr('disabled');
		$('#namePnrMismatch').modal();
	}
}

function CheckForLoadErrors() {
	var params = GetUrlParams();
	if ("error" in params) {
		switch (params["error"]) {
			case "nohotels":
				$("#nohotels").modal();
				break;
			case "noHotelsOnly":
				resetSearchWidget();
				hotelOnly();
				$("#noHotelsOnly").modal();
				break;
			case "noCars":
				resetSearchWidget();
				if (bookingType() === "C") {
					carOnly();
				} else if (bookingType() === "FC") {
					flightPlusCar();
				} else if (bookingType() === "FHC") {
					flightPlusHotelPlusCar();
				}
				$("#noCarsPopup").modal();
				break;
			case "noCarOnly":
				resetSearchWidget();
				if (bookingType() === "C") {
					carOnly();
				} else if (bookingType() === "FC") {
					flightPlusCar();
				} else if (bookingType() === "FHC") {
					flightPlusHotelPlusCar();
				}
				$("#noCarForSelectedDatePopup").modal();
				break;
		}
	}
}

function GetUrlParams() {
	var e,
		a = /\+/g,  // Regex for replacing addition symbol with a space
		r = /([^&=]+)=?([^&]*)/g,
		d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
		q = window.location.search.substring(1),
		params = {};

	while (e = r.exec(q)) {
		params[d(e[1])] = d(e[2]);
	}
	return params;
}

String.prototype.contains = function (it) { return this.toLowerCase().indexOf(it.toLowerCase()) != -1; };

try {
	$.extend($.ui.dialog.prototype.options, {
		resizable: false
	});
} catch (ex) { }

function getDependentsAge(dobArray) {
	var departDate = "";

	if ($('#journeyMultiCity').prop('checked') == true) {
		// MultiCity search
		departDate = SelectionDateFormat($('#dateMultiCity1').datepicker("getDate"));
	}
	else {
		// Roundtrip or Oneway search
		departDate = SelectionDateFormat($('#departDate').datepicker("getDate")); // mm/dd/yyyy = "4/25/2014"
	}

	//Departure Date
	var dateIndex = departDate.indexOf("/");
	var departMonth = departDate.substring(0, dateIndex);
	departDate = departDate.substring(dateIndex + 1);
	dateIndex = departDate.indexOf("/");
	var departDay = departDate.substring(0, dateIndex);
	var departYear = departDate.substring(dateIndex + 1);
	var currentDOB = "";
	var dobYear = "";
	var dobDay = "";
	var dobMonth = "";
	var age = "";

	for (i = 0; i < dobArray.length; ++i) {

		//Date of Birth
		currentDOB = dobArray[i]; // yyyy-mm-dd = "2006-06-14"
		dobYear = currentDOB.substring(0, 4);
		currentDOB = currentDOB.substring(5);
		dateIndex = currentDOB.indexOf("-");
		dobMonth = currentDOB.substring(0, 2);
		dobDay = currentDOB.substring(dateIndex + 1);

		age = departYear - dobYear;

		if (parseInt(departMonth) < parseInt(dobMonth) || (parseInt(departMonth) == parseInt(dobMonth) && parseInt(departDay) < parseInt(dobDay))) {
			age = age - 1;//not yet their birthday
		}
		dependentsAge.push(age);
	}//end for loop
}

function GetName(firstName, middleName, lastName) {
	var name = firstName;
	if (middleName == null)
		name = name + ' ' + lastName;
	else
		name = name + ' ' + middleName + ' ' + lastName;
	return name;
}

function IsNameMatch(employeeName, index, dependents) {
	var isMatch = false;
	var name = '';
	if (index == -1) {
		// Compare employee name with his/her dependents' names
		for (var i = 0; i < dependents.length; i++) {
			if (i != index) {
				name = GetName(dependents[i].FirstName, dependents[i].MiddleName, dependents[i].LastName);
				if (employeeName == name) {
					isMatch = true;
					break;
				}
			}
		}
	}
	else {
		name = GetName(dependents[index].FirstName, dependents[index].MiddleName, dependents[index].LastName);
		// Compare dependent's name with employee name
		if (employeeName == name)
			return true;
		else {
			// Compare dependent's name with other dependent's name
			for (var i = 0; i < dependents.length; i++) {
				if (i != index) {
					var fooname = GetName(dependents[i].FirstName, dependents[i].MiddleName, dependents[i].LastName);
					if (fooname == name) {
						isMatch = true;
						break;
					}
				}
			}
		}
	}
	return isMatch;
}

function getSpacePositiveText(total, used) {
	var avail = total - used;
	if (avail > 0) {
		return ' (' + avail + ')';
	}
	else {
		return '';
	}
}

function AdjustContentVerbiage() {
	var $businessLeisureSelect = $("#businessLeisureSelect");
	if ($businessLeisureSelect.val() == "SP" || $businessLeisureSelect.val() == "LP") {
		$("p.positiveContent").show();
		$("p.nrsaContent").hide();
	} else {
		$("p.positiveContent").hide();
		if (IsRevenue != "True") $("p.nrsaContent").show();
	}
}

function toggleFlifo(flifoUlElement) {
	if (flifoUlElement == "flifoDestinationUl") {
		$("#TextBoxFlightNumber").val("");
	}
	else {
		$("#statusDepartCitySelect").val("");
		$("#statusDestCitySelect").val("");
	}
	$(".validateObj").each(function () {
		if ($(this).parents("ul.flifoOptionUl").attr("id") === flifoUlElement) {
			if ($(this).attr("validateString")) {
				$(this).attr("validatekey", $(this).attr("validateString")).removeAttr("validateString");
			}
		} else {
			$(this).attr("validateString", $(this).attr("validatekey")).removeAttr("validatekey");
		}
	});
	FlightStatusValidator.hideBubble();
	$(".flifoOptionUl").each(function () {
		$(this).hide();
	});
	$("#" + flifoUlElement).show();
}

var InterLineSelected = "";
function ChooseInterline() {
	var interLineChoice = $("#oaTravelSelect").val();
	var partner = _.findWhere(InterlineAirlinesData, { airlineCode: interLineChoice });
	if (partner != null) {
		InterLineSelected = partner.portal;
		// $(".interlineAirlineInfo").text(partner.airlineInfo);

		if (partner.portal == "id90") {
			ChooseID90();
		}
		if (partner.portal == "myIDTravel") {
			ChooseMyIDTravel();
		}
		$(".interLineRightContent").hide();
		$("#" + partner.airlineCode + "Content").show();
		$("#interlineSubmitButton").show();
	} else {
		$("#interlineSubmitButton").hide();
	}
	//InterLineSelected = interLineChoice;
}

function ChooseID90() {
	$("#id90Terms").hide();
	$("#myIDTravelTerms").show();
}

function ChooseMyIDTravel() {
	$("#myIDTravelTerms").hide();
	$("#id90Terms").show();
}

function populateInterlineAirlines(partnerData) {
	var frag = document.createDocumentFragment();
	var optDefault = document.createElement("option");
	optDefault.value = "";
	optDefault.appendChild(document.createTextNode("Select"));
	frag.appendChild(optDefault);
	for (var i = 0, j = partnerData.length; i < j; i++) {
		var data = partnerData[i];
		if (data) {
			var key = data.airlineName;
			var value = data.airlineCode;
			var opt = document.createElement("option");
			opt.value = value;
			opt.appendChild(document.createTextNode(key));
			frag.appendChild(opt);
		}
	}
	var partnerAirlineSelect = document.getElementById('oaTravelSelect');
	$("#oaTravelSelect option").each(function () {
		$(this).remove();
	});
	partnerAirlineSelect.appendChild(frag);
}

function SubmitInterline() {
	if (InterLineSelected == "id90") {
		window.location.href = id90Page;
	}
	if (InterLineSelected == "myIDTravel") {
		window.location.href = idTravelPage;
	}
}

function LastNamePrepopulate() {
	$('#checkinLastName').val(UserLastName);
	$('#changeLastName').val(UserLastName);
}

function getEmployeeData() {
	if (typeof (Storage) !== "undefined") {
		if (sessionStorage.getItem("employee")) {

			// retrieve from sessionStorage
			var storedEmployee = sessionStorage.getItem("employee");

			// display stored response
			if (storedEmployee != null) {
				return JSON.parse(storedEmployee);
			}

			return "";
		}
	}
}

function setEmployeeData(employeeData) {
	if (typeof (Storage) !== "undefined") {
		sessionStorage.setItem("employee", JSON.stringify(employeeData));
	}
}

function updateMarketingSection(key) {
	if (key == "#employee-login") {
		$(".stage_ad").hide();
	}
	else {
		if ($('#journeyMultiCity').prop('checked') == true) {
			$(".stage_ad").hide();
			$('.leisurePositiveLimitedDisclosure').hide();
		}
		else {
			if ($('#oaTravelType').prop('checked') == true) {
				$(".interlineAirlineInfo").show();
				$(".stage_ad").hide();
			}
			else {
				$(".interlineAirlineInfo").hide();
				$('div.employeeTravel').hide();
				$(".stage_ad").show();

				if ($("#businessLeisureSelect").val() == "LP") {

					var employee = getEmployeeData();

					if (employee != null && employee.IsSpacePositiveAuthorized) {
						// Display Leisure Positive disclosure
						$('.leisurePositiveLimitedDisclosure').show();
						$(".stage_ad").hide();
					}
				}
			}
		}
	}
}

function verifyLeisurePositiveAllowance(numberOfJourneys, availablePasses, usedPasses) {
	if (numberOfJourneys > (availablePasses - usedPasses)) {
		// Display error
		$('div.insufficientLP').show();
		return false;
	}
	return true;
}

function logout() {
	var employeeData = null;
	sessionStorage.setItem("employee", JSON.stringify(employeeData));
	window.location.href = 'EmployeeTravel.aspx?action=logout';
}

function toggleForRevenue(val) {
	if (val === "True") {
		$("ul.travelType").hide();
		$("article.non-rev").hide();
		$("li.myres").hide();
		$("p.nrsaContent").hide();
	}
}