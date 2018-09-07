var scrollInterval;
var tempScrollInterval = 1000; // 10 Sec

var isIE9 = $('html').hasClass('ie9');

// Avoid `console` errors in browsers that lack a console.
(function () {
	var method;
	var noop = function () { };
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());

// Homepage UI Functionality
$("#changeButton_noHotelsOnly").click(function () {
	$("#departDateDisplay, #returnDateDisplay, #departDate, #returnDate").val("");
	loadPlaceholders();
	TriggerBookingTypeEvent('H');
	$('#noHotelsOnly').modal('hide');
	return false;
});

$("#changeButton_noHotels").click(function () {
	$("#departDateDisplay, #returnDateDisplay, #departDate, #returnDate").val("");
	loadPlaceholders();
	TriggerBookingTypeEvent('FH');
	$('#nohotels').modal('hide');
	return false;
});

$("#ui-dialog-title-homepage_overlay").click(function () {
	closeOverlay();
});

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
var loggedRezAgent = PageModel.rezAgent;
var adultLabels = PageModel.adultOptionLabels;
var ageLabels = PageModel.carDriversAge;
var carPickUpLabels = PageModel.carPickUp;
var carDropOffLabels = PageModel.carDropOff;
var hotelLabels = PageModel.hotelOptionLabels;
var bookingTypeLabels = (function () {
	var data = PageModel.bookingTypeOptionLabels;
	if (IsTravelAgent == "True" && IsThirdParty != "True") {
		data = PageModel.bookingTypeOptionLabelsTA;

	}
	return data;
})();
var childLabel = PageModel.childLabel;
var searchButtonTextHotels = PageModel.searchButtonTextforHotels;
var searchButtonTextCars = PageModel.searchButtonTextforCars;
var searchButtonFlight = PageModel.searchButtonTextFlight;
var searchButtonText = PageModel.searchButtonTextVacation;

var searchCategory = "Flight Search";

var monthData = (function () {
	var array = [];
	var data = PageModel.monthOptionLabels;
	for (var i = 0, j = data.length; i < j; i++) {
		var txt = data[i];
		array.push({ key: i, value: txt });
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
var maxPaxF = 9;
var maxPaxFH = 8;

// Support Vars
var minorDialogClosed = false;
var minorFeeAccepted = false;
var validPromoCode = false;
var validGuid = false;
var childBirthDates = [];
var childLapOption = [];
var fromSearch, toSearch; // For station searches
var loginDialogClosed = false;

var tempChildren = 0;
var tempAdults = 0;

// Getter Functions
var adults = function () { return Number($("#paxAdults").val()); };
var children = function () { return Number($("#paxMinors").val()); };
var awardRezAgent = function () { return loggedRezAgent };
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

var isMultiCity = function () { return $('#journeyMultiCity').prop('checked') == true; };

var globalDepartDate = function () { return moment($('#departDate').val(), 'MM-DD-YYYY'); };
var globalReturnDate = function () { return moment($('#returnDate').val(), 'MM-DD-YYYY'); };


var testDateGet = null;

// TODO: THIS NEEDS TO BE MORE ELEGANT
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
		if (((fromMultiCity && fromMultiCity != "" && stations[fromMultiCity].IsInternational == true) || (fromMultiCityOp2 && fromMultiCityOp2 != "" && stations[fromMultiCityOp2].IsInternational == true) || (fromMultiCityOp3 && fromMultiCityOp3 != "" && stations[fromMultiCityOp3].IsInternational == true) || (fromMultiCityOp4 && fromMultiCityOp4 != "" && stations[fromMultiCityOp4].IsInternational == true)) ||
			((tomultiCity && tomultiCity != "" && stations[tomultiCity].IsInternational == true) || (tomultiCityOp2 && tomultiCityOp2 != "" && stations[tomultiCityOp2].IsInternational == true) || (tomultiCityOp3 && tomultiCityOp3 != "" && stations[tomultiCityOp3].IsInternational == true) || (tomultiCityOp4 && tomultiCityOp4 != "" && stations[tomultiCityOp4].IsInternational == true))) {
			return true;
		}
	}
	else {
		if ((from && from != "" && stations[from].IsInternational == true) || (to && to != "" && stations[to].IsInternational == true)) {
			return true;
		}
	}
	return false;
};

var internationalPopup = function (target) {
	$(target).each(function () {
		var value = this.value;
		var bubble = new BubbleHelper('#international_msg');
		if (value && value != '' && stations[value].IsInternational) {
			bubble.display($(this), 'msg', 'false');
			$(".flightSearch").hide();
			$.cookie('internationalPopup', 'true');
			return false;
		}

	});
};

function AddPseudoHotelcities(id) {
	if (EnableRegions != undefined && EnableRegions != null && !EnableRegions) {
		return;
	}
	if (Peusdostations != undefined && Peusdostations != null && id != undefined && id != null && (id == "destCityCodeSelect" || id == "departCityCodeSelect")) {
		var pesudostationdropdown = $("#pesudostation");
		var IsfPo = false;
		var fromdropdown = $("#departCityCodeSelect").val();
		var IsFpo = false;
		if (fromdropdown != undefined && fromdropdown != "") {
			if (stations != undefined) {
				if (stations[fromdropdown].IsInternational == true) {
					IsFpo = true;
				}
			}
		}
		if ((pesudostationdropdown != undefined && pesudostationdropdown != null) || (returndropdown.val() == undefined || returndropdown.val() == "") || ((bookingType() == "F" || bookingType() == "FC" || bookingType() == "C")) || IsFpo) {
			$('#lblpesudostation').hide();
			$('#listlblpesudostation').hide();
			if (pesudostationdropdown != null)
				pesudostationdropdown.remove();
		}
		if ((bookingType() == "FH" || bookingType() == "H" || bookingType() == "FHC") && (!IsFpo)) {
			var dropdownpseudo = $('<select id="pesudostation" name="pesudostation" />');
			var returndropdown = $("#destCityCodeSelect");
			var lblpesudostation = $("#lblpesudostation");
			if (returndropdown != undefined && returndropdown.val() != "") {
				if (stations[returndropdown.val()].Name != undefined) {
					$('<option />', { value: returndropdown.val(), text: stations[returndropdown.val()].Name }).appendTo(dropdownpseudo);
				}
			}
			for (i = 0; i < Peusdostations.length; i++) {

				if (returndropdown != undefined && returndropdown.val() != null && returndropdown.val() != "") {
					if (Peusdostations[i].primeairport == returndropdown.val()) {
						if (stations[returndropdown.val()] != undefined && stations[returndropdown.val()] != null && stations[returndropdown.val()].HasHotel != undefined && stations[returndropdown.val()].HasHotel) {
							$('<option />', { value: Peusdostations[i].pseudocode, text: Peusdostations[i].discripiton }).appendTo(dropdownpseudo);
							dropdownpseudo.insertAfter(lblpesudostation);
							$('#lblpesudostation').show();
							$('#listlblpesudostation').show();

						}
					}

				}
			}
		}
	}

}
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
	var e = window.event || e;
	if (e.keyCode == 13) {
		switch (key) {
			case "Booking":
				if (bookingType() === "FC") {
					$("#bookingType").val("FC");
				}
				else if (bookingType() === "FH") {
					$("#bookingType").val("FH");
				}
				else if (bookingType() === "FHC") {
					$("#bookingType").val("FHC");
				}

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

			case "LoginPage":
				var loginBox = $("#login");
				loginBox.find("button").click();
				break;

			case "MultiCity":
				$("#book-travel-form").submit();
				break;

			case "YoungTravelers":
				if ($("#closePopup").length != 0 && $("#closePopup").is(':visible')) {
					$("#book-travel-form").submit();
				}
				break;

			case "Miles":
				$("#fs_member_number_ajax").find("button").click();
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
	//{ "fn": validateFlightNo, "msg": PageModel.flightNoFormatCheck }
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
// FS number for award booking
var FsNumberAwardBooking = new Validator("#fsAward_msg_bubble");
FsNumberAwardBooking.addField("headerEmail", [
	{ "fn": validateRequired, "msg": PageModel.headerEmailRequired },
	{ "fn": validateEmailConditionally, "msg": PageModel.headerEmailFormat },
	{ "fn": validateFSNumberConditionally, "msg": PageModel.headerFSNumberFormat }
]);
//var getValueFromKey;
var key;
// Toggling Tabs for Different Forms
function changeTab(e) {
	e.preventDefault();
	key = $(this).attr('href');
	//    if (key != "#") {
	//        getValueFromKey = key;
	//    }
	switchToTab(key);
}

function ShowForm(cultureCode) {
	$.cookie('cultureCode', cultureCode);
	if (key == "PBI") {
		var urlValue = String(window.location);
		var urlLength = urlValue.indexOf("#");
		if (urlLength > -1) {
			var urlHash = urlValue.substring(urlLength, urlValue.length);
			key = urlHash;
		}
	}
	//    if (getValueFromKey != undefined) {
	//        key = getValueFromKey
	//    }
	//    else {
	//        key = key;
	//    }
	if (key == "PBI") {
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
	if (key == "#book-travel") {
		key = "#booking-type";
	}
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
	if (key !== "#flight-status") FlightStatusValidator.hideBubble();
	else { $('#flightDate').focus(); }
	if (key !== "#change-flight") ChangeFlightValidator.hideBubble();
	else {
		if (_.isUndefined(UserLastName) || UserLastName == "") {
			$('#changeLastName').focus();
		} else {
			$('#changeConfirmationCode').focus();
		}

	}
	key = key;

	//$("div.widget_container").width(328);
	$("#stage_ad").show();

	//Show search button hidden when One way international popup is shown
	$(".flightSearch").show();
	$('#international_msg').hide();
}

var formElems = {
	'flightOnly': {
		'bookingType': '#bookingType', 'select1': '#departCityCodeSelect', 'select2': '#destCityCodeSelect', 'radio1': '#journeyRoundTrip', 'radio2': '#journeyOneWay', 'radio3': '#journeyMultiCity', 'input1': '#departDate', 'input2': '#returnDate', 'select3': '#paxAdults', 'select4': '#paxMinors', 'input3': '#promoCode', 'checkbox': '#redeemMiles', 'select5': '#toMultiCity1', 'select6': '#fromMultiCity1', 'input4': '#dateMultiCityDisplay1', 'select7': '#toMultiCity2', 'select8': '#fromMultiCity2', 'input5': '#dateMultiCityDisplay2', 'select9': '#toMultiCity3', 'select10': '#fromMultiCity3', 'input6': '#dateMultiCityDisplay3', 'select11': '#toMultiCity4', 'select12': '#fromMultiCity4', 'input7': 'dateMultiCityDisplay4'
	},
	'flightCar': {
		'bookingType': '#bookingType', 'select1': '#departCityCodeSelect', 'select2': '#destCityCodeSelect', 'radio1': '#journeyRoundTrip', 'radio2': '#journeyOneWay', 'radio3': '#journeyMultiCity', 'input1': '#departDate', 'input2': '#returnDate', 'select3': '#paxAdults', 'select4': '#paxMinors', 'select5': '#driversAge', 'input3': '#promoCode'
	},
	'flightHotel': {
		'bookingType': '#bookingType', 'select1': '#departCityCodeSelect', 'select2': '#destCityCodeSelect', 'radio1': '#journeyRoundTrip', 'radio2': '#journeyOneWay', 'radio3': '#journeyMultiCity', 'input1': '#departDate', 'input2': '#returnDate', 'select3': '#paxAdults', 'select4': '#paxMinors', 'select5': '#hotelRoomCount', 'input3': '#promoCode'
	},
	'flightHotelCar': {
		'bookingType': '#bookingType', 'select1': '#departCityCodeSelect', 'select2': '#destCityCodeSelect', 'radio1': '#journeyRoundTrip', 'radio2': '#journeyOneWay', 'radio3': '#journeyMultiCity', 'input1': '#departDate', 'input2': '#returnDate', 'select3': '#paxAdults', 'select4': '#paxMinors', 'select5': '#hotelRoomCount', 'select6': '#driversAge', 'input3': '#promoCode'
	},
	'hotel': {
		'bookingType': '#bookingType', 'input1': '#departCityAutoComplete', 'input2': '#departDate', 'input3': '#returnDate', 'select1': '#paxAdults', 'select2': '#paxMinors', 'select3': '#hotelRoomCount', 'input4': '#promoCode'
	},
	'hotelCar': {
		'bookingType': '#bookingType', 'input1': '#departCityAutoComplete', 'input2': '#departDate', 'input3': '#returnDate', 'select1': '#carPickUpTime', 'select2': '#carDropOffTime', 'select3': '#paxAdults', 'select4': '#paxMinors', 'select5': '#hotelRoomCount', 'select6': '#driversAge'
	},
	'car': {
		'bookingType': '#bookingType', 'input1': '#departCityAutoComplete', 'input2': '#departDate', 'input3': '#returnDate', 'select1': '#carPickUpTime', 'select2': '#carDropOffTime', 'select3': '#driversAge'
	}
};

if (!EnablePackagePromo) {
	formElems.flightCar = _.without(formElems.flightCar, 'input3');
	formElems.flightHotel = _.without(formElems.flightHotel, 'input3');
	formElems.flightHotelCar = _.without(formElems.flightHotelCar, 'input3');
}

var searchWidgetDefaultState = function () {
	resetSearchWidget();
	var defaultElem;
	for (defaultElem in formElems.flightOnly) {
		var eachDefaultElem = $(formElems.flightOnly[defaultElem]);
		eachDefaultElem.parent("li").show();
	}
}();

var enableHotelCarOptions = function () {
	if (EnableHotelOnly === false) {
		$("#hotel_hotelPlusWidget").hide();
	} else {
		if (EnableCarOnly === false) {
			$("#hotelPlusCarWidget").hide();
		}
	}
	if (EnableCarOnly === false) {
		$("#carOnlyWidget").hide();
		$("#hotelOnlyWidget").removeClass("underline");
	}
}();

function resetSearchWidget() {
	$('#vacation-pkg-header').addClass('hidden');
	$("#book-travel").find("ul.searchElems li").hide();
	$("ul.flightOnly").hide();
	$("#error_msg_bubble").hide();
	if (IsRezAgent == "False") {
		if ($("#redeemMiles").val() === "true") {
			$("#redeemMiles").val("false");
		}
	}
}

function flightOptions() {
	$("#departCityAutoComplete").removeAttr("validatekey");
	$("#departCityCodeSelect").removeAttr("disable").attr("validateKey", "origin").show();
	$("#destCityCodeSelect").removeAttr("disable").attr("validateKey", "destination").show();
	$("label[for='departDateDisplay'], label[for='returnDateDisplay'], label[for='departCityCodeSelect']").show();
	$("#checkInDate, #checkOutDate, label[for='locationCodeSelect']").hide();
}

function flightOnly() {
	swapCarSelectsReverse();
	flightOptions();
	var defaultElem;
	for (defaultElem in formElems.flightOnly) {
		var eachDefaultElem = $(formElems.flightOnly[defaultElem]);
		eachDefaultElem.parents("li").show();
		if (eachDefaultElem.attr("id") == "journeyMultiCity") {
			//eachDefaultElem.parents("li").css({ display: "inline", visibility: "visible" });			
		}
	}
	swapPromoCodeField();
	$("#pickUpDate, #dropOffDate").hide();

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
	$('#departDate').attr('title', $("label[for='departDateDisplay']").text());
	$('#returnDate').attr('title', $("label[for='returnDateDisplay']").text());
	$("ul.flightOnly").show();

	$('#hotelCarRow1, #hotelCarRow2').hide();

	$('#onewayHotelContainer').hide();
	$('#onewayDriverContainer').hide();

	var departDate = $('#departdateli').detach();
	var returnDate = $('#returndateli').detach();

	if (departDate.hasClass('col-sm-3')) {
		departDate.removeClass('col-sm-3');
	}

	if (returnDate.hasClass('col-sm-3')) {
		returnDate.removeClass('col-sm-3');
	}

	if (!departDate.hasClass('col-sm-6')) {
		departDate.addClass('col-sm-6');
	}

	if (!returnDate.hasClass('col-sm-6')) {
		returnDate.addClass('col-sm-6');
	}

	departDate.show();
	returnDate.show();

	$('#onewayDepartContainer').append(departDate);
	$('#onewayDepartContainer').append(returnDate);

	$('#onewayDepartContainer').show();
	$('#onewaySpacer').show();

	var isMiles = $('#redeemMiles').val();
	if (isMiles === 'true') {
		ToggleMilesDollars(document.getElementById('slider-miles'));
	} else {
		ToggleMilesDollars(document.getElementById('slider-dollars'));
	}

	$("#departDateLabel").show();
}

function flightPlusCar() {
	swapCarSelectsReverse();
	flightOptions();

	var defaultElem;
	for (defaultElem in formElems.flightCar) {
		var eachDefaultElem = $(formElems.flightCar[defaultElem]);
		var eachObjElem = formElems.flightCar[defaultElem];
		if (formElems.flightCar[defaultElem] == "#journeyOneWay") {
			//eachDefaultElem.parents("li").css({ display: "block", visibility: "hidden" });
		} else if (formElems.flightCar[defaultElem] == "#journeyMultiCity") {
			//eachDefaultElem.parents("li").css({ display: "block", visibility: "hidden" });
		} else {
			if (eachObjElem === "#driversAge") {
				eachDefaultElem.parent("li").removeClass("last");
				eachDefaultElem.removeAttr("disabled", "disabled");
			}
			eachDefaultElem.parents("li").show();
		}
	}


	swapPromoCodeField();
	$("#pickUpDate, #dropOffDate").hide();
	$('#paxAdults').setSelectByValue('2');
	$promocodeli = $("#promocodeli");
	if ($("html").hasClass('ie8')) {
		//$promocodeli.css({ display: "inline-block", width: "144px", margin: "0 0 0 20px" });
	}
	else {
		//$promocodeli.css({ display: "inline-block", width: "144px", margin: "0 0 0 24px" });
	}

	$('#departDate').attr('title', $("label[for='departDateDisplay']").text());
	$('#returnDate').attr('title', $("label[for='returnDateDisplay']").text());

	var departDate = $('#departdateli').detach();
	var returnDate = $('#returndateli').detach();

	if (departDate.hasClass('col-sm-3')) {
		departDate.removeClass('col-sm-3');
	}

	if (returnDate.hasClass('col-sm-3')) {
		returnDate.removeClass('col-sm-3');
	}

	if (!departDate.hasClass('col-sm-6')) {
		departDate.addClass('col-sm-6');
	}

	if (!returnDate.hasClass('col-sm-6')) {
		returnDate.addClass('col-sm-6');
	}

	departDate.show();
	returnDate.show();

	$('#onewayDepartContainer').append(departDate);
	$('#onewayDepartContainer').append(returnDate);

	$('#onewayDepartContainer').show();

	$('#hotelCarRow1, #hotelCarRow2').hide();

	$('#onewayHotelContainer').hide();

	var driversAge = $('#driversAgeDiv').detach();
	driversAge.show();
	$('#onewayDriverContainer').append(driversAge);
	$('#onewayDriverContainer').show();

	$('#carDropOffTimeDiv').hide();
	$('#carPickUpTimeDiv').hide();

	$('#onewaySpacer').show();

	$("#departDateLabel").show();
}

function flightPlusHotel() {
	flightOptions();
	var defaultElem;
	for (defaultElem in formElems.flightCar) {
		var eachDefaultElem = $(formElems.flightHotel[defaultElem]);
		if (formElems.flightHotel[defaultElem] == "#journeyOneWay") {
			//eachDefaultElem.parents("li").css({ display: "block", visibility: "hidden" });
		} else if (formElems.flightHotel[defaultElem] == "#journeyMultiCity") {
			//eachDefaultElem.parents("li").css({ display: "block", visibility: "hidden" });
		} else {
			eachDefaultElem.parents("li").show();
		}
	}
	swapPromoCodeField();
	$("#pickUpDate, #dropOffDate").hide();
	$promocodeli = $("#promocodeli");
	//$promocodeli.css({ display: "inline-block", width: "144px", margin: "0 0 0 20px" });

	$('#departDate').attr('title', $("label[for='departDateDisplay']").text());
	$('#returnDate').attr('title', $("label[for='returnDateDisplay']").text());

	var hotelRooms = $('#hotelRoomsDiv').detach();
	hotelRooms.show();
	$('#onewayHotelContainer').append(hotelRooms);
	$('#onewayHotelContainer').show();

	$('#onewayDriverContainer').hide();
	$('#driversAgeDiv').hide();
	$('#onewaySpacer').show();

	$("#departDateLabel").show();
}

function flightPlusHotelPlusCar() {
	swapCarSelectsReverse();
	flightOptions();
	var defaultElem;
	for (defaultElem in formElems.flightHotelCar) {
		var eachDefaultElem = $(formElems.flightHotelCar[defaultElem]);
		var eachObjElem = formElems.flightHotelCar[defaultElem];
		if (formElems.flightHotelCar[defaultElem] == "#journeyOneWay") {
			//eachDefaultElem.parents("li").css({ display: "block", visibility: "hidden" });
		} else if (formElems.flightHotelCar[defaultElem] == "#journeyMultiCity") {
			//eachDefaultElem.parents("li").css({ display: "block", visibility: "hidden" });
		} else {
			if (eachObjElem === "#driversAge") {
				eachDefaultElem.parent("li").addClass("last");
				eachDefaultElem.removeAttr("disabled", "disabled");
			}
			eachDefaultElem.parents("li").show();
		}
	}
	swapPromoCodeField();
	$("#pickUpDate, #dropOffDate").hide();

	$('#departDate').attr('title', $("label[for='departDateDisplay']").text());
	$('#returnDate').attr('title', $("label[for='returnDateDisplay']").text());


	$('#hotelCarRow1, #hotelCarRow2').hide();

	var hotelRooms = $('#hotelRoomsDiv').detach();
	var driversAge = $('#driversAgeDiv').detach();

	hotelRooms.show();
	driversAge.show();

	$('#onewayHotelContainer').append(hotelRooms);
	$('#onewayDriverContainer').append(driversAge);

	$('#onewayHotelContainer').show();
	$('#onewayDriverContainer').show();

	$('#carDropOffTimeDiv').hide();
	$('#carPickUpTimeDiv').hide();
	$('#onewaySpacer').show();

	$("#departDateLabel").show();
}

function hotelOnly() {
	swapCarSelectsReverse();
	var defaultElem;
	for (defaultElem in formElems.hotel) {
		var eachDefaultElem = $(formElems.hotel[defaultElem]);
		eachDefaultElem.parents("li").show();
	}

	if (!EnablePackagePromoCode) {
		var $promoInput = $('#promoCode'),
			$promoParent = $promoInput.parent();
		$promoParent.hide();
	}
	else {
		swapPromoCodeField();
	}
	hotelSearchAttach();
	var roundTripRadio = $(formElems.flightOnly.radio1);
	var oneWayRadio = $(formElems.flightOnly.radio2);
	var multiCityRadio = $(formElems.flightOnly.radio3);
	roundTripRadio.attr("disable", "disable");
	oneWayRadio.attr("disable", "disable");
	multiCityRadio.attr("disable", "disable");
	$("#departCityAutoComplete").attr("validatekey", "destination");
	$("#departCityAutoComplete").removeAttr("disable");
	$("#departCityCodeSelect").attr("disable", "disable").removeAttr("validateKey").hide();
	$("#destCityCodeSelect").attr("disable", "disable").removeAttr("validateKey").hide();
	$("label[for='departDateDisplay'], label[for='returnDateDisplay'], label[for='departCityCodeSelect'], #pickUpDate, #dropOffDate").hide();
	$("#checkInDate, #checkOutDate, label[for='locationCodeSelect']").show();
	$("#departDateLabel").hide();
	$('#noHotelsOnly').modal('hide');

	$('#departDate').attr('title', $("#checkInDate").text());
	$('#returnDate').attr('title', $("#checkOutDate").text());

	$('#hotelCarRow1, #hotelCarRow2').show();

	var departDate = $('#departdateli').detach();
	var returnDate = $('#returndateli').detach();

	var adults = $('#adultsli').detach();
	var children = $('#childrenli').detach();


	// adjust depart date sizing
	if (departDate.hasClass('col-sm-6')) {
		departDate.removeClass('col-sm-6');
	}

	if (!departDate.hasClass('col-sm-3')) {
		departDate.addClass('col-sm-3');
	}

	// adjust return date sizing
	if (returnDate.hasClass('col-sm-6')) {
		returnDate.removeClass('col-sm-6');
	}

	if (!returnDate.hasClass('col-sm-3')) {
		returnDate.addClass('col-sm-3');
	}

	$('#pickUpDateContainer').append(departDate);
	$('#pickUpTimeContainer').append(returnDate);


	$('#hotelAdultChildPromo').append(adults);
	$('#hotelAdultChildPromo').append(children);

	// adjust promo code spacing
	if (EnablePackagePromoCode) {
		//var promoCode = $('#promocodeli').detach();

		//if (promoCode) {
		//	$('#hotelAdultChildPromo').append(promoCode);
		//}
	}

	$('#hotelAdultChildPromo').show();
	$('#dropOffTimeContainer').hide();

	var hotels = $('#hotelRoomsDiv').detach();
	hotels.show();
	$('#hotelCarRoomsContainer').append(hotels);
	$('#hotelCarRoomsContainer').show();

	$('#onewayDriverContainer').hide();
	$('#onewayHotelContainer').hide();

	$('#carDropOffTimeDiv').hide();
	$('#carPickUpTimeDiv').hide();
	$('#driversAgeDiv').hide();

	$('#onewayDepartContainer').hide();
	$('#onewaySpacer').hide();

}

function hotelPlusCar() {
	var defaultElem;
	for (defaultElem in formElems.hotelCar) {
		var eachDefaultElem = $(formElems.hotelCar[defaultElem]);
		var eachObjElem = formElems.hotelCar[defaultElem];
		if (formElems.hotelCar[defaultElem] === "#departCityAutoComplete" || formElems.hotelCar[defaultElem] === "#bookingType") {
			eachDefaultElem.parents("li").show();
		} else {
			if (eachObjElem === "#driversAge") {
				eachDefaultElem.parent("li").addClass("last");
				eachDefaultElem.removeAttr("disabled", "disabled");
			}
			eachDefaultElem.parent("li").show();
		}
	}
	$("#departCityAutoComplete").attr("validatekey", "destination");
	$("#departCityAutoComplete").removeAttr("disable");
	$("#departCityCodeSelect").attr("disable", "disable").removeAttr("validateKey").hide();
	$("#destCityCodeSelect").attr("disable", "disable").removeAttr("validateKey").hide();
	$("label[for='departDateDisplay'], label[for='returnDateDisplay'], label[for='departCityCodeSelect'], #pickUpDate, #dropOffDate").hide();
	$("#checkInDate, #checkOutDate, label[for='locationCodeSelect'], label[for='carPickUpTime'], label[for='carDropOffTime']").show();
	$('#noHotelsOnly').modal('hide');
}

function swapCarSelects() {
	$("#swappableFirst").addClass("last");
	$("#swapBeforeThis").removeClass("last");
	//$("#swapBeforeThis").css("display", "inline-block");
	//$("#swappableFirst").insertBefore("#swapBeforeThis");
	//$("#swappableSecond").insertBefore("#swapBeforeAge");
	$("#swappableSecond").addClass("last");
}

function swapCarSelectsReverse() {
	$("#swappableFirst").removeClass("last");
	$("#swappableSecond").removeClass("last");
	$("#swapBeforeThis").addClass("last");
	//$("#swapBeforeThis").insertBefore("#swappableFirst");
}

function swapCarSelectsForHC() {
	//$("#swappableFirst").css("display", "inline-block");
	//$("#swappableSecond").insertAfter("#swappableFirst");
	$("#swappableSecond").addClass("last");
}

function swapPromoCodeField() {
	var promocodeid = $("#promoCode");
	if (EnablePackagePromo) {
		//promocodeid.parents("li").css("float", "none");
		if (bookingType() === "FC") {
			//$("#swapBeforeAge").css("display", "inline-block");
			//promocodeid.parents("li").insertAfter("#swapBeforeAge");
			promocodeid.parents("li").addClass("last");
			loadPlaceholders();
		}
		else if (bookingType() === "FH") {
			//promocodeid.parents("li").insertBefore("#swapBeforeAge");
			promocodeid.parents("li").addClass("last");
			loadPlaceholders();
		}
		else if (bookingType() === "FHC") {
			promocodeid.parents("li").removeClass("last");
			//promocodeid.parents("li").insertAfter("#swapBeforeAge");
			loadPlaceholders();
		}
		else if (bookingType() === "H") {
			//promocodeid.parents("li").insertBefore("#swapBeforeAge");
			promocodeid.parents("li").removeClass("last");
			//promocodeid.parents("li").css("float", "right");
			//promocodeid.parents("li").css("width", "auto");
		}
		else {
			//promocodeid.parents("li").insertBefore("#swapBeforeAge");
			promocodeid.parents("li").removeClass("last");
			//promocodeid.parents("li").css("float", "left");
		}
	} else {
		if (bookingType() != "F") {
			promocodeid.parents("li").hide();
		}
	}
}

function carOnly() {
	swapCarSelects();
	var defaultElem;
	carSearchAttach();
	for (defaultElem in formElems.car) {
		var eachDefaultElem = $(formElems.car[defaultElem]);
		var eachObjElem = formElems.car[defaultElem];
		if (formElems.car[defaultElem] === "#departCityAutoComplete" || formElems.car[defaultElem] === "#bookingType") {
			eachDefaultElem.parents("li").show();
		} else {
			//eachDefaultElem.parents("li").css({ display: "inline-block" });
			if (eachObjElem === "#driversAge") {
				eachDefaultElem.parent("li").removeClass("last");
				eachDefaultElem.removeAttr("disabled", "disabled");
			}
			eachDefaultElem.parent("li").show();
		}
	}
	var roundTripRadio = $(formElems.flightOnly.radio1);
	var oneWayRadio = $(formElems.flightOnly.radio2);
	var multiCityRadio = $(formElems.flightOnly.radio3);
	roundTripRadio.attr("disable", "disable");
	oneWayRadio.attr("disable", "disable");
	multiCityRadio.attr("disable", "disable");
	$("#departCityAutoComplete").attr("validatekey", "destination");
	$("#departCityAutoComplete").removeAttr("disable");
	var restoreValue = $("#departCityAutoComplete").val();
	if (restoreValue != "City or Airport" || restoreValue != "Ciudad o Aeropuerto") {
		$("#departCityAutoComplete").val(restoreValue);
		$("#departDate, #returnDate, #departDateDisplay, #returnDateDisplay").val();
		loadPlaceholders();
	} else {
		$("#departCityAutoComplete").val($("#departCityAutoComplete").attr("placeholder"));
	}
	$("#departCityCodeSelect").attr("disable", "disable").removeAttr("validateKey").hide();
	$("#destCityCodeSelect").attr("disable", "disable").removeAttr("validateKey").hide();
	$("#paxMinors").attr("disable", "disable").removeAttr("validatekey");
	$("label[for='departDateDisplay'], label[for='returnDateDisplay'], #checkInDate, #checkOutDate, label[for='departCityCodeSelect']").hide();
	$("#pickUpDate, #dropOffDate, label[for='locationCodeSelect']").show();
	$("#departDateLabel").hide();
	$('#paxAdults').setSelectByValue('1');

	$('#departDate').attr('title', $("#pickUpDate").text());
	$('#returnDate').attr('title', $("#dropOffDate").text());

	$('#carPickUpTime').attr('title', $("label[for='carPickUpTime']").text());
	$('#carDropOffTime').attr('title', $("label[for='carDropOffTime']").text());


	$('#hotelCarRow1, #hotelCarRow2').show();

	$('#onewayDriverContainer, #onewayHotelContainer').hide();

	var departDate = $('#departdateli').detach();
	var returnDate = $('#returndateli').detach();

	if (departDate.hasClass('col-sm-6')) {
		departDate.removeClass('col-sm-6');
	}

	if (returnDate.hasClass('col-sm-6')) {
		returnDate.removeClass('col-sm-6');
	}

	if (!departDate.hasClass('col-sm-3')) {
		departDate.addClass('col-sm-3');
	}

	if (!returnDate.hasClass('col-sm-3')) {
		returnDate.addClass('col-sm-3');
	}

	var driversAge = $('#driversAgeDiv').detach();
	driversAge.show();
	$('#hotelCarRoomsContainer').append(driversAge);
	$('#hotelCarRoomsContainer').show();

	$('#hotelAdultChildPromo').hide();
	$('#dropOffTimeContainer').show();


	$('#pickUpDateContainer').append(departDate);
	$('#dropOffDateContainer').append(returnDate);

	$('#carDropOffTimeDiv').show();
	$('#carPickUpTimeDiv').show();

	$('#hotelRoomsDiv').hide();
	$('#onewayDepartContainer').hide();
	$('#onewaySpacer').hide();

	//$('#promocodeli').hide();

}

// Display selected tab content

function ActiveTabContentArea(key) {
	var $tabContent = $('.widget_container').children();
	$tabContent.removeClass('active');
	$tabContent.filter(key).addClass('active');
	if (key === "#booking-type") {
		resetSearchWidget();
		$("#departCityAutoComplete").val('');
		if (IsRezAgent == 'True') {
			$('.show_all').hide();
			TriggerBookingTypeEvent('F');
		}
	}

	//Show search button hidden when One way international popup is shown
	$(".flightSearch").show();
	$('#international_msg').hide();
}

$('select').on('change', function () {
	$(".flightSearch").show();
	$('#international_msg').hide();
});

function TriggerBookingTypeEvent(bookingType) {
	ActiveTabContentArea('#book-travel');
	$("#bookingType").setSelectByValue(bookingType);
	$("#bookingType").trigger('change');
	$("#lblBookingType").text($('#bookingType :selected').text());
	resetSearchWidget();
	if (bookingType != 'H' && bookingType != 'C') {
		$('.fromToArrow').show();
		$('#slider-container').show();
	}

	switch (bookingType) {
		case "F":
			ToggleMilesDollars(document.getElementById('slider-dollars'));
			$("button.flightSearch").text(searchButtonFlight);
			$('.book-flight-tab').addClass('active').siblings().removeClass('active');
			flightOnly();
			searchCategory = "Flight Search";
			break;

		case "FC":
			$("button.flightSearch").text(searchButtonText);
			$('#slider-container').hide();
			$('.book-vacation-tab').addClass('active').siblings().removeClass('active');
			$('#vacation-pkg-header').removeClass('hidden');
			$('#vacation-FC-pkg')[0].checked = true;
			flightPlusCar();
			searchCategory = "Flight + Car Search";
			break;

		case "FH":
			$("button.flightSearch").text(searchButtonText);
			$('#slider-container').hide();
			$('.book-vacation-tab').addClass('active').siblings().removeClass('active');
			$('#vacation-pkg-header').removeClass('hidden');
			$('#vacation-FH-pkg')[0].checked = true;
			flightPlusHotel();
			searchCategory = "Flight + Hotel Search";
			break;

		case "FHC":
			$("button.flightSearch").text(searchButtonText);
			$('#slider-container').hide();
			$('.book-vacation-tab').addClass('active').siblings().removeClass('active');
			$('#vacation-pkg-header').removeClass('hidden');
			$('#vacation-FHC-pkg')[0].checked = true;
			flightPlusHotelPlusCar();
			searchCategory = "Flight + Hotel + Car Search";
			break;

		case "H":
			$("button.flightSearch").text(searchButtonTextHotels);
			$('.fromToArrow').hide();
			$('#slider-container').hide();
			ToggleMilesDollars(document.getElementById('slider-dollars'));
			$('.book-hotel-tab').addClass('active').siblings().removeClass('active');
			hotelOnly();
			searchCategory = "Hotel Search";
			break;
		case "HC":
			$("button.flightSearch").text(searchButtonText);
			hotelPlusCar();
			searchCategory = "Hotel + Car Search";
			break;

		case "C":
			$("button.flightSearch").text(searchButtonTextCars);
			$('.fromToArrow').hide();
			$('#slider-container').hide();
			ToggleMilesDollars(document.getElementById('slider-dollars'));
			carOnly();
			searchCategory = "Car Search";
			break;
		default:
			$("button.flightSearch").text(searchButtonFlight);
			flightOnly();
			searchCategory = "Flight Search";
	}
	if (!Modernizr.input.placeholder) {
		$('input[placeholder]').each(function () {
			if (this.value == $(this).attr('placeholder')) {
				$(this).addClass('placeholder');
			}
		});
	}
	window.setTimeout(function () {
		if ($("#noCarForSelectedDatePopup :visible").length === 0) {
			$("ul.searchElems .show_all").focus();
		}
	}, 0);
}

function loadPlaceholders() {
	if (!Modernizr.input.placeholder) {
		$('input[placeholder]').each(function () {
			if ($.trim(this.value) == "") {
				this.value = $(this).attr('placeholder');
				$(this).addClass('placeholder');
			}
		});
	}
}
function clearPlaceholders() {
	if (!Modernizr.input.placeholder) {
		$('input[placeholder]').each(function () {
			if (this.value == $(this).attr('placeholder')) {
				this.value = "";
				$(this).removeClass('placeholder');
			}
		});
	}
}

function closeOverlay() {
	$('#homepage_overlay').dialog('close');
}

function closeIFrame() {
	$('#homepage_overlay').remove();
}
function closeLearnMore() {
	window.location.href = 'http://www.spirit.com/Spirit101';
	$('#homepage_overlay').remove();
}

function getOptionsFragFromArray(array) {
	var frag = document.createDocumentFragment();
	for (var i = 0, j = array.length; i < j; i++) {
		var data = array[i];
		if (data) {
			var key = data.key;
			var value = data.value;
			var opt = document.createElement("option");
			opt.value = key;
			opt.appendChild(document.createTextNode(value));
			frag.appendChild(opt);
		}
	}

	return frag;
}

function pushDataToSelects(target, data) {
	var selectArray = target.toArray();
	var frag = getOptionsFragFromArray(data);
	for (var i = 0, j = selectArray.length; i < j; i++) {
		var ele = selectArray[i];
		ele.appendChild(frag);
		ele.selectedIndex = 0;
	}
}

function populateBirthdateFields() {
	// Month Selects
	pushDataToSelects($("select.month"), monthData);
	// Day Selects
	pushDataToSelects($("select.day"), dayData);
	// Year Selects
	pushDataToSelects($("select.year"), yearData);
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
		var index = newsItems.index(current);
		if (index == 0) {
			current = newsItems.last();
		} else {
			current = current.prev();
		}
		showCurrent();
	}

	function next() {
		var index = newsItems.index(current);
		if (index == (count - 1)) {
			current = newsItems.first();
		} else {
			current = current.next();
		}
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
// Bug # 10671 Ends


function copyHiddenDates() {
	//    var $departValue = $('#departDate'),
	//    $departDisplay = $('#departDateDisplay'),
	//    $returnValue = $('#returnDate'),
	//    $returnDisplay = $('#returnDateDisplay');
	//    if ($departValue.val().trim() != "" && $departDisplay.val().trim() == "") {
	//        var val = $departValue.val().trim();
	//        val = val.substring(0, val.indexOf(','));
	//        $departDisplay.val(val);
	//    }
	//    if ($returnValue.val().trim() != "" && $returnDisplay.val().trim() == "") {
	//        var val = $returnValue.val().trim();
	//        val = val.substring(0, val.indexOf(','));
	//        $returnDisplay.val(val);
	//    }
}

var flightSearchSelects, flightStatusSelects;


//Fix Depart and return date if different just to make sure
//both (actual hidden and user display) the date are same
function DepartReturnDateChangeCheck() {
	var actualdepartDate = $("#departDate").val();
	// actualdepartDate = actualdepartDate.substring(0, actualdepartDate.indexOf(','));
	var actualreturnDate = $("#returnDate").val();
	//actualreturnDate = actualreturnDate.substring(0, actualreturnDate.indexOf(','));
	if (actualdepartDate != "")
		$("#departDateDisplay").val(actualdepartDate).removeClass('placeholder');
	if (actualreturnDate != "")
		$("#returnDateDisplay").val(actualreturnDate).removeClass('placeholder');

}


function ChangeBookingType() {
	var $promoInput = $('#promoCode'),
		$promoParent = $promoInput.parent();
	var $milesChk = $('#redeemMiles');
	//$milesChkBoxParent = $milesChk.closest('li');

	if (bookingType() == "Cruise") {
		window.location = "http://spirit.cruises.com/?cm_mmc=Partner_Site-_-SPRT-HP_SW-_-20160429-_-SPRT_HP_SW_Cruise&utm_medium=Partner_Site&utm_source=SPRT-HP_SW&utm_campaign=20160429&utm_content=SPRT_HP_SW_Cruise";
		return false;
	}
	resetSearchWidget();

	if (!bookingType()) {
		$milesChk.val('false');
	}

	switch (bookingType()) {
		case "F":
			flightOnly();
			break;
		case "FC":
			flightPlusCar();
			break;
		case "FH":
			flightPlusHotel();
			$('#paxAdults').setSelectByValue('2');
			break;
		case "FHC":
			flightPlusHotelPlusCar();
			$('#paxAdults').setSelectByValue('2');
			break;
		case "H":
			hotelOnly();
			$('#paxAdults').setSelectByValue('2');
			break;
		case "HC":
			hotelPlusCar();
			break;
		case "C":
			carOnly();
			break;
		default:
			flightOnly();
	}
	if (bookingType() == "F") {
		$('#paxAdults').setSelectByValue('1');
		$('#paxMinors').setSelectByValue('0');
		$promoInput.trigger('blur');
		$promoParent.show();
	} else if (bookingType() == "H") {
		hotelOnly();
	} else {
		$('#paxAdults').setSelectByValue('2');
		$('#paxMinors').setSelectByValue('0');
		var $promoCodeInput = $('#promoCode'),
			$promoCodeParent = $promoCodeInput.closest('li'),
			bookingTypes = $("#bookingType option");
		$promoCodeInput.val('');
		$promoCodeInput.trigger('blur');
		$promoCodeParent.css('visibility', 'visible');
		$promoInput.val('');
		if (!EnablePackagePromo) {
			$promoParent.hide();
		}
	}
	AdjustBookingMode();
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

function onlyNumber(obj) {
	if (/^\d+$/.test(obj.value) === false) {
		obj.value = "";
	}
}

function removePax(type) {
	switch (type) {
		case 'adult':
			var newValue = adults() - 1;
			var minValue = parseInt(_($('#paxAdults option').get()).chain().pluck('value').min().value());

			if (newValue >= minValue) {
				$('#paxAdults').val(newValue);
				AdjustPaxNumbers();
			}
			break;

		case 'minor':
			var newValue = children() - 1;
			var minValue = parseInt(_($('#paxMinors option').get()).chain().pluck('value').min().value());

			if (newValue >= minValue) {
				$('#paxMinors').val(newValue);
				AdjustPaxNumbers();
			}
			break;
	}

}

function addPax(type) {
	switch (type) {
		case 'adult':
			var newValue = adults() + 1;
			var maxValue = parseInt(_($('#paxAdults option').get()).chain().pluck('value').max().value());

			if (newValue <= maxValue) {
				$('#paxAdults').val(newValue);
				AdjustPaxNumbers();
			}
			break;

		case 'minor':
			var newValue = children() + 1;
			var maxValue = parseInt(_($('#paxMinors option').get()).chain().pluck('value').max().value());

			if (newValue <= maxValue) {
				$('#paxMinors').val(newValue);
				AdjustPaxNumbers();
			}
			break;
	}

}

function hidePaxPopover(saveChanges) {
	// Hide the test zone and reset child / adult values.
	$('#TESTZONE').hide();
	$('#showTestZone').show();
	$('#hideTestZone').hide();

	if (!saveChanges) {
		$('#paxAdults').val(tempAdults);
		$('#paxMinors').val(tempChildren);
		AdjustPaxNumbers();
	}
}

function showPaxPopover() {
	// Show the test zone and save the current child / adult values.
	$('#TESTZONE').show();
	$('#showTestZone').hide();
	$('#hideTestZone').show();

	tempAdults = parseInt($('#paxAdults').val());
	tempChildren = parseInt($('#paxMinors').val());
}

function toggleMobileNavigation(tab) {

	$('#main-nav-content-container').removeClass('hidden-xs');
	$('#mobile-main-nav').hide();

	switch (tab) {
		case 'book':
			$('#book-tab > a').click();
			break;

		case 'mytrips':
			$('#manage-travel-tab > a').click();
			break;

		case 'checkin':
			$('#check-in-tab > a').click();
			break;

		case 'status':
			$('#flight-status-tab > a').click();
			break;
	}

	$('html, body').animate({
		scrollTop: $("#main-nav-content-container").offset().top
	}, 500);
}

// Apply them here
$(document).ready(function () {

	// This variable is populated on Default.aspx.  It seems travel agents cannot be linked to the book travel tab on the homepage.
	if (redirectTravelAgentPortal && window.location.hash == '#book-travel') {
		window.location.href = "travel_portal_home.aspx";
	}

	switch (window.location.hash) {

		case '#book-travel':
			toggleMobileNavigation('book');
			break;

		case '#my-trips':
			toggleMobileNavigation('mytrips');
			break;

		case '#checkin':
			toggleMobileNavigation('checkin');
			break;

		case '#flight-status':
			toggleMobileNavigation('status');
			break;
	}

	$('#main-nav-tabs a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

		var target = $(e.target).attr("href");

		switch (target) {
			case '#book-tab-content':
				$('#mobile-book-tab').hide();
				break;

			case '#manage-travel-tab-content':
				$('#mobile-manage-travel-tab').hide();
				$('#changeLastName').focus();
				break;

			case '#check-in-tab-content':
				$('#mobile-check-in-tab').hide();
				$('#checkinLastName').focus();
				break;

			case '#flight-status-tab-content':
				$('#mobile-flight-status-tab').hide();
				break;
		}
	});



	$("#book-tab, #manage-travel-tab, #flight-status-tab, #check-in-tab").on('show.bs.tab', function (e) {
		$("#error_msg_bubble").hide();
	});

	if ($.browser.msie) {
		$("body").addClass("ie");
	} else {
		$("body").addClass("no-ie");
	}
	if (IsRezAgent == "True") {
		$('.show_all').hide();
		$('#journeyMultiCity').attr('disabled', 'true');
		TriggerBookingTypeEvent('F');
	}
	LastNamePrepopulate();

	// default select Destination Flifo option
	document.getElementById("flifoDest").checked = true;

	var headlines = new HeadlineController();

	if (PageModel.culture == "es-PR") {
		$("#flightDate option").each(function () {
			var optionText = $(this).text();
			$(this).text(optionText.substring(0, 1).toUpperCase() + optionText.substring(1, optionText.length).toLowerCase());
		});
	}

	// Show Homepage Overlay Ad if enabled
	if (PageModel.enableOverlay && PageModel.enableOverlay == true) {
		function getCookie(c_name) {
			if (document.cookie.length > 0) {
				c_start = document.cookie.indexOf(c_name + "=");
				if (c_start != -1) {
					c_start = c_start + c_name.length + 1;
					c_end = document.cookie.indexOf(";", c_start);
					if (c_end == -1) c_end = document.cookie.length;
					return unescape(document.cookie.substring(c_start, c_end));
				}
			}
			return "";
		}
		var popUp = getCookie('PopUpCookieSpiritWay');

		//If Deeplinking enable and Search param is yes
		//do not display overlay
		var showOverlayPopup = true;
		EnableDeepLinking = typeof (EnableDeepLinking) === 'undefined' ? true : EnableDeepLinking;
		var paramList = GetUrlParams();
		if ("Search" in paramList && EnableDeepLinking) {
			if (paramList["Search"].toLowerCase() == 'yes') {
				showOverlayPopup = false;
			}
		}
		if ("Special" in paramList) {
			if (paramList["Special"].toLowerCase() == 'true') {
				showOverlayPopup = false;
			}
		}

		if ((popUp != null && popUp == "1") || !showOverlayPopup) {
			//do nothing
		} else {
			var now = new Date();
			var time = now.getTime();
			var expireTime = time + (7 * 24 * 60 * 60 * 1000);
			now.setTime(expireTime);

			document.cookie = "PopUpCookieSpiritWay" + "=" + "1" + "; path=/" + ";expires=" + now.toGMTString();
			var overlayContainer = document.createElement("div");
			overlayContainer.id = "homepage_overlay";
			var overlay = document.createElement("iframe");
			if (EnableUpdateBOABanner != undefined && EnableUpdateBOABanner) {
				overlay.width = "647";
				overlay.height = "396";
			}
			else {
				overlay.width = "861";
				overlay.height = "492";
			}


			overlay.src = EnableSiquisOverlays == true ? "http://marketing.spirit.com/overlay/popup.php" : "content/popup.html";
			overlay.frameborder = 0;
			overlay.scrolling = "no";
			var overlayObj = $(overlayContainer).appendTo('body');
			if (EnableUpdateBOABanner != undefined && EnableUpdateBOABanner) {

				overlayObj.dialog({
					autoOpen: true,
					modal: true,
					show: "fade",
					hide: "fade",
					width: 647,
					position: ['center', 100],
					dialogClass: "newhomepage_overlay",
					open: function (event, ui) {

						$('.ui-widget-overlay').bind('click', function () {
							$("#homepage_overlay").dialog('close');
						});


					},
					close: function (event, ui) {
						$('.ui-widget-overlay').unbind('click');
					}
				});

			}
			else {
				overlayObj.dialog({
					autoOpen: true,
					modal: true,
					show: "fade",
					hide: "fade",
					width: 861,
					position: ['center', 100],
					dialogClass: "homepage_overlay",
					open: function (event, ui) {

						$('.ui-widget-overlay').bind('click', function () {
							$("#homepage_overlay").dialog('close');
						});

						$('.btnWrap').bind('click', function () {
						});

					},
					close: function (event, ui) {
						$('.ui-widget-overlay').unbind('click');
					}
				});

			}

			overlayContainer.appendChild(overlay);
			if ($("html").hasClass('ie7') || $("html").hasClass('ie8'))
				$('#homepage_overlay').html($('#homepage_overlay').html());

		}
	}

	// If placeholder functionality is not available, toggle input values with placeholder attr value
	if (!Modernizr.input.placeholder) {
		$('input[placeholder]').each(function () {
			var $this = $(this);
			var placeholder = $this.attr('placeholder');
			this.value = placeholder;
			$this.focus(function () {
				if (this.value === placeholder) { this.value = ""; $this.removeClass('placeholder') }
			});
			$this.blur(function () {
				if ($.trim(this.value) === "") { this.value = placeholder; $this.addClass('placeholder') }
			});
			$this.blur();
		});
	}

	// Populate birthdate dropdowns
	// TODO: maybe lazyload these for optimization
	populateBirthdateFields();

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
	var typeField = $("#bookingType");
	var fieldParent = typeField.closest('li');
	fieldParent.show();
	try {
		if (!EnablePackaging) {
			optionsCount = 1;
		}
	} catch (err) { }

	for (var i = 0; i < optionsCount; i++) {
		var txt = bookingTypeLabels[i];
		var opt = document.createElement("option");
		opt.appendChild(document.createTextNode(txt));
		switch (i) {
			case 0:
				opt.value = "F";
				opt.selected = true;
				break;
			case 1:
				opt.value = "FC";
				break;
			case 2:
				opt.value = "FH";
				break;
			case 3:
				opt.value = "FHC";
				break;
			case 4:
				opt.value = "H";
				break;
			case 5:
				opt.value = "C";
				break;
			/*case 5:
			opt.value = "HC";
			break;*/
			case 6:
				opt.value = "Cruise";
				break;
		}
		bookingTypeFrag.appendChild(opt);
		$('#bookingType')[0].appendChild(bookingTypeFrag);

		//
	}
	$("#bookingType").change(function () {
		ChangeBookingType();
	});
	AdjustBookingMode();

	// Initialize Adult/Children Drop Downs
	var adultSelect = document.getElementById('paxAdults');
	var adultFrag = document.createDocumentFragment();
	for (var i = 0, j = adultLabels.length; i < j; i++) {
		var txt = adultLabels[i];
		var opt = document.createElement("option");
		opt.value = i;
		opt.appendChild(document.createTextNode(txt));
		adultFrag.appendChild(opt);
	}
	adultSelect.appendChild(adultFrag);

	var childSelect = document.getElementById('paxMinors');
	var childFrag = document.createDocumentFragment();
	for (var i = 0, j = childLabels.length; i < j; i++) {
		var txt = childLabels[i];
		var opt = document.createElement("option");
		opt.value = i;
		opt.appendChild(document.createTextNode(txt));
		childFrag.appendChild(opt);
	}
	childSelect.appendChild(childFrag);

	// Add/Remove options from Adults and Children drop-downs by
	$('#paxAdults,#paxMinors').change(function () {
		AdjustPaxNumbers();
	});

	// Initialize Hotel Drop Down
	var hotelFrag = document.createDocumentFragment();
	for (var i = 1, j = hotelLabels.length; i < j; i++) {
		var txt = hotelLabels[i];
		var opt = document.createElement("option");
		opt.value = i;
		opt.appendChild(document.createTextNode(txt));
		if (i == 1) {
			opt.selected = true;
		}
		hotelFrag.appendChild(opt);
	}
	$('#hotelRoomCount')[0].appendChild(hotelFrag);

	// Initialize drives age dropdown
	var driverAgeFrag = document.createDocumentFragment();
	for (var i = 0, j = ageLabels.length; i < j; i++) {
		var txt = ageLabels[i];
		var opt = document.createElement("option");
		opt.value = i;
		opt.appendChild(document.createTextNode(txt));
		if (i == 1) {
			opt.selected = true;
		}
		driverAgeFrag.appendChild(opt);
	}
	$('#driversAge')[0].appendChild(driverAgeFrag);

	// Initialize car pick up  and drop off time dropdown
	var pickUpTimeFrag = document.createDocumentFragment();
	for (var i = 0, j = carPickUpLabels.length; i < j; i++) {
		var txt = carPickUpLabels[i];
		var opt = document.createElement("option");
		opt.value = i;
		opt.appendChild(document.createTextNode(txt));
		if (i == 16) {
			opt.selected = true;
		}
		pickUpTimeFrag.appendChild(opt);
	}
	$('#carPickUpTime')[0].appendChild(pickUpTimeFrag);

	var dropOffTimeFrag = document.createDocumentFragment();
	for (var i = 0, j = carDropOffLabels.length; i < j; i++) {
		var txt = carDropOffLabels[i];
		var opt = document.createElement("option");
		opt.value = i;
		opt.appendChild(document.createTextNode(txt));
		if (i == 16) {
			opt.selected = true;
		}
		dropOffTimeFrag.appendChild(opt);
	}
	$('#carDropOffTime')[0].appendChild(dropOffTimeFrag);


	// Event to toggle return flight date
	$('body').on('click', 'input[name="tripType"]', function () {
		var $returnDate = $('#returnDate'),
			$returnDateDisplay = $('#returnDateDisplay'),
			$returnDateText = $('#returnDateText'),
			$returnDateParent = $returnDate.closest('li'),
			$adultsli = $("#adultsli"),
			$childrenli = $("#childrenli"),
			$promocodeli = $("#promocodeli");

		if (IsRezAgent == "True") {
			//$("#redeemMiles").attr("checked", true);4
			$("#redeemMiles").val("true");
		}
		switch (this.value) {

			case "roundTrip":
				$('#slider-container').show();

				if ($('#redeemMiles').val() === "true") {
					$('#promoCode').parent().hide();
				} else {
					$('#promoCode').parent().show();
				}

				$("#journeyRoundTrip").prop('checked', true);  // Chrome needs to be explicitly set
				$("#multiCity").hide();
				$("#returnOneway").show();
				$("#stage_ad").show();
				$returnDateDisplay.trigger('blur');
				$returnDateText.trigger('blur');
				$returnDateParent.css('visibility', 'visible');
				$returnDateParent.removeClass('hidden-xs');

				$("label[for='departDateDisplay']").text(PageModel.departureDateLabel);
				//$("#placeHolder").before($adultsli);
				//$("#placeHolder").before($childrenli);
				//$("#placeHolder").before($promocodeli);
				//$adultsli.css({ float: "none" });
				//$childrenli.css({ display: "inline-block", margin: "0 0 0 0px", float: "right" });
				//$promocodeli.css({ display: "inline-block", width: "129px", margin: "0 0 0 0px" });
				//$("#paxAdults").css({ width: "150px" });
				//$("#paxMinors").css({ width: "150px" });
				//$("#promoCode").css({ width: "129px" });
				if ($.browser.msie && $.browser.version === "7.0" && (document.documentMode === 7 || typeof (document.documentMode) === "undefined")) {
					//$childrenli.css({ float: "left" });
					//$adultsli.css({ float: "left" });
				}
				// $("#paxAdults").css({ float:"right" });
				//$("div.widget_container").width(328);

				$("#dateMultiCity1, #dateMultiCity2, #dateMultiCity3, #dateMultiCity4").val('');

				var adults = $('#adultsli').detach();
				var children = $('#childrenli').detach();
				//var promo = $('#promocodeli').detach();

				// adjust adults sizing
				if (adults.hasClass('col-sm-3')) {
					adults.removeClass('col-sm-3');
				}

				if (!adults.hasClass('col-sm-4')) {
					adults.addClass('col-sm-4');
				}

				// adjust children sizing
				if (children.hasClass('col-sm-3')) {
					children.removeClass('col-sm-3');
				}

				if (!children.hasClass('col-sm-4')) {
					children.addClass('col-sm-4');
				}


				$('#onewayAdultsContainer').append(adults);
				$('#onewayChildContainer').append(children);
				//$('#onewayPromoContainer').append(promo);

				break;

			case "multiCity":
				$('#slider-container').hide();
				ToggleMilesDollars(document.getElementById('slider-dollars'));

				$('#multiAddFlight').show();

				$("#journeyMultiCity").prop('checked', true);  // Chrome needs to be explicitly set
				multiCityflightCounter = 0;
				$("#returnOneway").hide();
				$("#stage_ad").hide();
				$("#multiCity").show();
				$("#multiCityJourney3").hide();
				$("#multiCityJourney4").hide();

				var $promoCodeInput = $('#promoCode');
				$promoCodeParent = $promoCodeInput.parent();

				bookingTypes = $("#bookingType option");

				if ($("#redeemMiles").val() === "true") {
					//$('#promoCode').parent().hide();
					//$("#redeemMiles").attr("checked", false);
					$("#redeemMiles").val("false");
					//$promoCodeParent.css('visibility', 'visible');
					//$(bookingTypes[1]).show();
					//$(bookingTypes[2]).show();
				} else {
					$('#promoCode').parent().show();
				}

				$('#paxAdults').setSelectByValue('1');
				$('#paxMinors').setSelectByValue('0');
				AdjustPaxNumbers();
				//fix for task id 15746
				//$('#promoCode').val('');

				$("div.widget_container").width($("div#multiCity").width());
				//$("p.submitbtnform").width(328);

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
					else {
						//$(".addFlight").addClass('addFlightForSpanishIE8');
					}
				}
				$("#departDate, #returnDate").val('');

				var adults = $('#adultsli').detach();
				var children = $('#childrenli').detach();
				//var promo = $('#promocodeli').detach();

				$('#multiAdultsContainer').append(adults);
				$('#multiChildContainer').append(children);
				//$('#multiPromoContainer').append(promo);
				break;

			case "oneWay":
			default:
				$('#slider-container').show();

				if ($('#redeemMiles').val() === "true") {
					$('#promoCode').parent().hide();
				} else {
					$('#promoCode').parent().show();
				}

				$("#journeyOneWay").prop('checked', true);  // Chrome needs to be explicitly set
				$("#multiCity").hide();
				$("#returnOneway").show();
				$("#stage_ad").show();
				$("label[for='departDateDisplay']").text(PageModel.dateLabel);
				$returnDateText.val('');
				$returnDate.val('');
				$returnDateDisplay.val('');
				$returnDateParent.css('visibility', 'hidden');
				$returnDateParent.addClass('hidden-xs');

				//Reset Datepicker for one way
				$("#departDate").datepicker("option", "maxDate", '+1y');
				//$("#placeHolder").before($adultsli);
				//$("#placeHolder").before($childrenli);
				//$("#placeHolder").before($promocodeli);
				//$adultsli.css({ float: "none" });
				//$childrenli.css({ display: "inline-block", margin: "0 0 0 0px", float: "right" });
				//$promocodeli.css({ display: "inline-block", width: "129px", margin: "0 0 0 0px" });
				//$("#paxAdults").css({ width: "150px" });
				//$("#paxMinors").css({ width: "150px" });
				//$("#promoCode").css({ width: "129px" });
				if ($.browser.msie && $.browser.version === "7.0" && (document.documentMode === 7 || typeof (document.documentMode) === "undefined")) {
					//$childrenli.css({ float: "left" });
					//$adultsli.css({ float: "left" });
				}
				//$("div.widget_container").width(328);
				$("#dateMultiCity1, #dateMultiCity2, #dateMultiCity3, #dateMultiCity4").val('');


				var adults = $('#adultsli').detach();
				var children = $('#childrenli').detach();
				//var promo = $('#promocodeli').detach();

				// adjust adults sizing
				if (adults.hasClass('col-sm-3')) {
					adults.removeClass('col-sm-3');
				}

				if (!adults.hasClass('col-sm-4')) {
					adults.addClass('col-sm-4');
				}

				// adjust children sizing
				if (children.hasClass('col-sm-3')) {
					children.removeClass('col-sm-3');
				}

				if (!children.hasClass('col-sm-4')) {
					children.addClass('col-sm-4');
				}

				$('#onewayAdultsContainer').append(adults);
				$('#onewayChildContainer').append(children);
				//$('#onewayPromoContainer').append(promo);
				break;
		}
		$("#adultsli").show();
		$("#childrenli").show();
		//$("#promocodeli").show();
		$("#error_msg_bubble").hide();
		LastNamePrepopulate();
	});

	/* Event to toggle Promotion Code Textbox
	$('body').on('click', 'input[name="redeemMiles"]', function () {
		if (this.value === "true") {
			this.value = "false";
		} else {
			this.value = "true";
		}
		var $promoCodeInput = $('#promoCode'),
			$promoCodeParent = $promoCodeInput.closest('li'),
			bookingTypes = $("#bookingType option");
		if (this.value === "true") {
			$promoCodeInput.val('');
			$promoCodeParent.css('visibility', 'hidden');
			$(bookingTypes[1]).hide();
			$(bookingTypes[2]).hide();
		} else {
			$promoCodeInput.trigger('blur');
			$promoCodeParent.css('visibility', 'visible');
			$(bookingTypes[1]).show();
			$(bookingTypes[2]).show();
		}
	});
	*/

	// Setup Departure and Return Datepickers

	$.datepicker.inputFormats = ["mm/dd/y", "mm/dd/yy"];//list formats to be accepted here

	$.datepicker.originalParseDateFn = $.datepicker.parseDate;

	$.datepicker.parseDate = function (format, value, settings) {
		var date;

		function tryParse(format, value, settings) {
			if (!date) {
				try {
					date = $.datepicker.originalParseDateFn(format, value, settings);
				} catch (Error) {
				}
			}
		}

		tryParse(format, value, settings);

		for (var n = 0, stop = $.datepicker.inputFormats ? $.datepicker.inputFormats.length : 0; n < stop; n++) {
			tryParse($.datepicker.inputFormats[n], value, settings);
		};

		return date;
	};

	// Setup Departure and Return Datepickers
	var today = new Date();
	var yearFromToday = new Date();
	yearFromToday.setFullYear(today.getFullYear() + 1);

	var dates = $("#departDate, #returnDate").datepicker({
		dateFormat: 'mm/dd/yy',
		showOn: 'focus',
		numberOfMonths: 2,
		monthNames: PageModel.monthOptionLabels,
		dayNamesMin: PageModel.dayNameLabels,
		minDate: today,
		maxDate: yearFromToday,
		showOtherMonths: true,
		selectOtherMonths: true,

		beforeShowDay: function (date) {
			var drawDate = moment(date);

			var validDepart = globalDepartDate().isValid() &&
				!globalDepartDate().isBefore(today, 'day') &&
				!globalDepartDate().isAfter(globalReturnDate(), 'day');
			var validReturn = globalReturnDate().isValid() &&
				!globalReturnDate().isBefore(today, 'day') &&
				!globalReturnDate().isBefore(globalDepartDate(), 'day');

			var classes = '';

			if (validDepart &&
				validReturn &&
				!drawDate.isSame(globalReturnDate(), 'day') &&
				!drawDate.isSame(globalDepartDate(), 'day') &&
				drawDate.isBetween(globalDepartDate(), globalReturnDate()) &&
				$('#returndateli').css('visibility') != 'hidden') {
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
					classes = validReturn && !(globalReturnDate().isSame(globalDepartDate(), 'day') || $('#returndateli').css('visibility') == 'hidden')
						? 'blueDotDate depart'
						: 'blueDotDate single';

				} else if (validReturn && drawDate.isSame(globalReturnDate(), 'day') && $('#returndateli').css('visibility') != 'hidden') {
					// We have selected a return date, and we're drawing that date.  
					// If the depart date has also been selected, show a box around the return date.
					// Otherwise, just show the blue dot with no outline.
					classes = validDepart ? 'blueDotDate return' : 'blueDotDate single';
				}

			} else if (this.id === 'returnDate') {
				// Return date drawing logic
				if (!validReturn && drawDate.isSame(moment(today).add(3, 'days'), 'day')) {
					classes = 'blueDotDate single';

				} else if (validReturn && drawDate.isSame(globalReturnDate(), 'day')) {
					classes = validDepart && !globalDepartDate().isSame(globalReturnDate(), 'day')
						? 'blueDotDate return'
						: 'blueDotDate single';

				} else if (validDepart && drawDate.isSame(globalDepartDate(), 'day')) {
					classes = validReturn ? 'blueDotDate depart' : 'blueDotDate single';
				}
			}

			return [true, classes];
		},

		beforeShow: function (input, instance) {
			if (!window.matchMedia) return;
			var mq = window.matchMedia("(max-width: 767px)");

			if (mq.matches) {
				$(this).datepicker("option", "numberOfMonths", [2, 1]);
			} else {
				$(this).datepicker("option", "numberOfMonths", 2);
			}
		},

		onSelect: function (selectedDate) {
			if (this.id === "departDate") {
				var $this = $(this);
				var instance = $this.data("datepicker"),
					date = $.datepicker.parseDate(
						instance.settings.dateFormat || $.datepicker._defaults.dateFormat,
						selectedDate,
						instance.settings
					);
				$this.next('input').val(selectedDate.substring(0, selectedDate.indexOf(',')));
				dates.not(this).datepicker('option', 'minDate', date);
				dates.not(this).datepicker('setDate', moment(date).add(3, 'days').toDate());
			}
			DepartReturnDateChangeCheck();
			$("#ui-datepicker-div").hide();
			$(this).next("input").removeClass('placeholder');
		}
	});


	$("#paxAdults").focus(function () {
		$("#ui-datepicker-div").hide();
	});

	$("#destCityCodeSelect").focus(function () {
		$("#ui-datepicker-div").hide();
	});

	var datesMultiCity = $("#dateMultiCity1,#dateMultiCity2,#dateMultiCity3,#dateMultiCity4").datepicker({
		numberOfMonths: 2,
		showOn: "focus",
		dateFormat: 'mm/dd/yy',
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
				$this.next('input').val(selectedDate.substring(0, selectedDate.indexOf(',')));
				$('#dateMultiCity2').datepicker('setDate', moment(date).add(3, 'days').toDate());
				$('#dateMultiCity3').datepicker('setDate', moment(date).add(6, 'days').toDate());
				$('#dateMultiCity4').datepicker('setDate', moment(date).add(9, 'days').toDate());
			}
			else if (this.id == "dateMultiCity2") {
				var $this = $(this);
				var instance = $this.data("datepicker"),
					date = $.datepicker.parseDate(
						instance.settings.dateFormat || $.datepicker._defaults.dateFormat,
						selectedDate,
						instance.settings
					);
				$this.next('input').val(selectedDate.substring(0, selectedDate.indexOf(',')));
				$('#dateMultiCity3').datepicker('setDate', moment(date).add(3, 'days').toDate());
				$('#dateMultiCity4').datepicker('setDate', moment(date).add(6, 'days').toDate());
			}
			else if (this.id == "dateMultiCity3") {
				var $this = $(this);
				var instance = $this.data("datepicker"),
					date = $.datepicker.parseDate(
						instance.settings.dateFormat || $.datepicker._defaults.dateFormat,
						selectedDate,
						instance.settings
					);
				$this.next('input').val(selectedDate.substring(0, selectedDate.indexOf(',')));
				$('#dateMultiCity4').datepicker('setDate', moment(date).add(3, 'days').toDate());
			}
			else if (this.id == "dateMultiCity4") {
				var $this = $(this);
				var instance = $this.data("datepicker"),
					date = $.datepicker.parseDate(
						instance.settings.dateFormat || $.datepicker._defaults.dateFormat,
						selectedDate,
						instance.settings
					);
				$this.next('input').val(selectedDate.substring(0, selectedDate.indexOf(',')));
			}

			$(this).next("input").removeClass('placeholder');
		}
	}).on('click', function () {
		$('#ui-datepicker-div').css('display', 'block');
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
	//    datesMultiCity.not("#dateMultiCity3").datepicker("option", "defaultDate", "+1w");
	//    datesMultiCity.not("#dateMultiCity4").datepicker("option", "defaultDate", "+1w");


	$("#dateMultiCityDisplay1").datepicker().unbind('focus').click(function () {
		$("#dateMultiCity1").datepicker("show");
	});

	$("#dateMultiCityDisplay2").datepicker().unbind('focus').click(function () {
		$("#dateMultiCity2").datepicker("show");
		$("#ui-datepicker-div").show();
		mouse_is_inside = false;
	});
	$("#dateMultiCityDisplay3").datepicker().unbind('focus').click(function () {
		$("#dateMultiCity3").datepicker("show");
		$("#ui-datepicker-div").show();
		mouse_is_inside = false;
	});
	$("#dateMultiCityDisplay4").datepicker().unbind('focus').click(function () {
		$("#dateMultiCity4").datepicker("show");
		$("#ui-datepicker-div").show();
		mouse_is_inside = false;
	});


	$('#childBirthDates').on('hidden.bs.modal', MinorDialogClosed);
	$('#childBirthDates').on('hide.bs.modal', MinorDialogClosing);


	$("#childBirthDates").find("button").click(function () {
		minorDialogClosed = true;
		$("#childBirthDates").modal('hide');
	});

	function ClearAwardSearch() {
		$("#fsMemberNumber").val("");
		$("#fsActualNumber").val("");
		$("#fsMemberContinue").attr("data-fsmemberprovided", "false");
		$("#fsMemberResponseData, #fsMemberContinue").hide();

	}

	function ResetAwardPrompt() {
		$("#fsMemberRetrieve").text(originalAwardSubmitText);
		$("#fsMemberRetrieve").addClass("primary");
	}

	var originalAwardSubmitText = null;

	$("#fsActualNumber").on("keypress", function (e) {
		if (e.keyCode == 13) {
			$("#fsMemberRetrieve").click();
			event.preventDefault();
			return;
		}
	});

	$("#fsMemberRetrieve").click(function (event) {
		var clickedButton = $(this);
		if (originalAwardSubmitText == null) {
			originalAwardSubmitText = clickedButton.text();
		}
		var collectFSnumber = $("#fsActualNumber").val();
		blockPage();
		if (FsNumberAwardBooking.processForm(this)) {
			$.ajax({
				async: false,
				type: "POST",
				url: "AwardMemberSearchAjax.aspx",
				dataType: "json", // assumed we will pass this as a GET to whatever script will retrieve the FS member data
				data: "fsnumber=" + collectFSnumber, // FS member number passed as paramenters along with the url  (GET)
				cache: false,
				success: function (response, textStatus, jqXHR) { // get json back
					if (response) {
						if (response.status == "success") {
							var btnTextDisplay = (PageModel.culture == 'en-US') ? 'Refresh' : 'Refrescar';

							var fsMemberData = $("#fsMemberResponseData span"); // grabbing the collection of spans in which the data will be displayed
							$(fsMemberData[0]).text(response.member.MemberName);
							$(fsMemberData[1]).text(response.member.FreeSpiritNumber);
							$(fsMemberData[2]).text(response.member.MemberEmail);
							$(fsMemberData[3]).text(response.member.MemberMiles + " miles");
							if (response.member.CardHolderStatus == "false") {
								$(fsMemberData[4]).text(PageModel.fsMemberStatusLabel);
							} else {
								$(fsMemberData[4]).text(PageModel.fsCardHolderLabel);
							}
							$("#fsMemberNumber").val(response.member.FreeSpiritNumber);

							clickedButton.removeClass("primary").text(btnTextDisplay);
							$("#fsMemberResponseData, #fsMemberContinue").show();
							$("#fsMemberContinue").attr("data-fsmemberprovided", "true");
							$("#fsMemberNumberFailed").hide();
						} else if (response.status == "failure") {
							ClearAwardSearch();
							if (PageModel.culture == 'es-PR') {
								$("#fsMemberNumberFailed").text("La cuenta no existe: no se encontró").show();
							}
							else {
								$("#fsMemberNumberFailed").text("Account does not exist:not found").show();
							}

						}
					} else {
						ClearAwardSearch();
						$("#fsMemberNumberFailed").text("Account does not exist:response bad").show();
					}
				}
			});
		} else {
			ClearAwardSearch();
		}
		unBlockPage();
	});

	$("#fsMemberContinue").click(function () {
		$('#freeSpiritAwardNumber').modal('hide');
		$("#book-travel-form").submit();
		return true;
	});

	$("#closeFSPopup").click(function () {
		ClearAwardSearch();
		ResetAwardPrompt();
		$('#freeSpiritAwardNumber').modal('hide');

	});

	$("#unaccompaniedMinorAccept").find("button").click(function () {
		minorFeeAccepted = true;
		$("#unaccompaniedMinorAccept").modal('hide');
		$("#book-travel-form").submit();
	});

	$("#unaccompaniedMinorNotAllowed").find("button").click(function () {
		childBirthDates = [];
		childLapOption = [];
		$("#childBirthDates").find("p[class='actions']").css("display", "none");
		$("#unaccompaniedMinorNotAllowed").modal('hide');
	});


	$(".cancelMinorFeeAcceptance").click(function () {
		minorFeeAccepted = false;
		childBirthDates = [];
		childLapOption = [];
		$("#childBirthDates").find("p[class='actions']").css("display", "none");
		$('#unaccompaniedMinorAccept').modal('hide');
	});

	$("#closePopup").click(function () {
		$('#childBirthDates').modal('hide');
	});


	$("#childBirthDates").find("p[class='actions']").css("display", "none");

	// Continue without hotel button should work same as
	// Flight Only path
	$("#continueWithoutHotel").click(function () {
		$("#bookingType").unbind("change");
		$("#bookingType").val("F");
		$("#book-travel-form").submit();
	});

	// Continue without car button should work same as
	// Flight+Hotel path
	$("#continueWithoutCar").on('click', function () {
		$("#bookingType").unbind("change");
		$("#bookingType").val("FH");
		$("#book-travel-form").submit();
	});

	// Event to select new Dateoptions
	$("#newDateSelection").click(function () {
		$('#tooCloseDatesForPkg').modal('hide');
	});

	// Event to select new Dateoptions
	$("#newDateSelectionWithoutCar").click(function () {
		$('#noCarsPopup').modal('hide');
	});

	// Event to select new Date options for same day return booking for hotel
	$("#newDateForNoHotelSameDayReturn").click(function () {
		$('#noHotelForSameDayReturnPopup').modal('hide');
	});

	// Event to select new Dateoptions for car only path

	$("#newDateSelectionForCarOnly").click(function () {
		$('#noCarOnlyPopup').modal('hide');
	});

	$("#closeWindowCarOnly").click(function () {
		$('#noCarOnlyPopup').modal('hide');
		//clearValuesCarOnly();
		//TriggerBookingTypeEvent('C');
	});

	// Event to select new Date options for car path Booking

	$("#newDateSelectionForCarBooking").click(function () {
		$("#departDateDisplay, #returnDateDisplay, #departDate, #returnDate").val("");
		setSearchSelectionCookie();
		$('#noCarForSelectedDatePopup').modal('hide');
	});

	$("#closeWindowCarBooking").click(function () {
		$('#noCarForSelectedDatePopup').modal('hide');
		clearValuesCarOnly();
		ActiveTabContentArea('#booking-type');
		TriggerBookingTypeEvent('C');
	});

	// Bug # 14008
	$("#newDateSelectionForCarSameDates").click(function () {
		$('#noCarForSelectedDateAndTimePopup').modal('hide');
	});

	$("#closeWindowCarSameDate").click(function () {
		$('#noCarForSelectedDateAndTimePopup').modal('hide');
		clearValuesCarOnly();
	});
	// Bug # 14008 Ends



	function clearValuesCarOnly() {
		$("#departCityAutoComplete, #departDateDisplay, #returnDateDisplay").val("");
	}


	// Event to trigger form validation
	$('#book-travel-form').on('submit', function (event) {
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
		VerifyValidHotelOnly();
		VerifyValidCarOnly();


		if (!VerifyDateFormat()) { loadPlaceholders(); event.preventDefault(); return; }
		if (!VerifyTrip()) { loadPlaceholders(); event.preventDefault(); return; }
		if (!VerifyDateFormat()) { loadPlaceholders(); event.preventDefault(); return; }

		if ($('input[name=tripType]:checked').val() == 'multiCity') {
			if (!FlightSearchValidatorMulticity.processForm(target)) { loadPlaceholders(); event.preventDefault(); return; }
		}
		else {
			if (!FlightSearchValidator.processForm(target) || !VerifyDepartureReturnDate()) {
				loadPlaceholders(); event.preventDefault(); return;
			}
		}



		if (!VerifyDepartureDateForPkg()) { loadPlaceholders(); event.preventDefault(); return; }
		// Bug # 14008
		if (!VerifyDepartureDateAndTimeForCar()) { loadPlaceholders(); event.preventDefault(); return; }
		// Bug # 14008 Ends
		if (!VerifySameDayReturnForPkg()) { loadPlaceholders(); event.preventDefault(); return; }
		if (!VerifyPassengers()) { loadPlaceholders(); event.preventDefault(); return; }
		if (!VerifyMinors()) { loadPlaceholders(); event.preventDefault(); return; }
		if (!VerifyRezAgent()) { loadPlaceholders(); event.preventDefault(); return; }
		if (!VerifyPromoCode()) { loadPlaceholders(); event.preventDefault(); return; }
		if (!VerifyBirthDates()) { loadPlaceholders(); event.preventDefault(); return; }
		if (!VerifyValidHotelOnly()) { loadPlaceholders(); event.preventDefault(); return; }
		if (!VerifyRedemptionLogin()) { loadPlaceholders(); event.preventDefault(); return; }
		//if (!VerifyGuid()) { loadPlaceholders(); event.preventDefault(); return; }
		var tripType = $('input[name=tripType]:checked').val();
		// One Way International Popup
		if ($.cookie('internationalPopup') != 'true' && isInternationalFlight() && tripType == 'oneWay' && (OneWayInternationalPopup != undefined && OneWayInternationalPopup != null && OneWayInternationalPopup)) {
			internationalPopup($('#returnOneway .station_search select:visible'));
			loadPlaceholders();
			event.preventDefault();
			return;
		}

		setSearchSelectionCookie();
		analyticsEvent(searchCategory, stationFrom() + '-' + stationTo(), "Homepage");
		//dataLayer.push({
		//	'dimension11': stationFrom() + '-' + stationTo(),
		//	'dimension12': adults() + children(),
		//	'dimension13': searchCategory,
		//	'dimension16': $("#departDate").val(),
		//	'dimension17': $("#returnDate").val(),
		//	'eventCategory': searchCategory,
		//	'eventAction': stationFrom() + '-' + stationTo(),
		//	'eventLabel' : "Homepage",
		//	'event': 'analyticsEvent'
		//});
		PageModel.issubmitClicked = true;

		blockPage();
	});
	$('#flight-status-form').on('submit', function (event) {
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
		AddPseudoHotelcities($(this).attr('id'));
		AdjustPaxNumbers();
	});


	$('#paxAdults').change(function () {
		AdjustHotelRooms("userChanged");
	});

	SetDefaultValues();
	AdjustHotelRooms();
	CheckForLoadErrors();

	$('#closeButton_OneWayInternationalMsg').click(function () {
		$('#OneWayInternationalMsg').dialog('close');
	});

	$('#closeButton_Under5').click(function () {
		$('#childUnder5').modal('hide');
	});

	$('#closeButton_Lapchild').click(function () {
		$('#lapchildMismatch').modal('hide');
	});

	$('#closeButton_nohotels').click(function () {
		$('#nohotels').modal('hide');
	});

	$('#closeButton_noHotelsOnly').click(function () {
		//$('#noHotelsOnly').dialog('close', function () { window.location.href = "default.aspx"; } ());
		$('#noHotelsOnly').modal('hide');
	});

	$('#closeButton_noCarOnlyPopup').click(function () {
		//$('#noHotelsOnly').dialog('close', function () { window.location.href = "default.aspx"; } ());
		$('#noCarOnlyPopup').modal('hide');
	});

	$('#closeButton_childSixDay').click(function () {
		$('#childSixDay').modal('hide');
	});

	$('#closeButton_flifoUnavailable').click(function () {
		$('#flifoUnavailable').modal('hide');
	});
	$("#closeWindowFlifoUnavailable").click(function () {
		$('#flifoUnavailable').modal('hide');
	});

	$('#closeButton_namePnrMismatch').click(function () {
		$('#namePnrMismatch').modal('hide');
	});

	$("#check-in-form").find("button").click(function (event) {
		clearPlaceholders();
		if (!CheckInValidator.processForm(this) || !VerifyGuid()) {
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
		if (!ChangeFlightValidator.processForm(this) || !VerifyGuid()) {
			loadPlaceholders();
			event.preventDefault();
			return false;
		} else {
			var dataString = 'recordlocator=' + $("#changeConfirmationCode").val() + '&lastname=' + $("#changeLastName").val() + '&type=change-flight';
			RetrieveBooking(dataString);
			blockPage();
		}
	});

	$("#cancel-flight-form").find("button").click(function (event) {
		clearPlaceholders();
		if (!CancelFlightValidator.processForm(this) || !VerifyGuid()) {
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
		//$("#fsNumber").find("li").css("display", "inline");
	}
	if (location.hash === "#book-travel") {
		$("#lblBookingType").text($('#bookingType :selected').text());
		if (bookingType() != 'F') {
		}
		else {
			$("#bookingType").val('F');
			flightOnly();
		}
	}
});

$(window).on('load', (function () {
	if (PageModel.marketingBanner) {

		sensitiveSite = typeof (sensitiveSite) === 'undefined' ? false : sensitiveSite;
		if (!sensitiveSite) {
			//  if (flashinstalled == true) {
			//    if (flashversion) {
			//document.write("You have Flash version " + flashversion + " installed.");
			//alert("flash version " + flashversion);
			var banner = document.createElement("iframe");
			banner.style.width = "558px";
			banner.style.height = "430px";
			banner.frameborder = 0;
			banner.scrolling = "no";
			banner.title = "Travel Deals";
			banner.src = PageModel.marketingBanner;
			$('#stage_ad').html("").append(banner);
			//   }
			// }
		} else {
			var banner = document.createElement("iframe");
			banner.style.width = "558px";
			banner.style.height = "430px";
			banner.title = "Travel Deals";
			banner.frameborder = 0;
			banner.scrolling = "no";
			if (PageModel.culture == 'es-PR') {
				banner.src = "Content/StaticHtml/Sensitive/es-PR/SensitiveHomeRight.html";
			} else {
				banner.src = "Content/StaticHtml/Sensitive/en-US/SensitiveHomeRight.html";
			}
			$('#stage_ad').html("").append(banner);
		}
	}

	//Default : enable deeplinking if not available
	EnableDeepLinking = typeof (EnableDeepLinking) === 'undefined' ? true : EnableDeepLinking;

	//Enable DeepLinking
	if (EnableDeepLinking) {
		//Deeplink script: Get URL Parameters
		var params = GetUrlParams();
		//select hotel room
		if ("HotelRooms" in params) {
			if (!isNaN(params["HotelRooms"])) {
				$("#hotelRoomCount").setSelectByValue(params["HotelRooms"]);
			}
		}

		//Deeplink: Submit if querystring Search=yes
		if ("Search" in params) {
			if (params["Search"].toLowerCase() == 'yes')
				$('#book-travel-form').submit();
		}
	}

	switchToTab($.cookie('currentTabSelected'));

	$.cookie('InsurancePopup', 'false');
	var hIndex = 0;
	$("#headlines a").each(function () {
		hIndex = parseInt($("#headlines a").attr('tabindex'));
		$(this).prop('tabindex', hIndex);
	});
	if ($('#continueWithoutCar').is(':visible')) {
		$("#continueWithoutCar").focus();
	}
	if ($('#changeButton_noHotels').is(':visible')) {
		$("#changeButton_noHotels").focus();
	}
}));

function VerifyValidHotelOnly() {
	if (bookingType() == "H" || bookingType() == "HC") {
		var inputText = autoCompleteText();
		var result = _.any(hotelOnlyList, function (value) {
			return value.Name == inputText;
		});
		if (!result) {
			$("#departCityAutoComplete").val("");
			$("#autoCompleteValue").val("");

		}
		return result;
	}
	return true;
}

function VerifyValidCarOnly() {
	if (bookingType() == "C") {
		var inputText = autoCompleteText();
		var result = _.any(carSearchArray, function (value) {
			return value.Description == inputText;
		});
		//        if (!result) {
		//            $("#departCityAutoComplete").val("");
		//            $("#autoCompleteValue").val("");

		//        }
		return result;
	}
	return true;
}

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

function AdjustHotelRooms(userChanged) {
	var tmpHotelRoom = $('#hotelRoomCount').val();
	$('#hotelRoomCount').children().remove();
	var hotelFrag = document.createDocumentFragment();
	for (var i = 1; i < (adults() + 1) && i < hotelLabels.length; i++) {
		var txt = hotelLabels[i];
		var opt = document.createElement("option");
		opt.value = i;
		opt.appendChild(document.createTextNode(txt));
		//Bug 14666
		if (userChanged === "userChanged") {
			switch (tmpHotelRoom) {
				case "1":
					opt.selected[0] = true;
					break;
				case "2":
					opt.selected[0] = true;
					break;
				case "3":
					opt.selected[0] = true;
					break;
				case "4":
					opt.selected[0] = true;
					break;
			}
		}
		//Bug 14666 end
		if (i == tmpHotelRoom) { opt.selected[0] = true; }
		hotelFrag.appendChild(opt);
	}
	$('#hotelRoomCount')[0].appendChild(hotelFrag);
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

	json.push('","HotelOnlyAutoComplete":"');
	json.push($("#departCityAutoComplete").val());

	json.push('","HotelOnlyAutoCompleteHidden":"');
	json.push($("#autoCompleteValue").val());

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

	json.push('","PromoCode":"');
	json.push($("#promoCode").val());

	json.push('","HotelRooms":"');
	json.push($("#hotelRoomCount").val());

	json.push('","Language":"');
	json.push(PageModel.culture);

	json.push('","RedeemMiles":"');
	json.push($("#redeemMiles").val() === "true");

	json.push('"}');
	var jsonString = escape(json.join('')); // Escape the character not supported by Cookie engine
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
				//var formatReturnDate = selection.ReturnDate.split("/");
				//var buildReturnDate = dateFormat.monthsEn[formatReturnDate[0] - 1] + " " + formatReturnDate[1] + ", " + formatReturnDate[2];
				var retDate = moment(selection.ReturnDate, 'MM-DD-YYYY');
				selection.ReturnDate = retDate.isValid() ? retDate.toDate() : new Date();
			}
			if (selection.DepartureDate != undefined) {
				//var formatDepartDate = selection.DepartureDate.split("/");
				//var buildDepartDate = dateFormat.monthsEn[formatDepartDate[0] - 1] + " " + formatDepartDate[1] + ", " + formatDepartDate[2];
				var depDate = moment(selection.DepartureDate, 'MM-DD-YYYY');
				selection.DepartureDate = depDate.isValid() ? depDate.toDate() : new Date();
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
		//ChangeBookingType();
		//AdjustBookingMode();
		if (selection.Adults != undefined) { $("#paxAdults").setSelectByValue(selection.Adults); }
		if (selection.Children != undefined) { $("#paxMinors").setSelectByValue(selection.Children); }
		AdjustHotelRooms();
		if (selection.HotelRooms != undefined) {
			$("#hotelRoomCount").setSelectByValue(selection.HotelRooms <= 1 ? "1" : selection.HotelRooms);
		}
		var savedReturnDate = selection.ReturnDate;
		var savedDepartDate = selection.DepartureDate;
		if (PageModel.culture != selection.Language && selection.ReturnDate != undefined) {
			//savedReturnDate = SwapStringDateCulture(savedReturnDate, selection.Language);
		}
		if (PageModel.culture != selection.Language && selection.DepartureDate != undefined) {
			//savedDepartDate = SwapStringDateCulture(savedDepartDate, selection.Language); //ToENStringDate
		}
		if (selection.HotelOnlyAutoComplete != undefined) { $("#departCityAutoComplete").val(selection.HotelOnlyAutoComplete); }
		if (selection.HotelOnlyAutoCompleteHidden != undefined) { $("#autoCompleteValue").val(selection.HotelOnlyAutoCompleteHidden); }
		if (selection.DepartureDate != undefined && selection.DepartureDate >= new Date()) {

			//$("#departDate").val(savedDepartDate);
			$('#departDate').datepicker('setDate', savedDepartDate);
			//var depDate = new Date($('#departDate').datepicker("getDate"));
			$("#returnDate").datepicker("option", "minDate", savedDepartDate);
			$("#returnDate").datepicker("setDate", savedDepartDate);
		}
		if (selection.ReturnDate != undefined && selection.ReturnDate >= new Date()) {
			//$("#returnDate").val(savedReturnDate);
			$('#returnDate').datepicker('setDate', savedReturnDate);
			//$("#returnDateDisplay").val(savedReturnDate.substring(0, savedReturnDate.indexOf(",")));
		}
		if (selection.DepartureDate != undefined && selection.DepartureDate >= new Date()) {
			//$("#departDate").val(savedDepartDate);
			$("#departDate").datepicker('setDate', savedDepartDate);
			//$("#departDateDisplay").val(savedDepartDate.substring(0, savedDepartDate.indexOf(",")));
		}
		$("input[name='tripType']").removeProp("checked");
		if (selection.PromoCode != undefined) { $("input#promoCode").val(selection.PromoCode.toUpperCase()); }
		if (selection.TripType == "roundTrip") {
			$("#journeyRoundTrip").attr("checked", "checked"); //replaced prop with attr as it does not work in chrome
			//refersh the content: chrome does not referesh after removeProp: bug 8744
			$("#journeyRoundTrip").parent().html($("#journeyRoundTrip").parent().html());
		} else if (selection.TripType == "multiCity") {
			$("#journeyMultiCity").attr("checked", "checked"); //replaced prop with attr as it does not work in chrome
			//refersh the content: chrome does not referesh after removeProp: bug 8744
			$("#journeyMultiCity").parent().html($("#journeyMultiCity").parent().html());
		} else {
			$("#journeyOneWay").attr("checked", "checked");
			$("#journeyOneWay").parent().html($("#journeyOneWay").parent().html());
			var $returnDate = $('#returnDate'),
				$returnDateDisplay = $('#returnDateDisplay'),
				$returnDateText = $('#returnDateText'),
				$returnDateParent = $returnDate.closest('li');
			$returnDateText.val('');
			$returnDate.val('');
			$returnDateDisplay.val('');
			$returnDateParent.css('visibility', 'hidden');
		}
		if (selection.From != undefined) {
			if ($.trim(selection.From) != "" && $("#departCityCodeSelect option[value=" + $.trim(selection.From.toUpperCase()) + "]").length > 0) {
				flightSearchSelects.setFromStation($.trim(selection.From.toUpperCase()));
			}
		}
		if (selection.To != undefined) {
			if ($.trim(selection.To) != "" && $("#destCityCodeSelect option[value=" + $.trim(selection.To.toUpperCase()) + "]").length > 0) {

				flightSearchSelects.setToStation($.trim(selection.To.toUpperCase()));
				AddPseudoHotelcities($("#destCityCodeSelect").attr('id'));
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

		if (selection.BookingType.toUpperCase() == "C" && selection.Location != undefined) {

			$.ajax({
				async: false,
				type: "POST",
				url: "HertzLocationSearch.aspx",
				data: { term: selection.Location.toUpperCase() },
				datatype: "json",
				cache: false,
				success: (function (html) {
					if (html.length > 0) {
						$("#departCityAutoComplete").val(html[0].Description);
						$("#autoCompleteValue").val(html[0].OagCode);
						carSearchArray = html;
					}
				})

			});
		}

		DepartReturnDateChangeCheck();
		if (true) {
			var $promoCodeInput = $('#promoCode'),
				$promoCodeParent = $promoCodeInput.closest('li');

			var redeemMiles = ("RedeemMiles" in selection) ? selection.RedeemMiles.toLowerCase() : "false";

			if (redeemMiles == "true") {
				//$("#redeemMiles").attr("checked", true);
				ToggleMilesDollars(document.getElementById('slider-miles'));
				$("#redeemMiles").val("true");
				//$promoCodeInput.parent().hide();
				$promoCodeInput.val('');
			} else {
				//$("#redeemMiles").attr("checked", false);
				ToggleMilesDollars(document.getElementById('slider-dollars'));
				$("#redeemMiles").val("false");
				//$promoCodeInput.parent().show();
			}
		}
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
	if (CheckMarketRow('fromMultiCity1') && $('#dateMultiCity1').val() != '')
		return SelectionDateFormat($('#dateMultiCity1').datepicker("getDate"));
	else if (CheckMarketRow('fromMultiCity2') && $('#dateMultiCity2').val() != '')
		return SelectionDateFormat($('#dateMultiCity2').datepicker("getDate"));
	else if (CheckMarketRow('fromMultiCity3') && $('#dateMultiCity3').val() != '')
		return SelectionDateFormat($('#dateMultiCity3').datepicker("getDate"));
	else if (CheckMarketRow('fromMultiCity4') && $('#dateMultiCity4').val() != '')
		return SelectionDateFormat($('#dateMultiCity4').datepicker("getDate"));
}

function GetMulticityReturnDate() {
	if (CheckMarketRow('fromMultiCity4') && $('#dateMultiCity4').val() != '')
		return SelectionDateFormat($('#dateMultiCity4').datepicker("getDate"));
	else if (CheckMarketRow('fromMultiCity3') && $('#dateMultiCity3').val() != '')
		return SelectionDateFormat($('#dateMultiCity3').datepicker("getDate"));
	else if (CheckMarketRow('fromMultiCity2') && $('#dateMultiCity2').val() != '')
		return SelectionDateFormat($('#dateMultiCity2').datepicker("getDate"));
	else if (CheckMarketRow('fromMultiCity1') && $('#dateMultiCity1').val() != '')
		return SelectionDateFormat($('#dateMultiCity1').datepicker("getDate"));
}


function VerifyPromoCode() {
	{
		var promoCode = $.trim($('#promoCode').val());
		if (promoCode.length > 0) {
			validPromoCode = false;
			var bookingType = $("#bookingType").val();
			var returnDate = '';
			var departDate = '';
			//  if (!IsEmpty(selection)) {
			//  returnDate
			//   returnDate.getMonth()].value + " " + returnDate.getDate() + ", " + returnDate.getFullYear()
			//   returnDate.getMonth()].value + " " + returnDate.getDate() + ", " + returnDate.getFullYear()
			try {
				if (bookingType == "F" && $('#journeyMultiCity').prop('checked') == true) {
					departDate = GetMulticityDepartDate();
					returnDate = GetMulticityReturnDate();
				}
				else {
					departDate = SelectionDateFormat($('#departDate').datepicker("getDate"));
					returnDate = SelectionDateFormat($('#returnDate').datepicker("getDate"));
				}
			} catch (e) { }
			//returnDate = SelectionDateFormat(ToJsonDate(selection.ReturnDate));
			//  departDate = SelectionDateFormat(ToJsonDate(selection.DepartureDate));
			//    }

			$.ajax({
				async: false,
				type: "POST",
				url: "AjaxPromoCodeCheck.aspx",
				dataType: "json",
				data: "promocode=" + promoCode + "&depart=" + stationFrom() + "&arrive=" + stationTo() + "&departDate=" + departDate + "&returnDate=" + returnDate + "&bookingType=" + bookingType,
				cache: false,
				success: function (response) {
					PromoCodeVerified(response);
				}
			});

			if (!validPromoCode) {
				$('#invalid_promocode').modal();

				$("#invalid_promocode p.actions button.button").click(function () {
					minorDialogClosed = true;
					$("#invalid_promocode").modal('hide');
					$('#promoCode').focus();
				});
			}
			return validPromoCode;
		}
	}
	return true;
}
function VerifyGuid() {
	//needs to be on the requests themselves
	return true;
}
function PromoCodeVerified(response) {
	validPromoCode = response.success;
}
function GuidVerified(response) {
	validGuid = response.success;
}

function MinorDialogClosing() {
	$("#paxInfants").val($("input[id$='_lapChild']:checked").length);
	return true;
}

function CollectChildBirthDates() {
	childBirthDates = [];
	childLapOption = [];
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

function MinorDialogClosed() {
	// Hide International minor message
	$("#lapInternationalMsg").css("display", "none");

	if (minorDialogClosed) {
		// Write child birth dates to a form input
		CollectChildBirthDates();
		$("#birthdates").val(childBirthDates.toString());
		$("#lapoption").val(childLapOption.toString());

		if ($("input[id$='_lapChild']:checked").length > adults()) {
			$('#lapchildMismatch').modal(); // Show mismatch popup error
			childBirthDates = [];
			childLapOption = [];
			$("#paxInfants").val("0");
		}
		else {
			if (ValidateBirthDates())
				$("#book-travel-form").submit();
			else
				$("#childBirthDates").find("p[class='actions']").css("display", "none");
		}
	}
	else {
		childBirthDates = [];
		childLapOption = [];
		$("#childBirthDates").find("p[class='actions']").css("display", "none");
	}
	minorDialogClosed = false;
}

//Verify the date for Package booking
//should be after 2 days
function VerifyDepartureDateForPkg() {
	return true;
	if (bookingType() != "F") {
		var datePickerDate = $('#departDate').datepicker("getDate");
		var departDate = new Date();
		var pkgAvailDate = new Date();
		departDate = new Date(datePickerDate.getFullYear(), datePickerDate.getMonth(), datePickerDate.getDate());
		if (bookingType() == 'FC') {
			pkgAvailDate.setDate(pkgAvailDate.getDate());
		} else {
			pkgAvailDate.setDate(pkgAvailDate.getDate() + 1);
		}
		if (departDate < pkgAvailDate && bookingType() == "FC") {
			$('#tooCloseDatesForFCPkg').modal();
			return false;
		} else if (departDate < pkgAvailDate && bookingType() != "C") {
			$('#tooCloseDatesForPkg').modal();
			return false;
		}
	}
	return true;
}

// Bug # 14008
function VerifyDepartureDateAndTimeForCar() {
	if (bookingType() == "C") {
		var departureTime = $("#carPickUpTime option:selected").val();
		var arrivalTime = $("#carDropOffTime option:selected").val();
		var actualdepartDate = $("#departDate").val();
		var actualreturnDate = $("#returnDate").val();
		if (actualdepartDate == actualreturnDate && departureTime == arrivalTime) {
			$('#noCarForSelectedDateAndTimePopup').modal();
			return false;
		}
	}
	return true;
}
// Bug # 14008 Ends

function VerifyDateFormat() {
	var result = true;

	$(".datepicker_input").each(function () {
		var input = $(this).val();
		if (input != "" && !moment(input, 'MM-DD-YYYY').isValid()) {
			$("div.error_msg_bubble").hide();
			var bubble = new BubbleHelper('#error_msg_bubble');
			bubble.display($(this), "Please enter a valid Date.");
			result = false;
			return false;
		}
	});
	return result;
}


function VerifyDepartureReturnDate() {
	if (bookingType() === "F" && $("#journeyRoundTrip").is(':checked')) {
		var departureDatePicker = $('#departDate').datepicker("getDate");
		var returnDatePicker = $('#returnDate').datepicker("getDate");
		var departDate = new Date(departureDatePicker.getFullYear(), departureDatePicker.getMonth(), departureDatePicker.getDate());

		//no returns date so dont validate
		if (returnDatePicker == null) { return true; }

		var returnDate = new Date(returnDatePicker.getFullYear(), returnDatePicker.getMonth(), returnDatePicker.getDate());

		if (returnDate < departDate) {
			$("div.error_msg_bubble").hide();
			var bubble = new BubbleHelper('#error_msg_bubble');
			var returnDateCtrl = $('#returnDate');
			bubble.display($(returnDateCtrl), PageModel.dateError);
			return false;
		}
	}
	return true;
}

//Verify the date for Hotel booking
//Verify the date for Flight + Car booking
//should not be same day return
function VerifySameDayReturnForPkg() {
	if (bookingType() != 'C' && bookingType() != 'F') {
		var departureDatePicker = $('#departDate').datepicker("getDate");
		var returnDatePicker = $('#returnDate').datepicker("getDate");

		var departDate = new Date(departureDatePicker.getFullYear(), departureDatePicker.getMonth(), departureDatePicker.getDate());
		//  departDate.setMonth();
		//  departDate.setDate();
		//  departDate.setFullYear();


		//no returns date so dont validate
		if (returnDatePicker == null) {
			return true;
		}
		var returnDate = new Date(returnDatePicker.getFullYear(), returnDatePicker.getMonth(), returnDatePicker.getDate());
		// returnDate.setMonth(returnDatePicker.getMonth());
		// returnDate.setDate();
		//returnDate.setFullYear();
		if (returnDate <= departDate) {
			if (bookingType().contains('H')) {
				$("#noHotelForSameDayReturnPopup").modal();
				return false;
			}
			if (_.last(bookingType()) == 'C') {
				$("#noCarOnlyPopup").modal();
				return false;
			}
		}
	}
	return true;
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
	if (adults() == 0 && children() == 0) {
		$('#passengersRequired').modal(); // Show international popup error
		return false;
	}
	return true;
}
var radioTemplate = "<input type='radio' />";

function VerifyRezAgent() {
	var fsMemberProvided = $("#fsMemberContinue").attr("data-fsmemberprovided");
	if (awardRezAgent() == true && fsMemberProvided == "false") {
		$("#freeSpiritAwardNumber").modal(); // We can't wait here, so we have to pop this and return false
		return false;
	}
	return true;
};

function VerifyMinors() {
	if (adults() == 0 && children() > 0) {

		// Check for flight-only mode
		if (bookingType() != "F") {
			$('#childFlightOnly').modal(); // Show international popup error
			return false;
		}

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

			// Display Minor not alllowed popup if its International flight
			if (isInternationalFlight() && !over15Yrs) {
				$('#unaccompaniedMinorNotAllowed').modal(); // Show international popup error
				return false;
			}

			// Display child under 5 popup if date of birt is  under five yrs
			if (underFiveYrs && !over15Yrs) {
				$('#childUnder5').modal(); // Show under 5 problem
				childBirthDates = []; // clear the birth dates for them to try again
				childLapOption = [];
				return false;
			}

			// Display unaccompanied minor fee popup
			if ((!underFiveYrs && !over15Yrs) && !minorFeeAccepted) {
				$('#unaccompaniedMinorAccept').modal(); // Show minor Fee Acceptence popup
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
			dateSelects.first().attr("id", prefix + "_month").change(function () { ChildDateChange($(this)); });;
			dateSelects.filter('.day').attr("id", prefix + "_day").change(function () { ChildDateChange($(this)); });
			dateSelects.last().attr("id", prefix + "_year").change(function () { ChildDateChange($(this)); });;
			dateClone.find('label').first().text(childLabel + oneSpace + (i + 1)).attr("for", prefix + "_month");

			// Setup radio buttons
			var lapOption = dateClone.find('.lap_child').first(),
				//lapRadios = lapOption.find("input"),
				lapLabels = lapOption.find("label");

			var seatChildId = prefix + "_seatChild";
			var seatRadio = $("<input type='radio' value='0' >").attr("id", seatChildId);
			//seatRadio.attr("change", "LapChildClick('" + seatChildId + "Class'" + ", '0')");
			lapLabels.first().before(seatRadio);
			seatRadio.prop("defaultChecked", true);
			//lapRadios.first().attr("id", seatChildId).prop("defaultChecked", true);
			lapLabels.first().attr("for", seatChildId);

			var lapChildId = prefix + "_lapChild";
			var lapRadioRadio = $("<input type='radio' value='1' />").attr("id", lapChildId);
			//lapRadioRadio.attr("change", "LapChildClick('" + seatChildId + "Class'" + ", '1')");
			lapLabels.last().before(lapRadioRadio);
			//lapRadios.last().attr("id", lapChildId);
			lapLabels.last().attr("for", lapChildId);

			var lapRadios = lapOption.find("input");
			lapRadios.attr("name", seatChildId);
			/*
			lapRadios.click(function () {
			//alert('click event called');
			//var $this = $(this);
			//$this.prop("defaultChecked", true);
			});
			*/
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
		var isHotelOnly = $("#bookingType").val();
		if (isHotelOnly === "H" || isHotelOnly === "HC") {
			return true;
		} else if (isHotelOnly !== "H" || isHotelOnly !== "HC") {
			$("#childBirthDates").find("p[class='actions']").css("display", "none");
			$("#childBirthDates").modal(); // We can't wait here, so we have to pop this and return false
			$("ul#birthDatesArea li").show();
			return false;
		}
	}
	return true;
};

//International msg for Lap Child decision 1 = display, 0 = none
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

//Show Login popup when redemption checkbox is checked and customer not logged in
function VerifyRedemptionLogin() {
	//debugger;
	if (bookingType() == "F") {
		var $redeemMilesInput = $("#redeemMiles").val();
		var $loginlink = $("#loginlink").val();
		var $memberMileage = $("#memberMileage").val();
		PageModel.issubmitClicked = true;
		if ($redeemMilesInput == "true" && $loginlink != null && !loginDialogClosed) {
			var loginBox = $("#login");
			if (loginBox.length > 0) {
				// Login Modal Dialog
				loginBox.modal({ backdrop: 'static', keyboard: false });
				return false; // We can't wait here, so we have to pop this and return false
			}
		}
	}
	return true;
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
			$multiCityFlightFour.show();
			$('#multiAddFlight').hide();
			break;
	}
}

function AdjustBookingMode() {
	var $hotelSelect = $("#hotelRoomCount"),
		$selectParent = $hotelSelect.closest("li");
	var $oneWayRadio = $("#journeyOneWay"),
		$radioParent = $oneWayRadio.closest("li");
	var $roundTripRadio = $('#journeyRoundTrip');
	var $promoInput = $('#promoCode'),
		$promoParent = $promoInput.parent();
	if (bookingType() == "F") {
		$hotelSelect.disableSelect();
		$selectParent.hide();
		$radioParent.css("visibility", "visible");
		$("ul.flightOnly").show();
	} else {
		if (bookingType() != "FC") {
			$hotelSelect.enableSelect();
			if ($hotelSelect.val() < 1) {
				$hotelSelect.val("1");
			}
			$selectParent.show();
		} else {
			$hotelSelect.disableSelect();
			$selectParent.hide();
		}
		$promoInput.val('');
		if (!EnablePackagePromo) {
			$promoParent.hide();
		}
	}
	//Roundtrip as default
	$roundTripRadio.prop('checked', true);
	$roundTripRadio.trigger('click');
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
	var isFlightOnly = (bookingType() == "F" ? true : false);
	var max = isFlightOnly ? maxPaxF : maxPaxFH;
	var isInternational = isInternationalFlight();
	var adultMax = (max - tmpChildren);
	var minorMax = (max - tmpAdults);

	$('#paxAdults, #paxMinors').children().remove();

	var adultSelect = document.getElementById('paxAdults');
	var adultFrag = document.createDocumentFragment();
	for (var i = 0, j = (max + 1), k = adultLabels.length; i < j; i++) {
		var txt = adultLabels[i];
		var opt = document.createElement("option");
		opt.value = i;
		opt.appendChild(document.createTextNode(txt));
		if (i == tmpAdults) { opt.selected = true; }
		adultFrag.appendChild(opt);
		if (i >= adultMax) { break; }
	}
	adultSelect.appendChild(adultFrag);

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

	if (!isFlightOnly) {
		$('#paxAdults').children('[value="0"]').remove();
		if (tmpAdults == 0) {
			$('#paxAdults').setSelectByValue('1');
		}
	}
	AdjustHotelRooms();

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
					//document.getElementById($(controlID).attr("id")).append($("<option></option>").attr("value", dayElementOption.value).text(dayElementOption.text))
					//$(controlID).append($("<option></option>").attr("value", dayElementOption.value).text(dayElementOption.text)).hide().show();

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
		$("#childBirthDates").find("p[class='actions']").css("display", "block");
	} else {
		$("#childBirthDates").find("p[class='actions']").css("display", "none");
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

function AppendOCIAssr() {
	$.ajax({
		type: "POST",
		url: "AjaxAddOCIAssr.aspx",
		dataType: "json",
		success: function (data) {

			// RetrieveBookingResponseData(data);
		}
	});
}

function RetrieveBookingResponseData(response) {
	if (response.success) {
		if (response.type == "check-in") {
			AppendOCIAssr();
		}
		$("#" + response.type + "-form").submit();
	}
	else {
		unBlockPage();
		$("#" + response.type + "-button").removeAttr('disabled');
		//$("#" + response.type + "-error").html(response.reason);
		$('#namePnrMismatch').modal();
	}
}

function CheckForLoadErrors() {
	var params = GetUrlParams();
	var dest = stationTo();
	if (dest == null || dest == "") {
		dest = 'Unknown';
	}
	if ("error" in params) {
		switch (params["error"]) {
			case "nohotels":
				$("#nohotels").modal();
				break;
			case "noHotelsOnly":
				hotelOnly();
				$("#noHotelsOnly").modal();
				break;
			case "noCars":
				if (bookingType() === "C") {
					carOnly();
				} else if (bookingType() === "FC") {
					flightPlusCar();
				} else if (bookingType() === "FHC") {
					flightPlusHotelPlusCar();
				}
				else if (bookingType() === "FH") {
					flightPlusHotel();
				}
				if (bookingType() !== "FH") {
					$("#noCarsPopup").modal();
				}
				break;
			case "noCarOnly":
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

//hotelOnlyList
function hotelSearchAttach() {
	var hotelOnlyAutoComplete = $("#departCityAutoComplete").autocomplete({
		source: function (request, response) {
			//   var matcher = new RegExp("//" + $.ui.autocomplete.escapeRegex(request.term) + "", "i");
			var hotelJsonFilterBegins = $.grep(hotelOnlyList, function (value) {
				return value.Name.toLowerCase().startsWith(request.term.toLowerCase())
					|| value.Station.toLowerCase() == request.term.toLowerCase();
			});

			var hotelJsonFilter = $.grep(hotelOnlyList, function (value) {
				return value.Name.toLowerCase().contains(request.term.toLowerCase())
					|| value.Station.toLowerCase().contains(request.term.toLowerCase());
			});
			var ajaxFilter = _.union(hotelJsonFilterBegins, hotelJsonFilter);

			var mappedHotelJsonFilter = $.map(ajaxFilter, function (n, i) {
				return n.Name;
			});

			response(mappedHotelJsonFilter);
		},
		delay: 0,
		minLength: 1,
		autoFocus: true,
		select: function (event, ui) {
			var destSelect = $("#destCityCodeSelect");
			var depart = $("#departCityCodeSelect");
			$.each(hotelOnlyList, function (index, value) {
				if (value.Name.toLowerCase() == ui.item.value.toLowerCase()) {
					destSelect.val(value.Station);
					depart.val(value.Station);
					//not need for hotel only AddPseudoHotelcities($(destSelect).attr('id'));
				}
			});
		}
	}).data("ui-autocomplete")._renderItem = function (ul, item) {
		return $("<li></li>").data("item.autocomplete", item)
			.append("<a>" + item.label + "</a>")
			.appendTo(ul);
	};
}

function CarSuccess() {
}
function CarFailure(jqXHR, textStatus, errorThrown) {
	//alert("hi");
}

function OpenFlifoUnavailable() {
	$('#flifoUnavailable').modal();
}

var carSearchArray = [];
function carSearchAttach() {
	//hotelOnlyList
	var carOnlyAutoComplete = $("#departCityAutoComplete").autocomplete({
		source: (function (request, response) {
			$.ajax({
				async: false,
				type: "POST",
				url: "HertzLocationSearch.aspx",
				data: { term: request.term },
				datatype: "json",
				cache: false,
				success: (function (html, textStatus, jqXHR) {
					carSearchArray = html;
					//  var mappedHotelJsonFilter = $.map(html, function (n, i) {
					//      if (n.OagCode.length == 3) {
					//airport
					//         return n.City + ", " + n.Description + "(" + n.OagCode + ")";
					//     } else {
					//         return n.City + ", " + n.Description;
					//     }

					//  });
					response(html);
					$("#bookingType").val("C");
					if (!html.length && bookingType() === "C") { $("#autoCompleteValue").val($("#departCityAutoComplete").val()) };

					// response(mappedHotelJsonFilter);
				}),
				error: CarFailure
			}
			);
		}),
		delay: 300,
		minLength: 3,
		autoFocus: true,
		select: function (event, ui) {
			// var destSelect = $("#destCityCodeSelect");
			// var depart = $("#departCityCodeSelect");
			//  var selectedLocation = _.find(carSearchArray, function (hertzLocation) {
			//      if (hertzLocation.OagCode.length == 3) {
			//          return (hertzLocation.City + ", " + hertzLocation.Description + "(" + hertzLocation.OagCode + ")") == ui.item.value;
			//      } else {
			//          return (hertzLocation.City + ", " + hertzLocation.Description) == ui.item.value;
			//      }
			//  }
			//  );
			var selectedLocation = ui.item;
			$("#departCityAutoComplete").val(selectedLocation.Description);

			//      ui.item.value = selectedLocation.Description;
			$("#autoCompleteValue").val(selectedLocation.OagCode);
			return false;

		}
	}).data("ui-autocomplete")._renderItem = function (ul, item) {
		var cityLine = item.City;

		if (item.CityLocation != null && item.CityLocation.length > 0) {
			cityLine = cityLine + ", " + item.CityLocation;
		}
		if (item.OagCode.length == 3) {
			cityLine = cityLine + " <strong>(" + item.OagCode + ")</strong>";
		}
		return $("<li></li>").data("item.autocomplete", item)
			.append("<a>" + cityLine + "<br>&nbsp;&nbsp;&nbsp;" + item.Description + "</a>")
			.appendTo(ul);
	};
}
try {
	$.extend($.ui.dialog.prototype.options, {
		resizable: false
	});
} catch (ex) { }

function LastNamePrepopulate() {
	$('#checkinLastName').val(UserLastName);
	$('#changeLastName').val(UserLastName);
}

if (IsRezAgent == 'True') {
	if (!Modernizr.input.placeholder) {
		$('input[placeholder]').each(function () {
			var $this = $(this);
			var placeholder = $this.attr('placeholder');
			this.value = placeholder;
			$this.focus(function () {
				if (this.value === placeholder) { this.value = ""; $this.removeClass('placeholder') }
			});
			$this.blur(function () {
				if ($.trim(this.value) === "") { this.value = placeholder; $this.addClass('placeholder') }
			});
			$this.blur();
		});
	}
}

$("a").keydown(function (event) {
	if (event.which == 13) {
		$(this).trigger("click");
	}
});

function ToggleMilesDollars(ele) {
	if (isRedemptionAgent) {
		return;
	}

	var $element = $(ele);
	var $isMiles = $element.data('slider-val') === 'miles';

	$element.addClass('selected');
	$element.siblings().removeClass('selected');

	$('#redeemMiles').val($isMiles);

	if ($isMiles) {
		$('#promoCode').val('');
		$('#promoCodeCollapsible').parent().hide();
	} else {
		$('#promoCodeCollapsible').parent().show();
	}

}

