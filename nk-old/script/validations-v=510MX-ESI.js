/**
*   Requires:
*   - global.js
*/

// TODO: Remove this polyfill!!
// Adding startsWith Method to String Obj
if (!String.prototype["startsWith"]) {
	String.prototype["startsWith"] = function (strVal) {
		return (this.match("^" + strVal) == strVal);
	};
}

function checkLuhn(value) {
	var num = value.replace(/\D/g, ''),
		numLen = num.length,
		parity = numLen % 2;
	var sum = 0;
	for (var i = 0, j = numLen; i < j; i++) {
		var digit = num.charAt(i);
		if (i % 2 == parity) {
			digit = digit * 2;
			if (digit > 9) { digit = digit - 9; }
		}
		sum += parseInt(digit, 10);
	}
	return (sum % 10 == 0);
}

// Expressions
var Regex = {
	//name: /^([a-zA-Z\u00C1\u00C9\u00CD\u00D3\u00DA\u00DC\u00D1\u00E1\u00E9\u00ED\u00F3\u00FA\u00FC\u00F1\u00C0\u00C2\u00C6\u00C8\u00CA\u00CB\u00CE\u00CF\u00D4\u0152\u00D9\u00DB\u0178\u00C7\u00E0\u00E2\u00E6\u00E8\u00EA\u00EB\u00EE\u00EF\u00F4\u0153\u00F9\u00FB\u00FF\u00E7]([\s])?)+$/,
	//name: /^([a-zA-Z\.\-\ \'\u00C1\u00C9\u00CD\u00D3\u00DA\u00DC\u00D1\u00E1\u00E9\u00ED\u00F3\u00FA\u00FC\u00F1\u00C0\u00C2\u00C6\u00C8\u00CA\u00CB\u00CE\u00CF\u00D4\u0152\u00D9\u00DB\u0178\u00C7\u00E0\u00E2\u00E6\u00E8\u00EA\u00EB\u00EE\u00EF\u00F4\u0153\u00F9\u00FB\u00FF\u00E7]([\s])?)+$/,
	name: /^([a-zA-Z\u00C1\u00C9\u00CD\u00D3\u00DA\u00DC\u00D1\u00E1\u00E9\u00ED\u00F3\u00FA\u00FC\u00F1\u00C0\u00C2\u00C6\u00C8\u00CA\u00CB\u00CE\u00CF\u00D4\u0152\u00D9\u00DB\u0178\u00C7\u00E0\u00E2\u00E6\u00E8\u00EA\u00EB\u00EE\u00EF\u00F4\u0153\u00F9\u00FB\u00FF\u00E7]([\'\-\s\.]|[\.][\s])?)+$/,
	passwordAgent: /^\S{8,32}$/,
	//passwordNdfc: /^\S{6,12}$/,
	//passwordChar: /^[0-9a-zA-Z]{6,12}$/,
	passwordNdfc: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*[\.,~])(?!.*\s).{8,16}$/,
	passwordChar: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*[\.,~])(?!.*\s).{8,16}$/,
	//email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/,
	email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.[a-zA-Z]{2,6})+$/,
	email2: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
	creditCard: /^\d{15,16}$/,
	cvv: /^\d{3}$/,
	cvvAmex: /^\d{4}$/,
	addressFromMarch: /^[a-zA-Z\d\s]+$/,
	addressLegacy: /^[0-9a-zA-Z]([0-9a-zA-Z\.\#\-\/\s])*$/,
	address: /^[0-9a-zA-Z]+(?:[0-9a-zA-Z\.\,\#\-\/\s])*$/,
	city: /^[a-zA-Z]([a-zA-Z\.\-]|\s)*$/,
	state: /^[a-zA-Z]$/,
	zipcode: /^([0-9a-zA-Z\-]){4,10}$/,
	passportDocument: /^([0-9a-zA-Z]){2,}$/,
	phone: /^([0-9\.\-\s])*$/,
	confirmationCode: /^[0-9a-zA-Z]{6}$/,
	flightNo: /^([0-9]){1,4}$/,
	alphanumeric: /^[a-zA-Z0-9]+$/
};


function replaceHyphen(value) {
	value = value.replace(/-/g, " ").replace(/\s{2,}/g, ' ');
	return value;
}


// Single Validations
function validateRequired(obj) {
	var type = (obj.nodeName == "INPUT" ? obj.type : obj.nodeName).toLowerCase();
	//console.log("validateRequired() called for type: " + type);
	if (type === "select") {
		return ($.trim(obj.options[obj.selectedIndex].value) != "");
	} else if (type === "text" || type === "password" || type === "textarea") {
		return ($.trim(obj.value) != "");
	} else if (type === "checkbox") {
		return obj.checked;
	} else if (type === "radio") {
		var result = false;
		$(obj)
			.closest('form')
			.find('input[name=' + obj.name + ']:radio')
			.each(function () {
				if (this.checked) {
					result = true;
					return false;
				}
			});
		return result;
	}
	return true;
}

function validateConfirmationCode(obj) {
	return (obj.value != "") ? Regex.confirmationCode.test(obj.value) : true;
}

function validateFlightNo(obj) {
	return (obj.value != "") ? Regex.flightNo.test(obj.value) : true;
}

function validateEmail(obj) {
	return (obj.value != "") ? Regex.email.test(obj.value) : true;
}

function validateDocumentNumber(obj) {
	if (obj.value != "") {
		obj.value = replaceHyphen(obj.value);
		return ($.trim(obj.value).length >= 1 && $.trim(obj.value).length <= 32 && Regex.passportDocument.test(obj.value));
	}
	else {
		if ((typeof spaceCount != 'undefined') && spaceCount > 0) // used in LoginOrContinueRegisterInput.xslt
			return false;
	}
	return true;
}

function validateMaxLength(obj, maxLength) {

	var valMaxLength = (typeof maxLength == "number") ? maxLength : 1000;
	return (obj.value != "") ? ($.trim(obj.value).length <= valMaxLength) : true;
}

function validatePassword(obj) {
	return (obj.value != "") ? Regex.passwordNdfc.test(obj.value) : true;
}

function validatePasswordValue(val) {
	return (val != "") ? Regex.passwordNdfc.test(val) : true;
}

function validatePasswordChar(obj) {
	return (obj.value != "") ? Regex.passwordChar.test(obj.value) : true;
}

function validateMatchingValues(obj, obj2) {
	var value2 = (typeof obj2 == "string" ? $(obj2).first().val() : obj2.value);
	return (obj.value == value2);
}

function validateName(obj) {
	if (obj.value != "") {
		obj.value = replaceHyphen(obj.value);
		return ($.trim(obj.value).length <= 32 && Regex.name.test(obj.value));
	}
	return true;
}

function validateMiddleName(obj) {
	if (obj.value != "") {
		obj.value = replaceHyphen(obj.value);
		return ($.trim(obj.value).length >= 1 && $.trim(obj.value).length <= 32 && Regex.name.test(obj.value));
	}
	else {
		if ((typeof spaceCount != 'undefined') && spaceCount > 0) // used in LoginOrContinueRegisterInput.xslt
			return false;
	}
	return true;
}

function validateFullName(obj) {
	if (obj.value != "") {
		return ($.trim(obj.value).length <= 96 && Regex.name.test(obj.value));
	}
	return true;
}

function validateAddress(obj) {
	if (obj.value != "") {
		return ($.trim(obj.value).length <= 52 && Regex.address.test(obj.value));
	}
	return true;
}
function validateCity(obj) {
	if (obj.value != "") {
		return ($.trim(obj.value).length <= 32 && Regex.city.test(obj.value));
	}
	return true;
}
function validateState(obj) {
	var val = $.trim(obj.value);
	if (val != "") {
		return (val.length <= 3 && Regex.state.test(val));
	}
	return true;
}

function validateZipCode(obj) {
	return (obj.value != "") ? Regex.zipcode.test(obj.value) : true;
}

function validatePhone(obj) {
	var val = $.trim(obj.value);
	if (val != "") {
		return (val.length <= 20 && Regex.phone.test(val));
	}
	return true;
}

// Credit Card Validation
function validateCard(value, len) {
	if (value != "") {
		return (Regex.creditCard.test(value) && String(value).length == len);
	}
	return true;
}
function validateVisa(obj) {
	var val = $.trim(obj.value);
	if (val != "") {
		return (String(val).startsWith("4") && validateCard(val, 16));
	}
	return true;
}
function validateAmex(obj) {
	var val = $.trim(obj.value);
	if (val != "") {
		return ((String(val).startsWith("34") || String(val).startsWith("37")) && validateCard(val, 15));
	}
	return true;
}
function validateMastercard(obj) {
	var val = $.trim(obj.value);
	if (val != "") {
		return ((String(val).startsWith("2") || String(val).startsWith("5")) && validateCard(val, 16));
	}
	return true;
}
function validateDiscover(obj) {
	var val = $.trim(obj.value);
	if (val != "") {
		return (String(val).startsWith("6") && validateCard(val, 16));
	}
	return true;
}

function validateUATP(obj) {
	var val = $.trim(obj.value);
	if (val != "") {
		return (String(val).startsWith("1") && validateCard(val, 15));
	}
	return true;
}

function validateCreditCard(obj) {
	var val = $.trim(obj.value);
	if (val != "") {
		var startsWith = val.substring(0, 1);
		switch (startsWith) {
			case "4":
				return validateVisa(obj);
			case "2":
			case "5":
				return validateMastercard(obj);
			case "6":
				return validateDiscover(obj);
			case "1":
				return validateUATP(obj);
			case "3":
				return validateAmex(obj);
			default:
				return false;
		}
	}
	return true;
}
function validateCreditCardLuhn(obj) {
	var val = $.trim(obj.value);
	if (val != "") {
		return checkLuhn(val);
	}
	return true;
}
function validateCardType(obj, numObj) {
	var val = $.trim(obj.value);
	if (val != "") {
		var cardNum = (typeof numObj == "string" ? $(numObj).first().val() : numObj.value);
		var startsWith = (cardNum ? cardNum.substring(0, 1) : "0");
		switch (startsWith) {
			case "4":
				return (val == "VI" || val == "External:V2");
			case "2":
			case "5":
				return (val == "MC" || val == "External:M2");
			case "6":
				return (val == "DS" || val == "External:D2");
			case "3":
				return (val == "AX" || val == "External:A2");
			case "1":
				return (val == "TP" || val == "External:T2");
			default:
				return false;
		}
	}
	return true;
}

function validateCreditCardAmex(obj) {
	return true;
}


// Security Code Validation
function validateCvv(obj) {
	return (String(obj.value).length == 3 ? Regex.cvv.test(obj.value) : false);
}
function validateCvvAmex(obj) {
	return (String(obj.value).length == 4 ? Regex.cvvAmex.test(obj.value) : false);
}
function validateSecurityCode(obj, numObj) {
	if (obj.value != "") {
		var cardNum = (typeof numObj == "string" ? $(numObj).first().val() : numObj.value);
		var startsWith = (cardNum ? cardNum.substring(0, 1) : "3");
		if (cardNum.length == 15) {
			return validateCvvAmex(obj);
		}
		return validateCvv(obj);
	}
	return true;
}
function validateSecurityCodeByType(obj, typeObj) {
	if (obj.value != "") {
		var typeStr = (typeof typeObj == "string" ? $(typeObj).first().val() : typeObj.value);
		console.log($(typeObj));
		typeStr = (typeStr ? typeStr : "VI");

		if (typeStr == "AX") {
			return validateCvvAmex(obj);
		}
		return validateCvv(obj);
	}
	return true;
}

// Expiration Date Validations
function validateExpDate(monStr, yearStr) {
	var date = new Date(),
		month = (date.getMonth() + 1),
		year = date.getFullYear();
	var expMon = parseInt(monStr, 10);
	var expYear = parseInt(yearStr, 10);
	if (expYear < year) {
		return false;
	} else if (expYear == year && expMon < month) {
		return false;
	}
	return true;
}
function validateExpMonth(monObj, yearObj) {
	var yearNum = (typeof yearObj == "string" ? $(yearObj).first().val() : yearObj.value);
	if (monObj.value != "") {
		return validateExpDate(monObj.value, yearNum);
	}
	return true;
}
function validateExpYear(yearObj, monObj) {
	var monNum = (typeof monObj == "string" ? $(monObj).first().val() : monObj.value);
	if (yearObj.value != "") {
		return validateExpDate(monNum, yearObj.value);
	}
	return true;
}

function validateBirthDate(monObj, dayObj, yearObj) {
	var monthVal = $(monObj).first().val();
	if (monthVal != "") {
		var dayVal = $(dayObj).first().val();
		var yearVal = $(yearObj).first().val();
		//console.log("orig = m: " + monthVal + ", d: " + dayVal + ", y:" + yearVal);

		monthVal = parseInt(monthVal, 10);
		dayVal = parseInt(dayVal, 10);
		yearVal = parseInt(yearVal, 10);
		//console.log("clean = m: " + monthVal + ", d: " + dayVal + ", y:" + yearVal);

		return (DateUtil.isDate(yearVal, monthVal, dayVal) && !DateUtil.isNewerDate(yearVal, monthVal, dayVal));
	}
	return true;
}

function validateFSNumber(obj) {
	var val = obj.value.trim(), numVal = parseInt(val, 10), numLen = numVal.toString().length;
	//return (numLen === val.length && numLen === 9); 
	return (numLen === val.length && numLen > 8);
}

function validateFSLogin(obj) {
	if (!validateEmail(obj)) { // check is all numbers
		return validateFSNumber(obj);
	}
	return true;
}

function validateEmailConditionally(obj) {
	// if all numbers then check for FSNumber
	if (isAllNumbers(obj))
		return true;

	// else check for FSEmail
	return validateEmail(obj);
}

function validateFSNumberConditionally(obj) {
	// if not all numbers then check for FSEmail
	if (!isAllNumbers(obj))
		return true;

	// else check for FSNumber
	return validateFSNumber(obj);
}

function isAllNumbers(obj) {
	var val = obj.value.trim(), numVal = parseInt(val, 10), numLen = numVal.toString().length;
	return !isNaN(numVal) && numLen == val.length;
}

function FSBinCheck(number) {
	/*if (number) {
	if ((number.indexOf('552321') === 0) ||
	(number.indexOf('524049') === 0) ||
	(number.indexOf('5466322378') === 0) ||
	(number.indexOf('5523820067') === 0) ||
	(number.indexOf('5490330779') === 0) ||
	(number.indexOf('5490358222') === 0)
	) {
	return true;
	}
	}
	return false;*/

	if (number && cardBins) {
		for (var i = 0; i <= cardBins.length; i++) {
			if (number.indexOf(cardBins[i]) === 0) {
				return true
			}
		}
	}
	return false;
}

function validateOAVerificationCode(obj, oacode) {
	var isValid = false;
	if (obj.value == oacode) {
		isValid = true;
	}
	return isValid;
}

function validateAlphanumeric(obj) {
	return (obj.value != "") ? Regex.alphanumeric.test(obj.value) : true;
}

//generat Default click
$(document).ready(function () {

    $("button, a, span.checkinbutton, input[name='NeedInsurance']").keydown(function (event) {

		try {
			if (event.which == 13) {
				if ($(this).html() == "" && $(this).parent() != undefined) {
					(this).parent().trigger("click");
				} else {
					$(this).trigger("click");
				}
			}
		}
		catch (exception) {
			console.log(exception);
			//dont break enything
		}
	});
	$("li.dropdown-menu").keydown(function (event) {
		try {
			if (event.which == 40) {
				$('*').find(".main_header nav.support>ul li.logged_in #memberNavigation").removeClass("showMemberNavigation")
				if ($(this).find("ul.sub-menu").is(':visible')) {

					$(this).find("ul.sub-menu li>a:focus").parent().next().children().focus();
				}
				else {
					$(this).find("ul.sub-menu").addClass("showSubMenu");
					$(this).find("ul.sub-menu li a:first").focus();
				}
				event.preventDefault();
			}
			else if (event.which == 38) {
				if ($(this).find("ul.sub-menu").show().length > 0) {
					$(this).find("ul.sub-menu").addClass("showSubMenu");
					$(this).find("ul.sub-menu li>a:focus").parent().prev().children().focus();
				}
				event.preventDefault();
			}
			else if (event.which == 9) {
				if ($('*').find("ul.sub-menu").is(':visible')) {
					$('*').find("ul.sub-menu").removeClass("showSubMenu");
					$(this).children().focus();
				}
			}
			else {
				$('*').find("ul.sub-menu").removeClass("showSubMenu");
				$('*').find(".main_header nav.support>ul li.logged_in #memberNavigation").removeClass("showMemberNavigation")
			}
		}
		catch (exception) {
			console.log(exception);
			//dont break enything
		}
	});

	$(".logged_in span.user_info,#memberNavigation li").keydown(function (event) {
		try {
			if (event.which == 40) {
				$('*').find("ul.sub-menu").removeClass("showSubMenu");
				if (!$('*').find(".main_header nav.support>ul li.logged_in #memberNavigation").is(':visible')) {
					$('*').find(".main_header nav.support>ul li.logged_in #memberNavigation").addClass("showMemberNavigation");
					$("#memberNavigation ul li a:first").attr("tabindex", 0).focus()
				}
				else if ($('*').find(".main_header nav.support>ul li.logged_in #memberNavigation").is(':visible')) {
					$('*').find(".main_header nav.support>ul li.logged_in #memberNavigation").addClass("showMemberNavigation")
					$("#memberNavigation li>a:focus").closest('li').next().children().focus();
				}
			}
			else if (event.which == 38) {
				if ($('*').find(".main_header nav.support>ul li.logged_in #memberNavigation").is(':visible')) {
					$("#memberNavigation li a:focus").closest('li').prev().children('a').focus();
				}
			}
			else if (event.which == 9) {
				var usertabindex = $(".user_info").attr('tabindex');
				$("[tabindex=" + usertabindex + "]").focus();
				$('*').find(".main_header nav.support>ul li.logged_in #memberNavigation").removeClass("showMemberNavigation");
			}
			else {
				$('*').find("ul.sub-menu").removeClass("showSubMenu");
				$('*').find(".main_header nav.support>ul li.logged_in #memberNavigation").removeClass("showMemberNavigation");
			}
		}
		catch (exception) {
			console.log(exception);
			//dont break enything
		}
	});

});




//WCAG Fixes
$(document).ready(function () {
	FixHeadings();
});

$(window).on('load', function () {
	FixTabIndexing();
	AssignTabIndex();
	CheckboxTitle();
	RadiobuttonTitle();
	CheckboxPTitle();
});

//replaced with .on when upgrading jquery
//$(window).load(function () {
//	FixTabIndexing();
//	AssignTabIndex();
//	CheckboxTitle();
//	RadiobuttonTitle();
//	CheckboxPTitle();
// });

//Fix Tab Indexing
function FixTabIndexing() {

	try {
		var i = 1;
		var breakLoop = 0;
		var ids = [];

		$("html").find("*:visible").not('#stage_ad, #contentanc, .hidetabindex,.emptyanchor:empty').each(function () {
			if ($(this).prop("tagName").toLowerCase() == 'a' || $(this).prop("tagName").toLowerCase() == 'input'
				|| $(this).prop("tagName").toLowerCase() == 'select' || $(this).prop("tagName").toLowerCase() == 'body' ||
				$(this).prop("tagName").toLowerCase() == 'button' || $(this).hasClass('addFocus')) {
				//console.log($(this).attr("id"));
				if ($(this).parent("[id*='_Y_1_'].aUnit").length > 0 && breakLoop === 0) {
					var seatArray = 0;
					$("[id*='Y'].aUnit").each(function () {
						var seatNumber = $(this).attr("id").split("_");
						var result = seatNumber[seatNumber.length - 1];
						ids[seatArray++] = result; //this.id
					});
					ids.sort(naturalSorter);
					breakLoop++;
				}
				else if (!$(this).parent("[id*='_Y_1_'].aUnit").length > 0) {
					$(this).attr("tabindex", i);
					i++;
				}
				if (breakLoop === 1) {
					$.each(ids, function (k, val) {
						$("div[id*=" + val + "] a").attr("tabindex", i++);
					});
					breakLoop++;
				}
			}
		});
		if ($("#error_msg_container :visible")) {
			$("#error_msg_container").not(".emptydiv:empty").attr("tabindex", -1);
			$("#error_msg_container").focus();
		}
	} catch (ex) {
	}
}
function AssignTabIndex() {
	var tbIndex = 0;
	if ($("#validateAndTriggerFloatBoxFare :visible")) {
		tbIndex = $("#validateAndTriggerFloatBoxFare").attr("tabindex");
		$("#validateAndTriggerFloatBoxSaver").attr("tabindex", tbIndex);
		$("#validateAndTriggerFloatBoxNine").attr("tabindex", tbIndex);
	}
	if ($("#HotelRoomSelectControl_BookHotelstandard :visible")) {
		tbIndex = $("#HotelRoomSelectControl_BookHotelstandard").attr("tabindex");
		$("#HotelRoomSelectControl_BookHotel9dfc").attr("tabindex", tbIndex);
	}
	if ($("#HotelRoomSelectControl_BookHotelstandard :visible")) {
		tbIndex = $("#HotelRoomSelectControl_BookHotelstandard").attr("tabindex");
		$("#HotelRoomSelectControl_BookHotelsaver").attr("tabindex", tbIndex);
		$("#HotelRoomSelectControl_BookHotel9dfc").attr("tabindex", tbIndex);
	}
}
function naturalSorter(as, bs) {
	var a, b, a1, b1, i = 0, n, L,
		rx = /(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;
	if (as === bs) return 0;
	a = as.toLowerCase().match(rx);
	b = bs.toLowerCase().match(rx);
	L = a.length;
	while (i < L) {
		if (!b[i]) return 1;
		a1 = a[i],
			b1 = b[i++];
		if (a1 !== b1) {
			n = a1 - b1;
			if (!isNaN(n)) return n;
			return a1 > b1 ? 1 : -1;
		}
	}
	return b[i] ? -1 : 0;
}


//Will fix all the heading order as required by WCAG except post render ajax calls : Quick one
function FixHeadings() {
	// Iterate over each element and replace the tag while maintaining attributes
	var loopCount = 0;
	//var tagStartEnd = 1;
	if (!$('body').hasClass("headingFixed")) {
		$('h1,h2,h3,h4,h5,h6').not(".main_header>h1").each(function () {
			if (!$(this).hasClass('hfixed')) {
				var tagStartEnd = 2;
				$(this).parent().find('h1,h2,h3,h4,h5,h6').each(function () {

					if (tagStartEnd == 7)
						tagStartEnd = 2;
					// Create a new element and assign it attributes from the current element

					var newElement = $("<h" + tagStartEnd + " />");
					$.each(this.attributes, function (i, attrib) {
						$(newElement).attr(attrib.name, attrib.value);
					});

					$(newElement).addClass($(this).prop("tagName").toLowerCase());
					$(newElement).addClass("hfixed");

					// Replace the current element with the new one and carry over the contents
					$(this).replaceWith(function () {
						return $(newElement).append($(this).contents());
					});

					tagStartEnd = tagStartEnd + 1;
					loopCount = loopCount + 1;

				});
			}
		});
		$('body').addClass("headingFixed");
	}
}

$("div.customCheckboxWrap").keydown(function (event) {
	if (event.which == 13) {
		$(this).trigger("click");
	}
});

$(".checkinbutton").keydown(function (event) {
	if (event.which == 13) {
		$(this).trigger("click");
	}
});
function CheckboxTitle() {
	$("html").find(".customCheckbox").each(function () {
		if ($(this).prop("tagName").toLowerCase() == 'a') {
			var title = $(this).attr("title");
			if (title.indexOf('checkbox checked') != -1) {
				title = title.replace('checkbox checked', '');
			}
			if (title.indexOf('checkbox unchecked') != -1) {
				title = title.replace('checkbox unchecked', '');
			}
			var titleTrue = title + ' checkbox checked';
			var titleFalse = title + ' checkbox unchecked';

			if ($(this).hasClass("checked")) {
				$(this).attr("title", titleTrue);
				$(this).attr("aria-label", "checked");
			}
			if (!$(this).hasClass("checked")) {
				$(this).attr("title", titleFalse);
				$(this).attr("aria-label", "unchecked");
			}
		}
	});
}
function RadiobuttonTitle() {
	//$("html").find("Div.ExtrasCheckInEdu a").each(function () {
	//	if ($(this).prop("tagName").toLowerCase() == 'a') {
	//		var title = $(this).attr("title");
	//		if (title.indexOf('radiobutton selected') != -1) {
	//			title = title.replace('radiobutton selected', '');
	//		}
	//		if (title.indexOf('radiobutton deselected') != -1) {
	//			title = title.replace('radiobutton deselected', '');
	//		}
	//		var titleTrue = title + ' radiobutton selected';
	//		var titleFalse = title + ' radiobutton deselected ';

	//		if ($(this).hasClass("checkedbutton")) {
	//			$(this).attr("title", titleTrue);
	//			$(this).attr("aria-label", "selected");
	//		}
	//		if ($(this).hasClass("checkinbutton")) {
	//			$(this).attr("title", titleFalse);
	//			$(this).attr("aria-label", "deselected");
	//		}
	//	}
	//});
}
function CheckboxPTitle() {
	$("#useContactInfoToggle, #useContactInfo").find(".tabindexcheckbutt").each(function () {
		if ($(this).prop("tagName").toLowerCase() == 'a') {
			var title = $(this).attr("title");
			if (title.indexOf('checkbox checked') != -1) {
				title = title.replace('checkbox checked', '');
			}
			if (title.indexOf('checkbox unchecked') != -1) {
				title = title.replace('checkbox unchecked', '');
			}
			var titleTrue = title + ' checkbox checked';
			var titleFalse = title + ' checkbox unchecked';

			if ($("#cbCopyContact").is(':checked')) {
				$(this).attr("title", titleTrue);
				$(this).attr("aria-label", "checked");
			}
			if (!$("#cbCopyContact").is(':checked')) {
				$(this).attr("title", titleFalse);
				$(this).attr("aria-label", "unchecked");
			}
		}
	});
}

function travelGuardCheck(errMsg) {
	var travelInsuranceRadio = ($("input[name='TravelInsurance']"));
	//debugger;
	if (typeof travelInsuranceRadio != "undefined" && travelInsuranceRadio.length > 0) {
		// AW 20171208 - only validate Travel Insurance here if in Manage Travel or Check In
		if (typeof IsCheckinPath != "undefined" && IsCheckinPath != null && IsCheckinPath == 'TRUE') {
			var purchasedTravelInsurance = ($("input[name='TravelInsurance']:checked").val());
			if (purchasedTravelInsurance == undefined) {
				var input = $("input[name='TravelInsurance']");
				input.addClass("error");
				showMiscBubble(input, specificErrorBubble, errMsg, 'validateRequiredFields', $('#tg_error_goes_here'));
				return false;
			}
		}
	}
	return true;
}

function showMiscBubble(obj, errorType, msg, dest, altObj) {
	//console.log("showMiscBubble: " + msg);
	//console.log(obj);

	var bubbleHelper = new BubbleHelper("#error_msg_bubble");

	$("div.bubble").remove();
	bubbleHelper.display(obj, msg, null, altObj);
}

