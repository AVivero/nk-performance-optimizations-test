$(function () {
	//set maxLength of CCNumber and SecurityCode textboxes
	setMaxLength();

	if (typeof maxDS != 'undefined')
		$(":input[id*='TextBoxCC__AccountHolderName']").attr("maxLength", maxDS);

	//on the CCType DDL's onchange event, setup minLength/maxLength for CCNumber and SecurityCode textboxes 
	$(":input[id*='DropDownPaymentMethods']").change(function () {
		setMaxLength();
	});

	$(":input[id*='DropDownListPaymentMethodCode']").change(function () {
		setMaxLength();
	});

});

function HidePaymentButton() {
	$('a.PaymentButton').hide();
	$('div.payment-wait').show();
	return true;
}

function CheckTerms(checkbox) {
	if ($(":input[id*='" + checkbox + "']").is(':checked')) {
		return true;
	}
	else {
		if ($('label#spanish').length > 0)
			alert('Usted debe estar de acuerdo con los terminos y condiciones de Spirit Airlines para continuar');
		else
			alert('You must agree to the Spirit Airlines\' terms and conditions to continue');
		$('#' + checkbox).focus();
		return false;
	}
}

function determineCard(number) { 

	if (number.length > 12) {
		// DinersClub
		if (number.length == 14 &&
			number.charAt(0) == '3' &&
			(number.charAt(1) == '0' || number.charAt(1) == '6' || number.charAt(1) == '8')) {
			return "DI";
		}

		// Visa
		if ((number.length == 16 || number.length == 13) && number.charAt(0) == '4') {
			return "VI";
		}

		// MasterCard
		if (number.length == 16 && (number.charAt(0) == '5' || number.charAt(0) == '2')) {
			//if (FSBinCheck(number)) {
			//	return "FM";
			//}
			return "MC";
		}

		// AmericanExpress
		if (number.length == 15 && number.charAt(0) == '3' && (number.charAt(1) == '4' || number.charAt(1) == '7')) {
			return "AX";
		}

		// Discover
		if (number.length == 16 && number.charAt(1) == '0' && number.charAt(2) == '1' && number.charAt(3) == '1') {
			return "DS";
		}

		// UATP
		if (number.length == 15 && number.charAt(0) == '1') {
			return "TP";
		}
	}
	return "";
}

function determineCard_FareClubEnrollment(number) {
	if (number.length > 12) {
		// DinersClub
		if (number.length == 14 &&
			number.charAt(0) == '3' &&
			(number.charAt(1) == '0' || number.charAt(1) == '6' || number.charAt(1) == '8')) {
			return "DI";
		}

		// Visa
		if ((number.length == 16 || number.length == 13) && number.charAt(0) == '4') {
			return "External:V2";
		}

		// MasterCard
		if (number.length == 16 && (number.charAt(0) == '5' || number.charAt(0) == '2')) {
			return "External:M2";
		}

		// AmericanExpress
		if (number.length == 15 && number.charAt(0) == '3' && (number.charAt(1) == '4' || number.charAt(1) == '7')) {
			return "External:A2";
		}

		// Discover
		if (number.length == 16 && number.charAt(1) == '0' && number.charAt(2) == '1' && number.charAt(3) == '1') {
			return "External:D2";
		}
	}
	return "";
}
function setMaxLength() {
    var maxVI = '20';
    var maxMC = '20';
    var maxAX = '26';
    var maxDS = '29';
	var paymentMethodCode = $(":input[id*='DropDownListPaymentMethodCode']");
	if (paymentMethodCode.length) //old way
	{
		var selected = paymentMethodCode.val();
		var accNo = $(":input[id*='TextBoxACCTNO']");
        var verificationCode = $(":input[id*='TextBoxCC__VerificationCode']");       
		if (selected == "ExternalAccount:AX") {
			accNo.attr("minLength", "15");
			accNo.attr("maxLength", "15");
			verificationCode.attr("minLength", "4");
			verificationCode.attr("maxLength", "4");
			verificationCode.attr("required", "true");
		} else if (selected == "ExternalAccount:TP") {
			accNo.attr("minLength", "15");
			accNo.attr("maxLength", "15");
			verificationCode.attr("minLength", "0");
			verificationCode.attr("maxLength", "0");
			verificationCode.attr("required", "false");
		}
		else {
			accNo.attr("minLength", "16");
			accNo.attr("maxLength", "16");
			verificationCode.attr("minLength", "3");
			verificationCode.attr("maxLength", "3");
			verificationCode.attr("required", "true");
		}
	}

	// Changes done for Task # 11727
	//var paymentMethods = $(":input[id*='DropDownPaymentMethods']");
	var paymentMethods = $(":input[id*='CreditCard_DropDownPaymentMethods']");
	// End Changes done for Task # 11727

	if (paymentMethods.length) {
		var accNo = $(":input[id*='TextBoxACCTNO']");
        var verificationCode = $(":input[id*='TextBoxCC__VerificationCode']");
		verificationCode = verificationCode.filter(function (index, item) {
			return !(item.id.indexOf('Dummy') > 0);
        });
		var accHolderName = $(":input[id*='TextBoxCC__AccountHolderName']");
		verificationCode.prop("required", true);
		verificationCode.attr("style", "display: block;");
		if ($("#cardcvv2help").length > 0) {
			$("#cardcvv2help").parent().attr("style", "display: inline;");
		}
		if ($("#secCode").length > 0) {
			$("#secCode").siblings("label").attr("style", "display: inline;");
		}
		if (verificationCode.parent().attr('id') == "secCode") {
			verificationCode.attr("validatekey", "securityCode");
		}
		if (!verificationCode.hasClass("validateField")) {
			verificationCode.addClass("validateField");
		}
		if (paymentMethods.val() == "AX") {
			if (accNo.attr("maxLength") != "15") {
				accNo.attr("minLength", "15");
				accNo.attr("maxLength", "15");
			}
			if (verificationCode.attr("minLength") != "4") {
				verificationCode.attr("minLength", "4");
				verificationCode.attr("maxLength", "4");
				verificationCode.prop("required", true);
			}
		} else if (paymentMethods.val() == "TP") {
			if (accNo.attr("maxLength") != "15") {
				accNo.attr("minLength", "15");
				accNo.attr("maxLength", "15");
			}
			if (verificationCode.attr("minLength") != "0") {
				verificationCode.attr("minLength", "0");
				verificationCode.attr("maxLength", "0");
			}
			verificationCode.prop("required", false);
			verificationCode.removeClass("validateField");
			verificationCode.attr("style", "display: none;");
			$("div.bubble").remove();
			$("#cardcvv2help").parent().attr("style", "display: none;");
			$("#secCode").siblings("label").attr("style", "display: none;");
			if (verificationCode.parent().attr('id') == "secCode") {
				verificationCode.attr("validatekey", "");
				verificationCode.prop("validatekey", false);
			}
		}
		else {
			var code = verificationCode.val();
			if (code != null && code.length > 3)
				verificationCode.val(code.substring(0, 3));

			if (accNo.attr("maxLength") != "16") {
				accNo.attr("minLength", "16");
				accNo.attr("maxLength", "16");
			}
			if (verificationCode.attr("minLength") != "3") {
				verificationCode.attr("minLength", "3");
				verificationCode.attr("maxLength", "3");
				verificationCode.prop("required", true);
			}            
		}
		//debugger;
		switch (paymentMethods.val()) {
			case "AX":
				if (accHolderName.attr("maxLength") != maxAX) {
					if (accHolderName.val().length > maxAX) accHolderName.val("");
					accHolderName.attr("maxLength", maxAX);
				}
				break;
			case "VI":
				if (accHolderName.attr("maxLength") != maxVI) {
					if (accHolderName.val().length > maxVI) accHolderName.val("");
					accHolderName.attr("maxLength", maxVI);
				}
				break;
			case "MC":
				if (accHolderName.attr("maxLength") != maxMC) {
					if (accHolderName.val().length > maxMC) accHolderName.val("");
					accHolderName.attr("maxLength", maxMC);
				}
				break;
			default:
				if (accHolderName.attr("maxLength") != maxDS) {
					if (accHolderName.val().length > maxDS) accHolderName.val("");
					accHolderName.attr("maxLength", maxDS);
				}
				break;
		}
	}

	if (typeof accNo !== "undefined") {
		accNo.attr("minLength", "16");
		accNo.attr("maxLength", "16");
	}
}

function selectCreditCardType(ccType, value) {
	if (ccType.length > 0) $("#creditCardTypeDDL select").val(ccType);
}


function CopyBillingInfo() {
	var name = "";
	var address1 = "";
	var city = "";
	var state = "";
	var zipcode = "";
	var country = "";
	var prefix = "";

	//copy name into PaymentInput control
	prefix = ":input[id*='ContactInputControl_TextBox";
	fullname = $(prefix + "FirstName']").val() + ' ' + $(prefix + "LastName']").val();

	address1 = $(prefix + "AddressLine1']").val();
	city = $(prefix + "City']").val();
	zipcode = $(prefix + "PostalCode']").val();

	prefix = ":input[id*='ContactInputControl_DropDownList";
	state = $(prefix + "StateProvince']").val();
	var aState = state.split('|');
	state = aState[aState.length - 1];
	country = $(prefix + "Country']").val();

	//copy fields into Billing control
	prefix = ":input[id*='PaymentInputControl_";
	$(prefix + "TextBoxCC__AccountHolderName']").val(fullname);
	$(prefix + "TextBoxAvs__Address1']").val(address1);
	$(prefix + "TextBoxAvs__City']").val(city);
	$(prefix + "TextBoxAvs__StateOrProvince']").val(state);
	$(prefix + "TextBoxAvs__PostalCode']").val(zipcode);
	$(prefix + "TextBoxAvs__Country']").val(country);

	return true;
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
		sum += parseInt(digit);
	}
	return (sum % 10 == 0);
};


$(window).on('load',function () {
	//BOA Instant Credit prepopulate fields - if needed
	if (typeof enableInstantCredit !== "undefined" && enableInstantCredit && typeof instantCreditCard !== "undefined") {
		prepopulateMyResInstantCreditFields();
	}
});