var HeaderBubbleHelper;
var LoginContext;
var LoginArgs;
$(function () {
	$("a.logoutlink").click(function () {
		LoginDialogSubmit({ "logout": true });
	});

	var loginBox = $("#login");
	if (loginBox.length > 0) {
		// Login Modal Dialog
		if ($('form').attr('action') != undefined && $('form').attr('action') == "StaticFareClubEnrollment.aspx") {
			//$('#login a[href="FreeSpiritEnrollment.aspx"]').addClass('hidden');
			if (logintext != undefined && logintext != '') {
				$('#login button').text(logintext);
				$('#login button').focus();
			}
			//if (closebuttontext != undefined && closebuttontext != '') {
			//    $('#login button').after("<a id=9dfclosebutton>" + closebuttontext + "</a>");
			//}


			//        loginBox.dialog({
			//            autoOpen: false,
			//            modal: true,
			//            dialogClass: 'modalWindow',
			//close: function (event, ui) {
			//               //BLC This is just clearing the form i think. why does change password need to be hidden specifically?
			//                $("#emailField").val('');
			//                $("#passwordField").val('');
			//                $("#newPasswordField").val('');
			//                $("#confirmNewPasswordField").val('');
			//                $(".change-password").hide();
			//            },
			//            open: function (event, ui) { $("#login_error").html(""); },
			//            width: 485,
			//            resizable: false,
			//            position: GetDefaultModalPosition()
			//        });

			//$('#9dfclosebutton').click(function () {
			//    $("#emailField").val('');
			//    $("#passwordField").val('');
			//    $("#newPasswordField").val('');
			//    $("#confirmNewPasswordField").val('');
			//    $(".change-password").hide();
			//    $('#login').dialog('close');

			//});
		}
		else {
			//         loginBox.dialog({
			//             autoOpen: false,
			//             modal: true,
			//             close: function (event, ui) {
			//                 $("#emailField").val('');
			//                 $("#passwordField").val('');
			//                 $("#newPasswordField").val('');
			//                 $("#confirmNewPasswordField").val('');
			//                 $(".change-password").hide();
			//             },
			//             open: function (event, ui) { $("#login_error").html(""); }, // BLC I think this just clears out any login error prior to opening? Can just do right before we open the bs modal.
			//             dialogClass: 'modalWindow',
			//             width: 485,
			//             resizable: false,
			//             position: GetDefaultModalPosition()
			//});

			//loginBox.modal();
		}

		loginBox.on('hidden.bs.modal', function () {
			console.log("clearing login modal values");
			$("#emailField").val('');
			$("#passwordField").val('');
			$("#newPasswordField").val('');
			$("#confirmNewPasswordField").val('');
			$(".change-password").hide();
		})


		$("#loginlink").click(function () {
			//loginBox.dialog('open');
			HeaderBubbleHelper.hide();
			$("#login_error").html("");
			loginBox.modal();
			PageModel.issubmitClicked = false;
		});

		HeaderBubbleHelper = new BubbleHelper("#header_error_bubble");
		loginBox.find('button:not(".close")').click(function () {
			var result = true;
			var resetPassword = false;
			var emailField = $("#emailField");
			var passwordField = $("#passwordField");
			var newPasswordField = $("#newPasswordField");
			var confirmNewPasswordField = $("#confirmNewPasswordField");

			if (!validateRequired(emailField[0])) {
				HeaderBubbleHelper.display(emailField, PageModel.headerEmailRequired);
				emailField.focus();
				result = false;
				//} else if (!validateFSLogin(emailField[0])) {
			} else if (!validateEmailConditionally(emailField[0])) {
				HeaderBubbleHelper.display(emailField, PageModel.headerEmailFormat);
				emailField.focus();
				result = false;
			} else if (!validateRequired(passwordField[0])) {
				HeaderBubbleHelper.display(passwordField, PageModel.headerPasswordRequired);
				passwordField.focus();
				result = false;
			} else if ($(".change-password").length > 0 && $(".change-password").css('display') != 'none') {
				resetPassword = true;
				if (!validateRequired(newPasswordField[0])) {
					HeaderBubbleHelper.display(newPasswordField, PageModel.headerNewPasswordRequired);
					newPasswordField.focus();
					return false;
				}
				else if (!validateRequired(confirmNewPasswordField[0])) {
					HeaderBubbleHelper.display(confirmNewPasswordField, PageModel.headerConfirmNewPasswordRequired);
					confirmNewPasswordField.focus();
					return false;
				}
				else if (newPasswordField.val() !== confirmNewPasswordField.val()) {
					HeaderBubbleHelper.display(confirmNewPasswordField, PageModel.headerNewPasswordMustMatch);
					newPasswordField.focus()
					return false;
				}
				else if (newPasswordField.val() === passwordField.val()) {
					HeaderBubbleHelper.display(newPasswordField, PageModel.headerOldPasswordAndNewPasswordMustNotMatch);
					newPasswordField.focus();
					return false;
				}
			}

			$('#error_msg_bubble').css('z-index', '1003');

			if (result) {
				var dataString = 'username=' + emailField.val() + '&pwd=' + passwordField.val() + '&requiredpaxval=' + $("#requiredpaxval").val();
				if (resetPassword)
					dataString += '&newpwd=' + newPasswordField.val() + '&cnewpwd=' + confirmNewPasswordField.val();

				dataString += '&login=true';
				if (validateEmailConditionally(emailField[0]) && validateRequired(passwordField[0])) {
					$("#header_error_bubble").css("display", "none");
				}
				else {
					$("#header_error_bubble").css("display", "block");
				}
				LoginDialogSubmit(dataString);
			}
		});
	}
});

function BagsLogin(loginContext, loginArgs) {
	LoginContext = loginContext;
	LoginArgs = loginArgs;
	$("#loginlink").click();
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

function ProcessLoginData(response) {
	if (!$('#bonusMilesButtons').attr('submitted')) {
		if (response.success) {
			var $redeemMiles = $("#redeemMiles").val();
			//If redemption chk box was checked we need to redirect to Availability
			if (response.reason == "" && $redeemMiles != null && $redeemMiles == "true") {
				var loginBox = $("#login");
				loginBox.modal('hide');
				loginDialogClosed = true;
				if (PageModel.issubmitClicked == true) {
					$("#book-travel-form").submit();
				}
				else {
					window.location.reload();
				}
			}
			else {
				if (LoginContext && LoginContext == 'loginPostBack') {
					// MT - when calling from bags page, simply do a postback so that we can instantiate a Selection object ahead  of redirecting to the Availability page
					var loginBox = $("#login");
					loginBox.modal('hide');
					loginDialogClosed = true;
					__doPostBack(LoginContext, LoginArgs);
				}
				else {
					window.location.reload();
				}
			}
		}
		else {
			if (response.pwdreset) {
				$(".change-password").show();
				$("#newPasswordField").focus();
			}
			$("#login_error").html("<p>" + response.reason + "</p>");
			$("#login_error").focus();
		}
	}
	else {
		ProcessSpiritRedeem(response);
	}
}
function ProcessFastPathLoginData(response) {
	if (!$('#bonusMilesButtons').attr('submitted')) {
		if (response.success) {
			$('#login').modal('hide');
			var $redeemMiles = $("#redeemMiles").val();
			//If redemption chk box was checked we need to redirect to Availability
			if (response.reason == "" && $redeemMiles != null && $redeemMiles == "true") {
				loginDialogClosed = true;
				if (PageModel.issubmitClicked == true) {
					$("#book-travel-form").submit();
				} else {
					window.location.reload();
				}
			}
			else {
				var fastpath = $("#requiredpaxval").val();
				if (response.IS9DFCMEMBER == "False" && fastpath != undefined && fastpath == "true") {
					displayfreespiritPopupfastpath();
				}
				// MT 02/17/2017 - attempt to complete the login sequence if a spurrious fastpath login determination returns from the secure login post
				else if (fastpath == undefined) {
					loginDialogClosed = true;
					window.location.reload();
				}
				else {
					if ($("#modalContentPurchaseBags_ndfcfastpath .savingsButtonGroup a:eq(0)").attr('postvalue') != null && $("#modalContentPurchaseBags_ndfcfastpath .savingsButtonGroup a:eq(0)").attr('postvalue') != undefined) {
						__doPostBack($("#modalContentPurchaseBags_ndfcfastpath .savingsButtonGroup a:eq(0)").attr('postvalue'), '');
					}
					else if ($("#modalContentPurchaseBags_ndfcfastpath .savingsButtonGroup a:eq(0)") != null) {
						$("#modalContentPurchaseBags_ndfcfastpath .savingsButtonGroup a:eq(0)").click();
					}
					else {
						window.location.reload();
					}
				}
			}
		}
		else {
			if (response.pwdreset) {
				$(".change-password").show();
				$("#newPasswordField").focus();
			}

			$("#login_error").html("<p>" + response.reason + "</p>");
			$("#login_error").focus();
		}
	} else {
		ProcessSpiritRedeem(response);
	}
}

function CallAjaxSignUpModalStrategy(controlId) {
	if (controlId.toLowerCase().indexOf('tally') !== -1) {
		NineDollarFareClubTallyAjaxSignupModal();
    }
    else {
	    AjaxSignupModal();
    }
}
function CallAjaxDeclineSignupStrategy(controlId) {
	if (controlId.toLowerCase().indexOf('tally') !== -1) {
		NineDollarFareClubTallyAjaxDeclineSignup();
	}
	else {
		AjaxDeclineSignup();
	}
}

function CallAjaxLoginModalStrategy(controlId) {
	if (controlId.toLowerCase().indexOf('tally') !== -1) {
		NineDollarFareClubTallyAjaxLoginModal();
	}
	else if (controlId.toLowerCase().indexOf('passengercontactsignupcontrol') !== -1) {
		AjaxLoginModal();
	}
	else if (controlId.toLowerCase().indexOf('preassignbagslogincontrol') !== -1) {
		AjaxLoginModal();
	}
    else {
	    AjaxSignupModal();
    }
}