var maxVI = '20';
var maxMC = '20';
var maxAX = '26';
var maxDS = '29';

$(function () {

	$(":input[id*=DropDownListBirthDateYear]").change(DOB_Adjust_Days);
	$(":input[id*=DropDownListBirthDateMonth]").change(DOB_Adjust_Days);

	//set maxLength of CCNumber and SecurityCode textboxes
	setMaxLength();

	if (typeof maxDS != 'undefined')
		$(":input[id*='_tbFullName']").attr("maxLength", maxDS);

	//on the CCType DDL's onchange event, setup minLength/maxLength for CCNumber and SecurityCode textboxes 
	$(":input[id*='ddlCreditCardTypes']").change(function () {
		setMaxLength();
	});

	$('#StaticFareClubEnrollmentInputControl_tbCreditCardNumber').blur(function (event) { changePayment(event, this.value); });
	$('#StaticFareClubEnrollmentInputControl_tbCreditCardNumber').change(function (event) { changePayment(event, this.value); });
});

function daysInMonth(iMonth, iYear) {
	return 32 - new Date(iYear, iMonth, 32).getDate();
}

function DOB_Adjust_Days(object) {
	DOB_month = $(":input[id*=DropDownListBirthDateMonth]").val();
	DOB_year = $(":input[id*=DropDownListBirthDateYear]").val();
	DOB_days = daysInMonth(DOB_month - 1, DOB_year);
	DOB_days_length = $(":input[id*=DropDownListBirthDateDay]")[0].length;
	if (DOB_days_length > (DOB_days + 1)) {
		for (var i = DOB_days_length; i > DOB_days; i--) {
			$(":input[id*=DropDownListBirthDateDay]")[0].remove(i);
		}
	}
	else if (DOB_days_length < (DOB_days + 1)) {
		for (var i = DOB_days_length; i <= DOB_days; i++) {
			var elOptNew = document.createElement('option');
			elOptNew.text = i;
			elOptNew.value = i;
			var elSel = $(":input[id*=DropDownListBirthDateDay]")[0];
			try {
				elSel.add(elOptNew, null); // standards compliant; doesn't work in IE
			}
			catch (ex) {

				try {
					elSel.add(elOptNew); //work in IE only
				}
				catch (e) {
					var opt = elSel.options;
					opt[opt.length] = new Option(i, i);
				}
			}
		}
	}
}

function changePayment(event, value) {

	$('#StaticFareClubEnrollmentInputControl_ddlCreditCardTypes').val(determineCard_FareClubEnrollment(value));
	setMaxLength();
}

function HidePaymentButton(obj) {
	$(obj).hide();
	$('span.payment-wait').show();
	return true;
}


function CheckTerms(checkbox) {
	if ($(":input[id*='" + checkbox + "']").is(':checked')) {
		return true;
	}
	else {
		//if ($('label#spanish').length > 0)
		//    alert('Usted debe estar de acuerdo con los terminos y condiciones para inscribirse.');
		//else
		alert('You must agree to the $9 Fare Club\'s terms and conditions to continue. \n\n Usted debe estar de acuerdo con los terminos y condiciones para inscribirse.');
		$('#' + checkbox).focus();
		return false;
	}
}

function CompareCCAndProfileName(pfirstname, plastname, ccfirstname, cclastname) {
	//debugger;
	//alert($(":input[id*='" + pfirstname + "']").val());
	if ($(":input[id*='" + pfirstname + "']").val() != null && $(":input[id*='" + plastname + "']").val() != null) {
		if ($(":input[id*='" + pfirstname + "']").val() == $(":input[id*='" + ccfirstname + "']").val() && $(":input[id*='" + plastname + "']").val() == $(":input[id*='" + cclastname + "']").val()) {
			return true;
		}
		else {
			//if ($('label#spanish').length > 0)
			//alert('Para poder crear esta cuenta, el Nombre y el Apellido de la cuenta deben ser id?nticos al Nombre y Apellido que aparecen en la tarjeta de cr?dito bajo la secci?n Informaci?n de Cobro/Contacto. Por favor modifique la informaci?n ingresada e intente de nuevo.');
			//else
			alert('The First Name and Last Name under the Account Setup must exactly match the First Name and Last Name of the Billing Information in order to create this account. Please modify the information you entered and try again. \n\n Para poder crear esta cuenta, el Nombre y el Apellido de la cuenta deben ser identicos al Nombre y Apellido que aparecen en la tarjeta de credito bajo la seccion Informacion de Cobro/Contacto. Por favor modifique la informacion ingresada e intente de nuevo.');
			$('#' + ccfirstname).focus();
			return false;
		}
	}
	else
		return true;
}

//Copy contact info. from FreeSpiritEnrollmentInput to StaticFareClubEnrollment
function copyFreeSpiritDataToFareClubInput() {
	//debugger;
	if (isLoggedFSMember == 'True') {
		if (fsTitle != undefined && fsTitle != '') {
			$(":input[id*='DDLTitle']").parent().attr("class", "hidden");
			$(":input[id*='DDLTitle']").parent().before("<div>" + fsTitle + '</div>');
		}
		$(":input[id*='DDLTitle']").val(fsTitle);
		if (fsFirstName != undefined && fsFirstName != '') {
			$(":input[id*='TextBoxFirstName']").parent().attr("class", "hidden");
			$(":input[id*='TextBoxFirstName']").parent().before("<div>" + fsFirstName + '</>');
		}

		$(":input[id*='TextBoxFirstName']").val(fsFirstName);
		$(":input[id*='TextBoxMiddleName']").val(fsMiddleName);
		if (fsLastName != undefined && fsLastName != '') {
			$(":input[id*='TextBoxLastName']").parent().attr("class", "hidden");
			$(":input[id*='TextBoxLastName']").parent().before("<div>" + fsLastName + '</div>');
		}

		$(":input[id*='TextBoxLastName']").val(fsLastName);
		$(":input[id*='DDLSuffix']").val(fsSuffix);
		$(":input[id*='DropDownListBirthDateMonth']").val(fsDOBMonth);
		$(":input[id*='DropDownListBirthDateDay']").val(fsDOBDay);
		$(":input[id*='DropDownListBirthDateYear']").val(fsDOBYear);
		if (fsDOBMonth != undefined && fsDOBMonth != '' && fsDOBDay != undefined && fsDOBDay != '' && fsDOBYear != undefined && fsDOBYear != '') {
			//$(":input[id*='DropDownListBirthDateMonth']").parent().attr("class", "hidden");
			//$(":input[id*='DropDownListBirthDateMonth']").parent().before("<div>" + $("select[id*='DropDownListBirthDateMonth'] option[value=" + fsDOBMonth + "]").text() + " " + fsDOBDay + ',' + fsDOBYear + '</div>');

			var birthdayText = $("select[id*='DropDownListBirthDateMonth'] option[value=" + fsDOBMonth + "]").text() + " " + fsDOBDay + ',' + fsDOBYear;
			$('#fs_birthdate').html('<div class="col-sm-12">' + birthdayText + '</div>');

			var input = $('#StaticFareClubEnrollmentInputControl_chbTermsAndConditions').detach();
			var label = $('label[for="StaticFareClubEnrollmentInputControl_chbTermsAndConditions"]').detach();
            input.attr('onkeydown', 'ValidationRequiredOnEnter(event)');

			$('div.same_as_billing.checkbox').empty();
			$('div.same_as_billing.checkbox').append(input);
			$('div.same_as_billing.checkbox').append(label);
		}


		$(":input[id*='TextBoxAddress1']").val(fsAddress1);
		$(":input[id*='TextBoxAddress2']").val(fsAddress2);
		$(":input[id*='TextBoxCity']").val(fsCity);
		$(":input[id*='TextBoxZipcode']").val(fsZip);
		$(":input[id*='DDLCountry']").val(fsCountry);
		$(":input[id*='DDLCountry']").change();
		var states = $(":input[id*='DDLState']");
		if (states != null && states.length > 0) {
			if (states[0].options.length == 0) {
				$(":input[id*='TextBoxState']").val(fsState);
			}
			else {
				$(":input[id*='DDLState']").val(fsState);
			}
		}
		$(":input[id*='TextBoxHomePhone']").val(fsHomePhone);
		$(":input[id*='tbPhoneNumber']").val(fsHomePhone);
		$(":input[id*='TextBoxWorkPhone']").val(fsWorkPhone);
		$(":input[id*='TextBoxEmailAddress']").val(fsEmail);
		$(":input[id*='TextBoxConfirmEmail']").val(fsEmail);

		buildFullName();
	}
	//    else
	//    {    
	//        if ($(":input[id*='CheckBoxCopyFreeSpiritInfo']").is(':checked')) {
	//            $(":input[id*='tbPhoneNumber']").val($(":input[id*='TextBoxHomePhone']").val());
	//            $(":input[id*='tbFirstName']").val($(":input[id*='TextBoxFirstName']").val());
	//            $(":input[id*='tbLastName']").val($(":input[id*='TextBoxLastName']").val());        
	//            $(":input[id*='tbAddress1']").val($(":input[id*='TextBoxAddress1']").val());
	//            $(":input[id*='tbAddress2']").val($(":input[id*='TextBoxAddress2']").val());
	//            $(":input[id*='tbCity']").val($(":input[id*='TextBoxCity']").val());
	//            $(":input[id*='tbPostalCode']").val($(":input[id*='TextBoxZipcode']").val());
	//            $(":input[id*='ddlCountries']").val($(":input[id*='DDLCountry']").val());
	//            $(":input[id*='ddlCountries']").change();
	//            //            updateStateWith(":input[id*='ddlCountries']");
	//            var states = $(":input[id*='ddlStates']");
	//            if (states != null && states.length>0) {
	//                if (states[0].options.length == 0) {
	//                    $(":input[id*='tbState']").val($(":input[id*='TextBoxState']").val());
	//                }
	//                else {
	//                    $(":input[id*='ddlStates']").val($(":input[id*='DDLState']").val());
	//                }
	//            }
	//        }
	//    }

	return true;
}

function copyApplicantCredentials() {
	if ($(":input[id*='TextBoxFirstName']").val() != null) {
		$(":input[id*='txtFirstName']").val($(":input[id*='TextBoxFirstName']").val());
		$(":input[id*='txtMiddleName']").val($(":input[id*='TextBoxMidddleName']").val());
		$(":input[id*='txtLastName']").val($(":input[id*='TextBoxLastName']").val());
		$(":input[id*='txtEmail']").val($(":input[id*='TextBoxEmailAddress']").val());
		$(":input[id*='txtConfirmEmail']").val($(":input[id*='TextBoxConfirmEmail']").val());
	}

	return true;
}

function setMaxLength() {
	if ($(":input[id*='ddlCreditCardTypes']").length) {
		var accNo = $(":input[id*='tbCreditCardNumber']");
		var verificationCode = $(":input[id*='tbSecurityCode']");

		if ($(":input[id*='ddlCreditCardTypes']").val() == "External:A2") {
			if (accNo.attr("maxLength") != "15") {
				accNo.attr("minLength", "15");
				accNo.attr("maxLength", "15");
			}
			if (verificationCode.attr("minLength") != "4") {
				verificationCode.attr("minLength", "4");
				verificationCode.attr("maxLength", "4");
				verificationCode.attr("required", "true");
			}
		} else {
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
				verificationCode.attr("required", "true");
			}
		}

		var accHolderName = $(":input[id*='_tbFullName']");

		switch ($(":input[id*='ddlCreditCardTypes']").val()) {
			case "External:A2":
				if (accHolderName.attr("maxLength") != maxAX) {
					if (accHolderName.val().length > maxAX) accHolderName.val("");
					accHolderName.attr("maxLength", maxAX);
				}
				break;
			case "External:V2":
				if (accHolderName.attr("maxLength") != maxVI) {
					if (accHolderName.val().length > maxVI) accHolderName.val("");
					accHolderName.attr("maxLength", maxVI);
				}
				break;
			case "External:M2":
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

function copyFSBillingInfoInput() {
	//debugger;
	if (isLoggedFSMember == 'True') {
		$(":input[id*='tbFirstName']").val(fsFirstName);
		$(":input[id*='tbMiddleName']").val(fsMiddleName);
		$(":input[id*='tbLastName']").val(fsLastName);
		$(":input[id*='tbAddress1']").val(fsAddress1);
		$(":input[id*='tbAddress2']").val(fsAddress2);
		$(":input[id*='tbCity']").val(fsCity);
		$(":input[id*='tbPostalCode']").val(fsZip);
		$(":input[id*='ddlCountries']").val(fsCountry);
		$(":input[id*='ddlCountries']").change();
		//        updateStateWith(":input[id*='ddlCountries']");
		if ($(":input[id*='ddlStates']")[0].options.length == 0) {
			$(":input[id*='tbState']").val(fsState);
		}
		else {
			$(":input[id*='ddlStates']").val(fsState);
		}

		$(":input[id*='tbPhoneNumber']").val($(":input[id*='TextBoxHomePhone']").val());
	}
	//    else {
	//        // static fare club control data source

	//        if ($(":input[id*='TextBoxAddress1']").val() == "") {
	//            $(":input[id*='TextBoxAddress1']").val($(":input[id*='tbAddress1']").val());
	//        }

	//        if ($(":input[id*='TextBoxAddress2']").val() == "") {
	//            $(":input[id*='TextBoxAddress2']").val($(":input[id*='tbAddress2']").val());
	//        }

	//        if ($(":input[id*='TextBoxCity']").val() == "") {
	//            $(":input[id*='TextBoxCity']").val($(":input[id*='tbCity']").val());
	//        }

	//        if ($(":input[id*='TextBoxZipcode']").val() == "") {
	//            $(":input[id*='TextBoxZipcode']").val($(":input[id*='tbPostalCode']").val());
	//        }

	//        if ($(":input[id*='DDLCountry']").val() == "") {
	//            $(":input[id*='DDLCountry']").val($(":input[id*='ddlCountries']").val());
	//        }

	//        $(":input[id*='DDLCountry']").change();
	//        //        updateStateWith(":input[id*='ddlCountries']");
	//        if ($(":input[id*='ddlState']")[0].options.length == 0) {
	//            $(":input[id*='TextBoxState']").val($(":input[id*='tbState']").val());
	//        }
	//        else {
	//            $(":input[id*='ddlState']").val($(":input[id*='DDLStates']").val());
	//        }

	//  }    

	return true;
}

function zipToFalse() {
	$("#StaticFareClubEnrollmentInputControl_tbPostalCode").removeAttr("required");
	return true;
}

function validateForm(obj) {
	// fill hidden fields required to process for already logged in
	if ($(":input[id*='TextBoxFirstName']").val() == undefined) {
		$(":input[id*='tbFirstName']").val(fsFirstName);
	}
	else {
		$(":input[id*='tbFirstName']").val($(":input[id*='TextBoxFirstName']").val());
	};

	if ($(":input[id*='TextBoxLastName']").val() == undefined) {
		$(":input[id*='tbLastName']").val(fsLastName);
	}
	else {
		$(":input[id*='tbLastName']").val($(":input[id*='TextBoxLastName']").val());
	};


	if ($('#chbSameBillAddress').is(':checked')) {
		copyToBillingAddress();
	}

	if (EnrollmentValidator.processForm(obj)) {
		HidePaymentButton(obj);
		__doPostBack('StaticFareClubEnrollmentInputControl$LinkButtonSubmit', '');
		return true;
	}
	return false;
}

function populateMailListData() {
	var enrollPrefix = "#StaticFareClubEnrollmentInputControl_StaticFareClubEnrollmentFreeSpiritEnrollmentInputControl_";
	var emailPrefix = "#StaticFareClubEnrollmentInputControl_StaticFareClubEnrollmentEMailNotifyControl_";

	var firstName = $(enrollPrefix + 'TextBoxFirstName').val();
	var lastName = $(enrollPrefix + 'TextBoxLastName').val();
	var email = $(enrollPrefix + 'TextBoxEmailAddress').val();
	var airportHomeDDL = $(enrollPrefix + 'ddHomeAirport');
	var airportSecondaryDDL = $(enrollPrefix + 'ddSecondaryAirport');
	var airportHome = '';
	var airportSecondary = '';


	if (airportHomeDDL.length > 0) {
		airportHome = airportHomeDDL[0].value;
	}
	if (airportSecondaryDDL.length > 0) {
		airportSecondary = airportSecondaryDDL[0].value;
	}

	$(emailPrefix + 'txtFirstName').val(firstName);
	$(emailPrefix + 'txtLastName').val(lastName);
	$(emailPrefix + 'txtEmail').val(email);
	$(emailPrefix + 'txtConfirmEmail').val(email);
	$('select#' + emailPrefix + 'ddHomeAirport').val(airportHome);
	$('select#' + emailPrefix + 'ddSecondaryAirport').val(airportSecondary);
	$(emailPrefix + 'chkSpecialOffer').attr('checked', true);

	return true;
}

function ValidationRequiredOnEnter(e) {
	var e = window.event || e;
	if (e.keyCode == 13) {
		$("#" + linkButton).click();
	}
}


// tabs click functionality FREE Spirit REdesign

function validatebutton(obj) {

	if ($("#error_msg_container").css("display") == 'block')
	{
		$("#error_msg_container").css("display", "none");
	}
		

	var activetab = $('.active').attr('rel');
	var validate = false;
	if (activetab != undefined) {
		if (activetab == 'account-information') {
			validate = ValidateAccountSection(obj);
		}

		if (activetab == 'contact-information') {
			validate = ValidateContactSection(obj);
		}

		if (activetab == 'billing-information') {
			validate = ValidateBillingSection(obj);
		}
	}



	return validate;
}


function validatesignup(obj) {
	// fill hidden fields required to process for already logged in
	if ($(":input[id*='TextBoxFirstName']").val() == undefined) {
		$(":input[id*='tbFirstName']").val(fsFirstName);
	}
	else {
		$(":input[id*='tbFirstName']").val($(":input[id*='TextBoxFirstName']").val());
	};

	if ($(":input[id*='TextBoxLastName']").val() == undefined) {
		$(":input[id*='tbLastName']").val(fsLastName);
	}
	else {
		$(":input[id*='tbLastName']").val($(":input[id*='TextBoxLastName']").val());
	};


	if ($('#chbSameBillAddress').is(':checked')) {
		copyToBillingAddress();
	}
	var validate = this.validatebutton(obj) && AccountInfoValidator.ValidateOnly(obj) && ContactInfoValidator.ValidateOnly(obj) && BillingInfoValidator.ValidateOnly(obj);
	if (validate) {
		HidePaymentButton(obj);
		populateMailListData();
		//__doPostBack('StaticFareClubEnrollmentInputControl$LinkButtonSubmit', '');
		return true;
	}
	return false;
}


function ValidateAccountSection(sender) {
	if (AccountInfoValidator.ValidateOnly(sender)) {
		$('li[rel="account-information"]').removeClass('active');
		$('li[rel="account-information"]').removeClass('nonactive');
		$('li[rel="account-information"]').addClass('disabled');
		$('li[rel="billing-information"]').removeClass('active');
		$('li[rel="billing-information"]').removeClass('disabled');
		$('li[rel="billing-information"]').addClass('nonactive');
		$('li[rel="contact-information"]').removeClass('nonactive');
		$('li[rel="contact-information"]').removeClass('disabled');
		$('li[rel="contact-information"]').addClass('active');
		$('#account-information').addClass('hidden');
		$('#billing-information').addClass('hidden');
		$('#contact-information').removeClass('hidden');
		$('#nextstep2').removeClass('hidden');
		$('#nextstep, #Singnup').addClass('hidden');
		return true;
	}
	else {
		AccountInfoValidator.processForm(sender);
		return false;
	}

};
function ValidationRequiredOnEnter(e) {
	var e = window.event || e;
	if (e.keyCode == 13) {
		$("#" + linkButton).click();
	}
}

function accountInfoClicked(obj) {
	$('li[rel="contact-information"]').removeClass('active');
	$('li[rel="contact-information"]').removeClass('disabled');
	$('li[rel="contact-information"]').addClass('nonactive');
	$('li[rel="billing-information"]').removeClass('active');
	$('li[rel="billing-information"]').removeClass('disabled');
	$('li[rel="billing-information"]').addClass('nonactive');
	$('li[rel="account-information"]').removeClass('disabled');
	$('li[rel="account-information"]').removeClass('nonactive');
	$('li[rel="account-information"]').addClass('active');
	$('#contact-information').addClass('hidden');
	$('#billing-information').addClass('hidden');
	$('#account-information').removeClass('hidden');
	$('#nextstep').removeClass('hidden');
	$('#Singnup,#nextstep2').addClass('hidden');
	ContactInfoValidator.clearBubble(this);
};

function contactInfoClicked(obj) {
	ValidateAccountSection(obj);
};

function billingInfoClicked(obj) {
	var validateacc = ValidateAccountSection(obj);
	if (validateacc)
		ValidateContactSection(obj);
};

function ValidateContactSection(sender) {
	if (ContactInfoValidator.ValidateOnly(sender)) {

		$('li[rel="contact-information"]').removeClass('active');
		$('li[rel="contact-information"]').addClass('disabled');
		$('li[rel="account-information"]').removeClass('active');
		$('li[rel="account-information"]').addClass('disabled').addClass('nonactive');
		$('li[rel="billing-information"]').addClass('active');
		$('#contact-information').addClass('hidden');
		$('#account-information').addClass('hidden');
		$('#billing-information').removeClass('hidden');
		$('#nextstep, #nextstep2').addClass('hidden');
		$('#Singnup').removeClass('hidden');

		return true;
	}
	else {

		if (AccountInfoValidator.ValidateOnly(sender)) {
			var activetab = $('.active').attr('rel');
			if (activetab == 'account-information') {
				$('li[rel="account-information"]').removeClass('nonactive');
				$('li[rel="account-information"]').removeClass('active');
				$('li[rel="account-information"]').addClass('disabled');
				$('li[rel="contact-information"]').removeClass('nonactive');
				$('li[rel="contact-information"]').removeClass('disabled');
				$('li[rel="contact-information"]').addClass('active');
				$('li[rel="billing-information"]').removeClass('nonactive');
				$('li[rel="billing-information"]').removeClass('active');
				$('li[rel="billing-information"]').addClass('active');
				$('#contact-information').addClass('hidden');
				$('#account-information').addClass('hidden');
				$('#billing-information').removeClass('hidden');
				$('#nextstep').addClass('hidden');
				$('#Singnup').removeClass('hidden');

			}
			ContactInfoValidator.processForm(sender);
			return false;
		}
	}
}

function ValidateBillingSection(sender) {
	if (BillingInfoValidator.ValidateOnly(sender)) {

		$('li[rel="contact-information"]').removeClass('active');
		$('li[rel="contact-information"]').addClass('disabled');
		$('li[rel="account-information"]').removeClass('active');
		$('li[rel="account-information"]').addClass('disabled');
		$('li[rel="billing-information"]').addClass('active');
		$('#contact-information').addClass('hidden');
		$('#account-information').addClass('hidden');
		$('#billing-information').removeClass('hidden');
		$('#nextstep').addClass('hidden');
		$('#Singnup').removeClass('hidden');

		return true;
	}
	else {

		BillingInfoValidator.processForm(sender);
		return false;

	}
}

this.randomtip = function () {

	var pause = 10000; // define the pause for each tip (in milliseconds) 
	var length = $("#fade li").length;
	var temp = -1;

	this.getRan = function () {
		// get the random number
		var ran = Math.floor(Math.random() * length) + 1;
		return ran;
	};
	this.show = function () {
		var ran = getRan();
		// to avoid repeating
		while (ran == temp) {
			ran = getRan();
		}
		temp = ran;
		$("#fade li").hide();
		$("#fade li:nth-child(" + ran + ")").fadeIn("fast");
	};
	if (length != undefined && length > 0) {
		show(); setInterval(show, pause);
	}

};

function populateSelectBoxValue() {
	//populate country and state
	$DDLState = $("#Default_DDLState");
	$DDLCountry = $("#Default_DDLCountry");
	if ($.trim($DDLCountry.val()) != "") {
		$(".countryelement").each(function () {
			$(this).children("option[value=" + "'" + $.trim($DDLCountry.val()) + "'" + "]").attr("selected", true);
		});
		$(".stateelement").each(function () {
			if ($.trim($DDLCountry.val()) == "US") {
				$(this).hide();
				if ($(this).hasClass("state")) {
					$(this).show();
					if ($.trim($DDLState.val()) != "") {
						$(this).children("option[value=" + "'" + $.trim($DDLState.val()) + "'" + "]").attr("selected", true);
					}
				}
			} else {
				$(this).hide();
				if ($(this).hasClass("text")) {
					$(this).show();
					if ($.trim($DDLState.val()) != "") {
						$(this).val($.trim($DDLState.val()));
					}
				}
			}
		});
	}
};

function StaticFareClubSecurityCVVPopup() {
	$('#FareClubsecuritycode').modal();
}

$(document).ready(function () {
	randomtip();
	$(".terms_conditions_check").on('click', ".field_chkbx", function () {
		$('div.error_msg_bubble, div.bubble').hide();
	});

	if (currentCulture == 'es-PR')
		$('#ConfirmPasswordLabel').attr('class', 'ConfirmPasswordLabel');
});
$(window).on('load', function () {
	var tbIndx = $("#nextstep").attr("tabindex");
	$("#nextstep2").attr("tabindex", tbIndx);
	$("#StaticFareClubEnrollmentInputControl_LinkButtonSubmit").attr("tabindex", tbIndx);
	$("#nextstep").keydown(function (event) {
		var keyCode = (event.keyCode ? event.keyCode : event.which);
		if (keyCode == 13) {
			$(this).click();
		}
	});
	$("#nextstep").click(function () {
		$("html").find("#contact-information a, input, select").each(function () {
			if ($(this).prop("tagName").toLowerCase() == 'a' || $(this).prop("tagName").toLowerCase() == 'input' || $(this).prop("tagName").toLowerCase() == 'select') {
				$(this).attr("tabindex", tbIndx);
			}
		});
		$("#StaticFareClubEnrollmentInputControl_StaticFareClubEnrollmentFreeSpiritEnrollmentInputControl_TextBoxAddress1").focus();
	});
	$("a.contact_information").keydown(function (event) {
		var keyCode = (event.keyCode ? event.keyCode : event.which);
		if (keyCode == 13) {
			$(this).click();
		}
	});
	$("a.contact_information").click(function () {
		$("html").find("#contact-information a, input, select").each(function () {
			if ($(this).prop("tagName").toLowerCase() == 'a' || $(this).prop("tagName").toLowerCase() == 'input' || $(this).prop("tagName").toLowerCase() == 'select') {
				$(this).attr("tabindex", tbIndx);
			}
		});
		$("#StaticFareClubEnrollmentInputControl_StaticFareClubEnrollmentFreeSpiritEnrollmentInputControl_TextBoxAddress1").focus();
	});
	$("#nextstep2").keydown(function (event) {
		var keyCode = (event.keyCode ? event.keyCode : event.which);
		if (keyCode == 13) {
			$(this).click();
		}
	});
	$("#nextstep2").click(function () {
		$("html").find("#billing-information a, input, select").not("a:empty").each(function () {
			if ($(this).prop("tagName").toLowerCase() == 'a' || $(this).prop("tagName").toLowerCase() == 'input' || $(this).prop("tagName").toLowerCase() == 'select') {
				$(this).attr("tabindex", tbIndx);
				$("#chkbx_chbSameBillAddress").attr("tabindex", tbIndx);
				$("#chkbx_StaticFareClubEnrollmentInputControl_chbTermsAndConditions").attr("tabindex", tbIndx);
			}
		});
		$("#StaticFareClubEnrollmentInputControl_tbCreditCardNumber").focus();
		$("span.field_chkbx").keydown(function (event) {
			var keyCode = (event.keyCode ? event.keyCode : event.which);
			if (keyCode == 13) {
				$(this).click();
				return false;
			}
		});
	});
	$("a.Billing_information").unbind("keydown");
	$("a.Billing_information").keydown(function (event) {
		var keyCode = (event.keyCode ? event.keyCode : event.which);
		if (keyCode == 13) {
			$(this).click();
		}
	});
	$("a.Billing_information").click(function () {
		$("html").find("#billing-information a, input, select").not("a:empty").each(function () {
			if ($(this).prop("tagName").toLowerCase() == 'a' || $(this).prop("tagName").toLowerCase() == 'input' || $(this).prop("tagName").toLowerCase() == 'select') {
				$(this).attr("tabindex", tbIndx);
				$("#chkbx_chbSameBillAddress").attr("tabindex", tbIndx);
				$("#chkbx_StaticFareClubEnrollmentInputControl_chbTermsAndConditions").attr("tabindex", tbIndx);
			}
		});
		$("#StaticFareClubEnrollmentInputControl_tbCreditCardNumber").focus();
		$("span.field_chkbx").keydown(function (event) {
			var keyCode = (event.keyCode ? event.keyCode : event.which);
			if (keyCode == 13) {
				$(this).click();
				return false;
			}
		});
	});
});

