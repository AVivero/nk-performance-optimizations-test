function fireModal(formattedAnnual9DFCMembership, ndfcSavings1, ndfcSavings2, ndfcSavings3, ndfcSavings4, paxCount) {
	var count = $(".memberFare:checked").length;
	if (count > 0) {
		var savingsPerPaxDepart = ndfcSavings1.replace(/\$/, '');
		var defineSavingsDepart = (savingsPerPaxDepart === "") ? 0 : parseFloat(savingsPerPaxDepart);
		var savingsPerPaxArrive = ndfcSavings2.replace(/\$/, '');
		var defineSavingsArrive = (savingsPerPaxArrive === "") ? 0 : parseFloat(savingsPerPaxArrive);
		var savingsPerPax3 = ndfcSavings3.replace(/\$/, '');
		var defineSavings3 = (savingsPerPax3 === "") ? 0 : parseFloat(savingsPerPax3);
		var savingsPerPax4 = ndfcSavings4.replace(/\$/, '');
		var defineSavings4 = (savingsPerPax4 === "") ? 0 : parseFloat(savingsPerPax4);
		var passengerCount = parseFloat(paxCount);
		var amountToSave = defineSavingsDepart + defineSavingsArrive + defineSavings3 + defineSavings4;
		if (PageModel.savingsTotal && (savingsPerPaxDepart === "" || savingsPerPaxArrive === "" || savingsPerPax3 === "" || savingsPerPax4 === "")) {
			amountToSave = parseFloat(PageModel.savingsTotal);
		}
		var annual9DFCMembership = formattedAnnual9DFCMembership.replace(/\$/, '');
		var membershipAmount = (annual9DFCMembership === "") ? 0 : parseFloat(annual9DFCMembership);
		var allRadios = document.getElementsByTagName("input");
		var totalSavings = amountToSave * passengerCount;
		var roundedSavings = totalSavings.toFixed(2);
		var savingsLegend1 = document.getElementById("savingsAmount1");
		var savingsLegend2 = document.getElementById("savingsAmount2");
		if (savingsLegend1 != null)
			savingsLegend1.innerHTML = " $" + roundedSavings;
		if (savingsLegend2 != null)
			savingsLegend2.innerHTML = " $" + roundedSavings;

		if (isTravelAgent == "True" || is9DFCMember == "True" || amountToSave <= 0) {
			__doPostBack(postbackControlName + '$LinkButtonSubmit', '');
			return true;
		}
		if (isTravelAgent == "False" && is9DFCMember == "False") {
			$('#modalContent').modal({ backdrop: 'static', keyboard: false });

			if (totalSavings > membershipAmount) {
				document.getElementById('savingsWorth').style.display = 'block';
				document.getElementById('savingLess').style.display = 'none';
				document.getElementById('savingMore').style.display = 'block';
			} else {
				document.getElementById('savingsWorth').style.display = 'none';
				document.getElementById('savingMore').style.display = 'none';
				document.getElementById('savingLess').style.display = 'block';
			}
			return false;
		}
	} else {
		__doPostBack(postbackControlName + '$LinkButtonSubmit', '');
		return true; //gps 3.2 should hav etrue after no memberFares selected maybe not?
	}
}

function fireModalHotel(packageSavings, membershipAmount) {
	var sniffIE7 = $("html").hasClass("ie7");
	var sniffIE8 = $("html").hasClass("ie8");
	var savingsWorth = document.getElementById("savingsWorth");
	var savingsAmount1 = document.getElementById("savingsAmount1");
	var savingsAmount2 = document.getElementById("savingsAmount2");
	var membershipAmountDisplay = document.getElementById("membershipAmountDisplay");
	if (parseFloat(membershipAmount) > parseFloat(packageSavings)) {
		savingLess.style.display = "block";
		savingMore.style.display = "none";
	}
	else {
		savingsWorth.style.display = "block";
		savingMore.style.display = "block";
		savingLess.style.display = "none";
	}
	if (sniffIE7 || sniffIE8) {
		savingsAmount1.innerText = "$" + parseFloat(packageSavings).toFixed(2);
		savingsAmount2.innerText = "$" + parseFloat(packageSavings).toFixed(2);
		membershipAmountDisplay.innerText = membershipAmount;
	} else {
		savingsAmount1.textContent = "$" + parseFloat(packageSavings).toFixed(2);
		savingsAmount2.textContent = "$" + parseFloat(packageSavings).toFixed(2);
		membershipAmountDisplay.textContent = membershipAmount;
	}
}

function fireModal_TaxesFees(currentCulture) {
	var showMask = document.getElementById('mask_TaxesFees');
	var showModal = document.getElementById('modalWindow_TaxesFees');
	var windowWidth = document.body.clientWidth;
	var windowHeight = document.body.clientHeight;
	showMask.style.display = 'block';
	showModal.style.display = 'block';

	var modalWidth = showModal.offsetWidth;
	var modalHeight = showModal.offsetHeight;
	var leftPos = 75;
	showMask.style.height = '1500px';
	showModal.style.left = leftPos + 'px';
	showModal.style.top = '70px';
	showModal.style.width = '600px';

	function fadeIn_TaxesFees(showMask) {
		if (showMask.style) {
			showMask.style.opacity = '0';
		}
		if (showMask.style) {
			showMask.style.filter = "alpha(opacity=0)";
		}

		if (navigator.userAgent.indexOf('MSIE') != -1) {
			var animate = setInterval(function () {
				if (showMask.style.filter) {
					var getCurrentOpacity = showMask.style.filter;
					var explodeProperty = getCurrentOpacity.split("=");
					var propertyDigit = explodeProperty[1].split(")");
					var turnToNumber = parseFloat(propertyDigit[0]);
					var defineOpacity = turnToNumber + 10;
					showMask.style.filter = "alpha(opacity=" + defineOpacity + ")";
					if (showMask.style.filter == "alpha(opacity=70)") {
						clearInterval(animate);
					}
				}
			}, 500 / 50);
		} else {
			var animate = window.setInterval(function () {
				if (showMask.style.opacity) {
					showMask.style.opacity = +(showMask.style.opacity) + .10;
					if (showMask.style.opacity >= 0.7) {
						clearInterval(animate);
					}
				}
			}, 500 / 500);
		}
	}
	fadeIn_TaxesFees(showMask);
	window.scroll(0, 0);
}

function fireModalNewEmail() {
	var showMask = document.getElementById('mask');
	var showModal = document.getElementById('modalWindow');
	var windowWidth = document.body.clientWidth;
	var windowHeight = document.body.clientHeight;
	showMask.style.display = 'block';
	showModal.style.display = 'block';
	var modalWidth = showModal.offsetWidth;
	var modalHeight = showModal.offsetHeight;
	var leftPos = (windowWidth - modalWidth) / 2;
	showMask.style.height = windowHeight + 'px';
	showModal.style.left = leftPos + 'px';
	showModal.style.top = '200px';

	function fadeIn(showMask) {
		if (showMask.style) {
			showMask.style.opacity = '0';
		}
		if (showMask.style) {
			showMask.style.filter = "alpha(opacity=0)";
		}

		if (navigator.userAgent.indexOf('MSIE') != -1) {
			var animate = setInterval(function () {
				if (showMask.style.filter) {
					var getCurrentOpacity = showMask.style.filter;
					var explodeProperty = getCurrentOpacity.split("=");
					var propertyDigit = explodeProperty[1].split(")");
					var turnToNumber = parseFloat(propertyDigit[0]);
					var defineOpacity = turnToNumber + 10;
					showMask.style.filter = "alpha(opacity=" + defineOpacity + ")";
					if (showMask.style.filter == "alpha(opacity=70)") {
						clearInterval(animate);
					}
				}
			}, 500 / 50);
		} else {
			var animate = window.setInterval(function () {
				if (showMask.style.opacity) {
					showMask.style.opacity = +(showMask.style.opacity) + .10;
					if (showMask.style.opacity >= 0.7) {
						clearInterval(animate);
					}
				}
			}, 500 / 500);
		}
	}
	fadeIn(showMask);
	window.scroll(0, 0);
}

function closeModal() {
	var hideMask = document.getElementById('mask');
	var hideModal = document.getElementById('modalWindow');
	var modalContent = document.getElementById('modalContent');
	hideMask.style.display = 'none';
	hideModal.style.display = 'none';
	hideModal.style.left = '0px';
	hideModal.style.top = '0px';
}

function closeModal_TaxesFees() {
	var hideMask = document.getElementById('mask_TaxesFees');
	var hideModal = document.getElementById('modalWindow_TaxesFees');
	var modalContent = document.getElementById('modalContent_TaxesFees');
	hideMask.style.display = 'none';
	hideModal.style.display = 'none';
	hideModal.style.left = '0px';
	hideModal.style.top = '0px';
}

function enterNewEmail() {
	closeModal();
	var newEmailField = document.getElementById('PassengerContactGroup_PassengerContactContactInput_TextBoxEmailAddress');
	var confirmNewEmailField = document.getElementById('PassengerContactGroup_PassengerContactContactInput_EmailCompare');
	newEmailField.style.backgroundColor = "yellow";
	confirmNewEmailField.style.backgroundColor = "yellow";
	newEmailField.value = "";
	confirmNewEmailField.value = "";
	newEmailField.focus();
	window.scrollTo(0, 99999999999);
	return true;
}

function nineDollarFareRemoval() {
	var showMask = document.getElementById('mask');
	var showModal = document.getElementById('modalWindow');
	var windowWidth = document.body.clientWidth;
	var windowHeight = document.body.clientHeight;
	showMask.style.display = 'block';
	showModal.style.display = 'block';
	var modalWidth = showModal.offsetWidth;
	var modalHeight = showModal.offsetHeight;
	var leftPos = (windowWidth - modalWidth) / 2;
	var getSavings = $("span#9dfcSavings").text();
	$("span#savingsAmount3").text(getSavings);
	showMask.style.height = windowHeight + 'px';
	showModal.style.left = leftPos + 'px';
	showModal.style.top = '200px';

	function fadeIn(showMask) {
		if (showMask.style) {
			showMask.style.opacity = '0';
		}
		if (showMask.style) {
			showMask.style.filter = "alpha(opacity=0)";
		}

		if (navigator.userAgent.indexOf('MSIE') != -1) {
			var animate = setInterval(function () {
				if (showMask.style.filter) {
					var getCurrentOpacity = showMask.style.filter;
					var explodeProperty = getCurrentOpacity.split("=");
					var propertyDigit = explodeProperty[1].split(")");
					var turnToNumber = parseFloat(propertyDigit[0]);
					var defineOpacity = turnToNumber + 10;
					showMask.style.filter = "alpha(opacity=" + defineOpacity + ")";
					if (showMask.style.filter == "alpha(opacity=70)") {
						clearInterval(animate);
					}
				}
			}, 500 / 50);
		} else {
			var animate = window.setInterval(function () {
				if (showMask.style.opacity) {
					showMask.style.opacity = +(showMask.style.opacity) + .10;
					if (showMask.style.opacity >= 0.7) {
						clearInterval(animate);
					}
				}
			}, 500 / 500);
		}
	}
	fadeIn(showMask);
	window.scroll(0, 0);
}

function fireModal_DebitCard() {
	var showMask = document.getElementById('mask_DebitCard');
	var showModal = document.getElementById('modalWindow_DebitCard');
	var windowWidth = document.body.clientWidth;
	var windowHeight = document.body.clientHeight;
	showMask.style.display = 'block';
	showModal.style.display = 'block';
	var modalWidth = showModal.offsetWidth;
	var modalHeight = showModal.offsetHeight;
	var leftPos = (windowWidth - modalWidth) / 2;
	showMask.style.height = windowHeight + 'px';
	showModal.style.left = leftPos + 'px';
	showModal.style.top = '200px';

	function fadeIn(showMask) {
		if (showMask.style) {
			showMask.style.opacity = '0';
		}
		if (showMask.style) {
			showMask.style.filter = "alpha(opacity=0)";
		}

		if (navigator.userAgent.indexOf('MSIE') != -1) {
			var animate = setInterval(function () {
				if (showMask.style.filter) {
					var getCurrentOpacity = showMask.style.filter;
					var explodeProperty = getCurrentOpacity.split("=");
					var propertyDigit = explodeProperty[1].split(")");
					var turnToNumber = parseFloat(propertyDigit[0]);
					var defineOpacity = turnToNumber + 10;
					showMask.style.filter = "alpha(opacity=" + defineOpacity + ")";
					if (showMask.style.filter == "alpha(opacity=70)") {
						clearInterval(animate);
					}
				}
			}, 500 / 50);
		} else {
			var animate = window.setInterval(function () {
				if (showMask.style.opacity) {
					showMask.style.opacity = +(showMask.style.opacity) + .10;
					if (showMask.style.opacity >= 0.7) {
						clearInterval(animate);
					}
				}
			}, 500 / 500);
		}
	}
	fadeIn(showMask);
	window.scroll(0, 0);
}

function closeModal_DebitCard() {
	var hideMask = document.getElementById('mask_DebitCard');
	var hideModal = document.getElementById('modalWindow_DebitCard');
	var modalContent = document.getElementById('modalContent_DebitCard');
	hideMask.style.display = 'none';
	hideModal.style.display = 'none';
	hideModal.style.left = '0px';
	hideModal.style.top = '0px';
}

function fireModalMemberWelcome() {
	var showMask = document.getElementById('mask_MemberWelcome');
	var showModal = document.getElementById('modalWindow_MemberWelcome');
	var windowWidth = document.body.clientWidth;
	var windowHeight = document.body.clientHeight;
	showMask.style.display = 'block';
	showModal.style.display = 'block';
	var modalWidth = showModal.offsetWidth;
	var modalHeight = showModal.offsetHeight;
	var leftPos = (windowWidth - modalWidth) / 2;
	showMask.style.height = windowHeight + 'px';
	showModal.style.left = leftPos + 'px';
	showModal.style.top = '200px';

	function fadeIn(showMask) {
		if (showMask.style) {
			showMask.style.opacity = '0';
		}
		if (showMask.style) {
			showMask.style.filter = "alpha(opacity=0)";
		}

		if (navigator.userAgent.indexOf('MSIE') != -1) {
			var animate = setInterval(function () {
				if (showMask.style.filter) {
					var getCurrentOpacity = showMask.style.filter;
					var explodeProperty = getCurrentOpacity.split("=");
					var propertyDigit = explodeProperty[1].split(")");
					var turnToNumber = parseFloat(propertyDigit[0]);
					var defineOpacity = turnToNumber + 10;
					showMask.style.filter = "alpha(opacity=" + defineOpacity + ")";
					if (showMask.style.filter == "alpha(opacity=70)") {
						clearInterval(animate);
					}
				}
			}, 500 / 50);
		} else {
			var animate = window.setInterval(function () {
				if (showMask.style.opacity) {
					showMask.style.opacity = +(showMask.style.opacity) + .10;
					if (showMask.style.opacity >= 0.7) {
						clearInterval(animate);
					}
				}
			}, 500 / 500);
		}
	}
	fadeIn(showMask);
	window.scroll(0, 0);
}