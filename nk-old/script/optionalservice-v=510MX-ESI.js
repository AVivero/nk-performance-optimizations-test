var fromWhereText = "From Where";
var toWhereText = "To Where";
var departuredate = "";
var returndate = "";
var salesdate = "";
var oslastname = "";
var osconfirmationcode = "";
var agentosconfirmationcode = "";

(function ($) {
	$.fn.tabaccordion = function (o) {

		var wrapper = this,
			accordion_section = "accordion_section",
			hashid = location.hash,
			tab_section = "tab_section",
			tabselem = $("nav#optional_tabs li");

		var init = function () {
			closeallsubsection(); // on load close all subsection
			defaulthashopen(); // check if any hash exists
			accordionclick();
		};

		var defaulthashopen = function () {
			if (hashid !== "" && $(hashid).length > 0) {
				if ($(hashid).hasClass(tab_section)) {
					$("." + tab_section).each(function () {
						$(this).addClass("hidden");
					});
					$(hashid).removeClass("hidden");

					tabselem.each(function () {
						$(this).removeClass("active");
						if ($(this).attr("rel") === hashid.split("#")[1]) {
							$(this).addClass("active");
						}
					});
					hashid = "#optional_tabs";
				} else {
					if ($(hashid).hasClass(accordion_section)) {
						var getparenttabid = $(hashid).parents("." + tab_section).attr("id");
						$("." + tab_section).each(function () {
							$(this).addClass("hidden");
						});
						$("#" + getparenttabid).removeClass("hidden");
						tabselem.each(function () {
							$(this).removeClass("active");
							if ($(this).attr("rel") === getparenttabid) {
								$(this).addClass("active");
							}
						});
						$(hashid).removeClass("close").addClass("open");
					}
				}
				$.scrollTo(hashid, 600);
			} else {
				$("." + tab_section).each(function () {
					$(this).addClass("hidden");
				});
				$("." + tab_section).eq(0).removeClass("hidden");

				tabselem.each(function () {
					$(this).removeClass("active");
				});
				tabselem.eq(0).addClass("active");
			}
		};

		var closeallsubsection = function () {
			$("." + accordion_section).each(function () {
				if (!$(this).hasClass("main_section")) {
					$(this).removeClass("open").addClass("close");
				}
			});
		};
		$("#bags_second_section ul.shown_section").keydown(function (event) {
			var keyCode = (event.keyCode ? event.keyCode : event.which);
			if (keyCode == 13) {
				$("#bags_second_section ul.shown_section").click();
			}
		});
		$("#bags_third_section ul.shown_section").keydown(function (event) {
			var keyCode = (event.keyCode ? event.keyCode : event.which);
			if (keyCode == 13) {
				$("#bags_third_section ul.shown_section").click();
			}
		});
		$("#other_second_section ul.shown_section").keydown(function (event) {
			var keyCode = (event.keyCode ? event.keyCode : event.which);
			if (keyCode == 13) {
				$("#other_second_section ul.shown_section").click();
			}
		});
		$("#other_third_section ul.shown_section").keydown(function (event) {
			var keyCode = (event.keyCode ? event.keyCode : event.which);
			if (keyCode == 13) {
				$("#other_third_section ul.shown_section").click();
			}
		});
		$("#other_forth_section ul.shown_section").keydown(function (event) {
			var keyCode = (event.keyCode ? event.keyCode : event.which);
			if (keyCode == 13) {
				$("#other_forth_section ul.shown_section").click();
			}
		});
		$("#other_fifth_section ul.shown_section").keydown(function (event) {
			var keyCode = (event.keyCode ? event.keyCode : event.which);
			if (keyCode == 13) {
				$("#other_fifth_section ul.shown_section").click();
			}
		});
		$("#other_sixth_section ul.shown_section").keydown(function (event) {
			var keyCode = (event.keyCode ? event.keyCode : event.which);
			if (keyCode == 13) {
				$("#other_sixth_section ul.shown_section").click();
			}
		});
		var accordionclick = function () {
			$("ul.shown_section").click(function () {
				var isclose = $(this).parent().hasClass("close");
				if (isclose) {
					$(this).parent().removeClass("close").addClass("open");
				} else {
					$(this).parent().removeClass("open").addClass("close");
				}
			});
		};

		init();
	};

	$.fn.blurb = function (o) {

		// Default Settings
		var defaults = {
			delaytime: 5000
		};
		// create settings from defauls and user options
		var settings = $.extend({}, defaults, o);

		var wrapper = this,
			blurbclass = $(".popUpFareWrapperDISABLE"),
			pos,
			intervaltime,
			isintervalSet = false,
			isblurbright = false,
			mobilebrowser = settings.mobilebrowser;

		var init = function () {
			//if (mobilebrowser) {
			//    wrapper.find(".blurb-icon").click(function () {
			//        pos = $(this).offset();
			//        if ($(this).parent().attr("isblurbright") !== "" && typeof ($(this).parent().attr("isblurbright")) !== "undefined") {
			//            if ($(this).parent().attr("isblurbright") === "true") {
			//                isblurbright = true;
			//            } else {
			//                isblurbright = false;
			//            }
			//        } else {
			//            isblurbright = false;
			//        }
			//        placeblurbcontent($(this));
			//        resetblurbstyle($(this));
			//        setblurbPos($(this));
			//        blurbappearmobile();
			//    });
			//    closeblurb();
			//} else {
			//    wrapper.find(".blurb-icon").hover(function () {
			//        pos = $(this).offset();
			//        if ($(this).parent().attr("isblurbright") !== "" && typeof ($(this).parent().attr("isblurbright")) !== "undefined") {
			//            if ($(this).parent().attr("isblurbright") === "true") {
			//                isblurbright = true;
			//            } else {
			//                isblurbright = false;
			//            }
			//        } else {
			//            isblurbright = false;
			//        }
			//        placeblurbcontent($(this));
			//        resetblurbstyle($(this));
			//        setblurbPos($(this));
			//        blurbappear();
			//    }, function () {
			//        intervaltime = setInterval(function () {
			//            blurbdisappear();
			//        }, settings.delaytime);
			//        isintervalSet = true;
			//    });

			//    blurbclass.hover(function () {
			//        blurbappear();
			//    }, function () {
			//        intervaltime = setInterval(function () {
			//            blurbdisappear();
			//        }, settings.delaytime);
			//        isintervalSet = true;
			//    });
			//}

			wrapper.find(".blurb-icon").click(function () {
				pos = $(this).offset();
				if ($(this).parent().attr("isblurbright") !== "" && typeof ($(this).parent().attr("isblurbright")) !== "undefined") {
					if ($(this).parent().attr("isblurbright") === "true") {
						isblurbright = true;
					} else {
						isblurbright = false;
					}
				} else {
					isblurbright = false;
				}
				placeblurbcontent($(this));
				resetblurbstyle($(this));
				setblurbPos($(this));
				blurbappearmobile();
				$("div.closeBtn").focus();
				$("a.blurb-icon").removeClass('active');
				$(this).addClass('active');
			});
		};

		var setblurbPos = function (blurbelem) {
			var blurbleft = isblurbright ? pos.left - blurbclass.outerWidth() + 50 : pos.left - 40;
			blurbclass.css({
				top: pos.top - blurbclass.outerHeight() - 15,
				left: blurbleft
			});
			if (isblurbright) {
				$(".popUpWrapperTail").css({
					left: blurbclass.outerWidth() - 65
				});
			}
		};

		var resetblurbstyle = function (blurbelem) {
			blurbclass.css({
				top: 0,
				left: 0
			});
			$(".popUpWrapperTail").css({
				left: "25px"
			});
		};

		var placeblurbcontent = function (blurbelem) {
			blurbclass.find(".popUpContent").empty();
			blurbclass.find(".popUpContent").html(blurbelem.next(".blurb-content").html());
		};

		var blurbappear = function () {
			blurbclass.hide();
			if (isintervalSet) {
				clearInterval(intervaltime);
			}
			blurbclass.show();
		};

		var blurbappearmobile = function () {
			if (!blurbclass.is(':visible')) {
				blurbclass.show();

				function closeblurbclass(event) {
					if (!$(event.target).parents('.popUpFareWrapper').length || $(event.target).hasClass('closeBtn')) {
						if (!$(event.target).hasClass('popUpFareWrapper')) {
							event.preventDefault();
							blurbclass.hide();
							$("#page").unbind('click', closeblurbclass);
						}
					}
				}
				setTimeout(function () {
					$("#page").bind('click', closeblurbclass);
				}, 100);
			}
		};

		var blurbdisappear = function () {
			blurbclass.hide();
			clearInterval(intervaltime);
			isintervalSet = false;
		};

		init();

	};

})(jQuery);

(function (a) {
	(jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
})(navigator.userAgent || navigator.vendor || window.opera);
var stationFrom = function () { return $("#DropDownOrign").val(); };
var stationTo = function () { return $("#DropDownDest").val(); };
jQuery(document).ready(function () {



	// tabs click functionality
	var tabselem = $("nav#optional_tabs li");
	var tabsection = $("section.tab_section");
	var accordion_section = $("section.accordion_section");
	var closeallsubsection = function () {
		accordion_section.each(function () {
			if (!$(this).hasClass("main_section")) {
				$(this).removeClass("open").addClass("close");
			}
		});
	};

	$("input[name='ticket_radio']").click(function () {
		$(".tickets_tabs").find("li").each(function () {
			$(this).removeClass("active");
		});
		$(this).parent().addClass("active");
		$(".newstyletable").each(function () {
			$(this).removeClass("shown").addClass("hidden");
		});
		var relid = "#" + $(this).attr("rel");
		$(relid).removeClass("hidden").addClass("shown");
	});

	tabselem.click(function () {
		tabselem.each(function () {
			$(this).removeClass("active");
		});
		$(this).addClass("active");

		var reltabid = $("#" + $(this).attr("rel"));
		tabsection.each(function () {
			$(this).addClass("hidden");
		});
		reltabid.removeClass("hidden");
		closeallsubsection();

	});

	// accordion functionality
	$(".accordion").tabaccordion();

	// blurb functionality
	$(".show-blurb").blurb({
		delaytime: 500,
		mobilebrowser: jQuery.browser.mobile
	});

	//Controls Script
	populateStation($("#DropDownOrign"));
	populateStation($("#DropDownDest"));
	$("#DropDownOrign").change(function () {
		updateDestinationStations($("#DropDownDest"), $("#DropDownOrign").val());
	});
	$("#DropDownDest").change(function () {
		if ($("#Optional-Booking-Calculator").text() != "") {
			updateNewTripButtonName();
		}
	});
	$("span.checkshowPricefirst").keydown(function (event) {
		var keyCode = (event.keyCode ? event.keyCode : event.which);
		if (keyCode == 13) {
			$('#NewTrip').click();
		}
	});
	$('#NewTrip').click(function () {
		$('.checkshowPrice .checkshowPricesecond input:radio').parent().removeClass('checkedshowPricesecond');
		$(this).parent(this).addClass('checkedshowPricefirst');
		ShowHideWidget('search');
		var tbIndx = $("span.checkshowPricefirst").attr("tabindex");
		$("#DropDownOrign").attr("tabindex", tbIndx);
		$("#DropDownDest").attr("tabindex", tbIndx);
		$("#departDateDisplay").attr("tabindex", tbIndx);
		$("#returnDateDisplay").attr("tabindex", tbIndx);
		$("#bookingSearchButton").attr("tabindex", tbIndx);
		$("a.start-over").attr("tabindex", tbIndx);
		$("#DropDownOrign").focus();
	});
	$("span.checkshowPricesecond").keydown(function (event) {
		var keyCode = (event.keyCode ? event.keyCode : event.which);
		if (keyCode == 13) {
			$('#ExistingTrip').click();
		}
	});
	$('#ExistingTrip').click(function () {
		$('.checkshowPrice .checkshowPricefirst input:radio').parent().removeClass('checkedshowPricefirst');
		$(this).parent(this).addClass('checkedshowPricesecond');
		ShowHideWidget('reservation');
		var tbIndx = $("span.checkshowPricesecond").attr("tabindex");
		$("#OptionalServices_LName").attr("tabindex", tbIndx);
		$("#OptionalServices_ConfirmationCode").attr("tabindex", tbIndx);
		$("#manageSearchButton").attr("tabindex", tbIndx);
		$("a.howtoFind").attr("tabindex", tbIndx);
		$("a.start-over").attr("tabindex", tbIndx);
		$("#OptionalServices_LName").focus();
	});
	$('#hidTemp').click(function () {
		$('.checkshowPrice .checkshowPricesecond input:radio').parent().removeClass('checkedshowPricesecond');
		$('.checkshowPrice .checkshowPricefirst input:radio').parent().removeClass('checkedshowPricefirst');
	});

	$('#manageSearchButton').click(function () {
		analyticsEvent("Optional Services", "Bag-o-tron", "Lookup Bay Prices");
		DisplayBagPrices('reservation', this);
		$("#error_msg_bubble").attr("tabindex", -1);
		$("#error_msg_bubble").focus();
	});

	$('#bookingSearchButton').click(function () {
		analyticsEvent("Optional Services", "Bag-o-tron" + stationFrom() + '-' + stationTo(), "Display Bay Prices");
		CollectChildrenInformation();
		//DisplayBagPrices('search', this);
		$("#error_msg_bubble").attr("tabindex", -1);
		$("#error_msg_bubble").focus();
	});

	pouplateCalendar(true);

	$('#closeButton_namePnrMismatch').click(function () {
		$('#namePnrMismatch').modal('hide');
	});

	$('body').on('click', 'a.why_price_different_link', function (event) {
		event.preventDefault();  //prevent the default action of the link
		var $this = $(this),
			$popup = $this.closest(".tax_rate_block_FA").find(".popUpWrapper");
		if (!$popup.is(':visible')) {
			displayPopupWrapper($this, $popup);
			function closeStopsLink(event) {
				if (!$(event.target).parents('.popUpWrapper').length || $(event.target).hasClass('closeBtn')) {
					if (!$(event.target).hasClass('popUpWrapper')) {
						event.preventDefault();
						$popup.hide();
						$(document).unbind('click', closeStopsLink);
					}
				}
			}
			setTimeout(function () {
				$(document).bind('click', closeStopsLink);
			}, 100);
		}
	});

	FixPlaceHolderIssue();

});

function FixPlaceHolderIssue() {

	if (!Modernizr.input.placeholder) {
		$('input[placeholder]').each(function () {
			var $this = $(this);
			var placeholder = $this.attr('placeholder');
			this.value = placeholder;
			$this.focus(function () {
				if (this.value === placeholder) {
					this.value = "";
					$this.removeClass('placeholder');
				}
			});
			$this.blur(function () {
				if ($.trim(this.value) === "") {
					this.value = placeholder;
					$this.addClass('placeholder');
				}
			});
			$this.blur();
		});
	}
}

function onEnterClick(e, key) {
	var e = window.event || e;
	if (e.keyCode == 13) {
		$("#ui-datepicker-div").hide();
		switch (key) {
			case "Search":
				CollectChildrenInformation();
				//DisplayBagPrices('search', this);
				break;
			case "Reservation":
				DisplayBagPrices('reservation', this, null);
		}
	}
}
function updateNewTripButtonName() {

	$("#bookingSearchButton").text($("#bookingSearchButtonUpdatedText").text());
	$("#manageSearchButton").text($("#bookingSearchButtonUpdatedText").text());
}
function updateExistTripButtonName() {
	if ($("#Optional-Booking-Calculator").text() != "" && ($("#OptionalServices_LName").val() != oslastname || $("#OptionalServices_ConfirmationCode").val() != osconfirmationcode || $("#agent_OptionalServices_ConfirmationCode") != agentosconfirmationcode)) {
		updateNewTripButtonName();
		oslastname = $("#OptionalServices_LName").val();
		osconfirmationcode = $("#OptionalServices_ConfirmationCode").val();
		agentosconfirmationcode = $("#agent_OptionalServices_ConfirmationCode").val();
	}
	else {
		oslastname = $("#OptionalServices_LName").val();
		osconfirmationcode = $("#OptionalServices_ConfirmationCode").val();
		agentosconfirmationcode = $("#agent_OptionalServices_ConfirmationCode").val();

	}
}
function displayPopupWrapper(originater, popup, toRight) {
	$(".popUpWrapper").hide(); // hide any other balloon that might be open in order to show the one being clicked on
	var isRight = false;
	if (toRight && toRight === true) {
		isRight = true;
	}
	var $this = (originater instanceof jQuery) ? originater : $(originater);
	var linkCoord = $this.position();
	var prepareBubble = (popup instanceof jQuery) ? popup : $(popup);
	var bubbleHeight = (prepareBubble.height() + 55);
	var horizDiff = isRight ? (prepareBubble.width() - 18) : 20;
	prepareBubble.css({ "left": +(linkCoord.left - horizDiff), "top": +(linkCoord.top - bubbleHeight) });
	// TFS #14963
	if ($.browser.opera && prepareBubble.find("div.popUpWrapperTail").length > 0) {
		prepareBubble.find("div.popUpWrapperTail").css({ position: "absolute", bottom: "-20px" });
		var floatvar = prepareBubble.hasClass("taxes_fees_list") ? "right" : "left";
		prepareBubble.find("div.popUpWrapperTail").css({ position: "relative", bottom: "-38px", float: floatvar });
		if (!prepareBubble.hasClass("topchanged")) {
			prepareBubble.addClass("topchanged");
			prepareBubble.css({ "top": +(parseFloat(prepareBubble.css("top")) - 20) });
		}
	}
	prepareBubble.show();
}

function populateStation(obj, filterArray) {
	var $obj = $(obj);
	var frag = document.createDocumentFragment();
	var stationsList = stations;

	var option = document.createElement("option");
	option.value = "";

	if ($obj.attr("id") == "DropDownOrign") {
		option.appendChild(document.createTextNode(fromWhereText));

	}
	if ($obj.attr("id") == "DropDownDest") {
		option.appendChild(document.createTextNode(toWhereText));
	}
	frag.appendChild(option);

	if (filterArray) {
		for (var i = 0, j = filterArray.length; i < j; i++) {
			var itm = filterArray[i];
			frag.appendChild(createStationOption(itm.Station, itm.Name));
		}
	} else {
		for (key in stationsList) {
			var itm = stationsList[key];
			frag.appendChild(createStationOption(itm.Station, itm.Name));
		}
	}
	obj.empty();
	obj.append(frag);
}

function createStationOption(code, label) {
	var option = document.createElement("option");
	option.value = code;
	var txt = label + " (" + code + ")";
	option.appendChild(document.createTextNode(txt));
	return option;
}

function populatePaxSelects() {
	var $ddl = $("#paxAdults");

	var frag = document.createDocumentFragment();

	var option = document.createElement("option");
	option.value = "";

	frag.appendChild(option);
	for (var i = 1, j = 9; i < j; i++) {
		option = document.createElement("option");
		option.value = i.toString();
		var txt = i.toString() + " Adults";
		option.appendChild(document.createTextNode(txt));
		frag.appendChild(option);
	}
	ddl.empty();
	ddl.append(frag);
}

function updateDestinationStations(obj, code) {
	if ($("#Optional-Booking-Calculator").text() != "") {
		updateNewTripButtonName();
	}
	var filterArray;
	if (code != "") {
		var $obj = $(obj);
		var marketList = markets[code];
		var bookingType = "F";
		var bookingTypes = "F";
		filterArray = [];
		var fpoMarketList = null;

		for (var i = 0, j = marketList.length; i < j; i++) {
			var stationCode = marketList[i];
			var stationObj = stations[stationCode];

			if (bookingTypes === "F") {
				filterArray.push(stationObj);
				if (stationObj.Aliases != null && stationObj.Aliases.length > 0) {
					for (var k = 0; k < stationObj.Aliases.length; k++) {
						var aliasStationObj = stations[stationObj.Aliases[k]];
						filterArray.push(aliasStationObj);
					}
				}
			}
		}
	}

	if (filterArray)
		filterArray = filterArray.sort(stationNameSort);

	populateStation(obj, filterArray);
}

function stationNameSort(a, b) {
	if (a.Name > b.Name) {
		return 1;
	} else {
		return -1;
	}
}

var createArray = function (elem, array) {
	dumpTimeArray = $(elem).val().split("','");
	$.each(dumpTimeArray, function (index, value) {
		var val = value.replace("'", "");
		array.push(val);
	});
};


var globalDepartDate = function () { return moment($('#departDateDisplay').datepicker('getDate')); }
var globalReturnDate = function () { return moment($('#returnDateDisplay').datepicker('getDate')); }


var pouplateCalendar = function (search) {

	// Setup Departure and Return Datepickers
	var dayNameLabels = [],
		monthOptionLabels = [];
	createArray("#js_days", dayNameLabels);
	createArray("#js_months", monthOptionLabels);
	var today = new Date();
	var yearFromToday = new Date();
	yearFromToday.setFullYear(today.getFullYear() + 1);
	var yearBeforeToday = new Date();
	yearBeforeToday.setFullYear(today.getFullYear() - 1);
	var dates = $("#departDate,#returnDate,#salesDate, #departDateDisplay,#returnDateDisplay,#salesDateDisplay").datepicker({
		numberOfMonths: 2,
		dateFormat: 'MM dd yy',
		monthNames: monthOptionLabels,
		dayNamesMin: dayNameLabels,
		//minDate: isRezAgent === "TRUE" ? yearBeforeToday : today,
		minDate: today,
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

            } else if (this.id === 'departDateDisplay') {
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

            } else if (this.id === 'returnDateDisplay') {
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
			if (!window.matchMedia) return;
			var mq = window.matchMedia("(max-width: 767px)");

			if (mq.matches) {
				$(this).datepicker("option", "numberOfMonths", [2, 1]);
			} else {
				$(this).datepicker("option", "numberOfMonths", 2);
			}
		},
		onSelect: function (selectedDate) {
			if (this.id == "departDateDisplay") {
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

				$("#salesDateDisplay").datepicker("option", "minDate", yearBeforeToday);
				$("#salesDateDisplay").datepicker("option", "maxDate", date);

				//salesDateCal.not(this).datepicker("option", "minDate", date);
                var nextDate = dates.not(this).first().datepicker("getDate");
                console.log('next date');
                console.log(nextDate);

                console.log('date');
                console.log(date);
                
				if (!nextDate || date > nextDate) {
					//dates.not(this).datepicker("setDate", date);
				}
				//Check if mask and front display have different values
			}

			if ((($("#Optional-Booking-Calculator").text() != "")) && (departuredate != $("#departDateDisplay").val() || returndate != $("#returnDateDisplay").val() || salesdate != $("#salesDateDisplay").val())) {

				updateNewTripButtonName();
				departuredate = $("#departDateDisplay").val();
				returndate = $("#returnDateDisplay").val();
				salesdate = $("#salesDateDisplay").val();
			}
			else {
				departuredate = $("#departDateDisplay").val();
				returndate = $("#returnDateDisplay").val();
				salesdate = $("#salesDateDisplay").val();

			}
			DepartReturnDateChangeCheck();
			$("#bookingSearchButton").focus();
		}
	});

	$("#departDate").datepicker("option", "maxDate", '+1y');
	$("#departDateDisplay").focus(function () {
		$("#departDateDisplay").datepicker("show");
		$("#ui-datepicker-div").show();
	});

	$("#returnDate").datepicker("option", "maxDate", '+1y');
	$("#returnDateDisplay").focus(function () {
		$("#returnDateDisplay").datepicker("show");
		$("#ui-datepicker-div").show();
	});

	$("#salesDate").datepicker("option", "maxDate", '+1y');
	$("#salesDateDisplay").focus(function () {
		$("#salesDateDisplay").datepicker("show");
		$("#ui-datepicker-div").show();
	});
	$("#bookingSearchButton, #DropDownDest").focus(function () {
		$("#ui-datepicker-div").hide();
	});

};

var DepartReturnDateChangeCheck = function () {
	var actualdepartDate = $("#departDateDisplay").val();
	actualdepartDate = actualdepartDate.substring(0, actualdepartDate.indexOf(','));
	var actualreturnDate = $("#returnDateDisplay").val();
	actualreturnDate = actualreturnDate.substring(0, actualreturnDate.indexOf(','));

	var actualSalesDate = $("#salesDateDisplay").val();
	actualSalesDate = actualSalesDate.substring(0, actualSalesDate.indexOf(','));

	if (actualdepartDate != "")
		$("#departDateDisplay").val(actualdepartDate);
	if (actualreturnDate != "")
		$("#returnDateDisplay").val(actualreturnDate);

	if (actualSalesDate != "")
		$("#salesDateDisplay").val(actualSalesDate);

	if (actualreturnDate != "" || actualreturnDate != "")
		$("#refreshbtn").show();

};

//Show hide optional services Widget
function ShowHideWidget(showtype) {
	FixPlaceHolderIssue();
	analyticsEvent("Optional Services", "Bag-o-tron", "Start Over");
	$("#bookingSearchButton").text($("#bookingSearchButtonText").text());
	$("#manageSearchButton").text($("#bookingSearchButtonText").text());

	//if (isRezAgent === "TRUE") {
	//	ClearValues();
	//	ShowSearchWidget();
	//	return;
	//}

	switch (showtype) {
		case "main":
			ShowMainWidget();
			ClearValues();
			break;
		case "search":
			ShowSearchWidget();
			break;
		case "reservation":
			ShowReservationWidget();
			break;
		default:
			$("#Optional-bags-Manage").hide();
			$("#Optional-bags-Calculator").show();
			$("#Optional-bags-Booking").hide();
			$("#optional_bagprices").html('');
			ClearValues();
			break;
	}

	var optionalValidator = new Validator();
	optionalValidator.hideBubble();
}

//Agent related changes
function AgentDisplayChanges() {
	//ShowSearchWidget();
	ClearValues();
	$("#redeemMiles").attr("checked", true);
	$("#redeemMiles").val("true");
	$("#redeemMiles").attr("readonly", true);
	$("#redeemMiles").attr("disabled", true);
	$("#promoCode").css("visibility", "hidden");
	//$("#depRetNote").hide();
	//$("#agentConfirmationSearch").show();
	//$("#agentConfirmationSearch").addClass("agentSearch");
}

function HideFreeSpiritPurchase() {
	$("#fsPurchaseTable").css("visibility", "hidden");
}

//Show Search Widget
function ShowSearchWidget() {
	$("#Optional-bags-Manage").hide();
	$("#Optional-bags-Calculator").hide();
	$("#Optional-bags-Booking").show();
}

//Show Search Widget
function ShowReservationWidget() {
	$("#Optional-bags-Manage").show();
	$("#Optional-bags-Calculator").hide();
	$("#Optional-bags-Booking").hide();
}
//Show Search Widget
function ShowMainWidget() {
	$("#Optional-bags-Manage").hide();
	$("#Optional-bags-Calculator").show();
	$("#Optional-bags-Booking").hide();
	$("#hidTemp").click();
	$("#optional_bagprices").html('');
}

//Clear Search Values
function ClearValues() {
	$("#OptionalServices_ConfirmationCode").val('');
	$("#OptionalServices_LName").val('');
	$('#DropDownOrign').setSelectByValue("");
	$('#DropDownDest').setSelectByValue("");
	$('#departDateDisplay').val("");
	$('#returnDateDisplay').val("");
	$('#departDate').val("");
	$('#returnDate').val("");
	$('#paxAdults').val(1);
	$('#paxMinors').val(0);
	$('#birthdates').val("");
	$('#lapoption').val("");
	$('#paxInfants').val("0");
	$("#birthDatesArea").empty();
	$('#salesDate').val("");
	$('#salesDateDisplay').val("");
	$('#agent_OptionalServices_ConfirmationCode').val("");
	$("#optional_bagprices").html('');
	var optionalValidator = new Validator();
	optionalValidator.hideBubble();
	childBirthDates = [];
	childLapOption = [];
}

function VerifyTrip() {

	var from, to, departDate, toDate;
	var retVal = true;

	//oneWay and roundtrip
	from = stationFrom();
	to = stationTo();
	departDate = new Date(ToENStringDate($("#departDateDisplay").val()));
	toDate = new Date(ToENStringDate($("#returnDate").val()));

	//toDate isnt set on one way so may have invalid value
	if ($('#journeyOneWay').prop('checked') == true) toDate = '';

	retVal = validateCityPairRules(from, to, departDate, toDate);
	return retVal;
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
//Display Bag Prices
function DisplayBagPrices(showtype, event) {

	var ajaxUrl = "BaggageCalculator.aspx";
	var dataParams = {};

	switch (showtype) {
		case "search":
			if (!ValidateOptionalForm(showtype))
				return true;

			var origin = $('#DropDownOrign').val();
			var destination = $('#DropDownDest').val();
			var departDate = "";
			if ($('#departDateDisplay').val() != null && $('#departDateDisplay').val() != "" && $('#departDateDisplay').val() != "")
				departDate = SelectionDateFormat($('#departDateDisplay').datepicker("getDate"));

			var returnDate = "";

			var agentOptionalServicesConfirmationCode = $('#agent_OptionalServices_ConfirmationCode');

			if ($('#returnDateDisplay').val() != null && $('#returnDateDisplay').val() != "" && $('#returnDateDisplay').val() != "")
				returnDate = SelectionDateFormat($('#returnDateDisplay').datepicker("getDate"));

			var numAdults = $('#paxAdults').val();
			var numMinors = $('#paxMinors').val();
			var promo = $('#promoCode').val();
			var redeemMiles = $('#redeemMiles').is(":checked");
			var birthdates = $('#birthdates').val();
			var lapoption = $('#lapoption').val();
			var numInfants = $('#paxInfants').val();
			var fsNumber = $('#fsMemberEmail').val();

			dataParams = {
				'From': origin,
				'To': destination,
				'DepartureDate': departDate,
				'ReturnDate': returnDate,
				'SalesDate': "",
				'Adults': numAdults,
				'Minors': numMinors,
				'Promo': promo,
				'RedeemMiles': redeemMiles.toString(),
				'birthdates': birthdates,
				'lapoption': lapoption,
				'Infants': numInfants,
				'AwardNumber': fsNumber
			};


			//if (isRezAgent === "TRUE") {
			//	if (agentOptionalServicesConfirmationCode != undefined && $(agentOptionalServicesConfirmationCode).val() != "") {
			//		dataParams = {
			//			PNR: $(agentOptionalServicesConfirmationCode).val()
			//		};
			//	} else {
			//		if ($('#salesDateDisplay').val() != null && $('#salesDateDisplay').val() != "" && $('#salesDateDisplay').val() != "")
			//			dataParams.SalesDate = SelectionDateFormat($('#salesDateDisplay').datepicker("getDate"));
			//	}
			//}

			if (agentOptionalServicesConfirmationCode != undefined && $(agentOptionalServicesConfirmationCode).val() == "") {
				if (!VerifyTrip()) {
					$("#cityPairMessage:visible").text($("#cityPairMessage:visible").text().replace("Schedules", "Price"));
					$("#optional_bagprices").html('');
					return;
				}
			}
			window.location.href = "#Fare-Price";
			break;
		case "reservation":
			if (!ValidateOptionalForm(showtype))
				return true;

			var pnr = $("#OptionalServices_ConfirmationCode").val();
			var lastName = $("#OptionalServices_LName").val();
			dataParams = {
				'PNR': pnr,
				'LName': lastName
			};
			window.location.href = "#New-Fare-Price";
			break;
	}

	blockPage();

	$.get(ajaxUrl, dataParams, function (data) {
		$("#optional_bagprices").html(data);
		if (showtype == "reservation") {
			if ($("#baggageCalAjaxResult").val() === "false") {
				$('#namePnrMismatch').modal();
			}
		}
		if ($("#baggageCalAjaxHasJourney").val() === "false") {
			$('#cancelledFlightsMessage').modal();
			$("#optional_bagprices").html('');
		}

		unBlockPage();
	}, 'html');
	
}

function SelectionDateFormat(selectionDate) {
	return selectionDate.getMonth() + 1 + "/" + selectionDate.getDate() + "/" + selectionDate.getFullYear();
}

//Validation optional Services
function ValidateOptionalForm(showtype) {
	var optionalValidator = new Validator();
	switch (showtype) {
		case "search":
			var origin = $('#DropDownOrign');
			var destination = $('#DropDownDest');
			var departDate = $('#departDateDisplay');
			var returnDate = $('#returnDateDisplay');


			//if (isRezAgent === "TRUE") {

			//var salesDateDisplay = $('#salesDateDisplay');
			//var agentOptionalServicesConfirmationCode = $('#agent_OptionalServices_ConfirmationCode');

			//if (((origin == undefined || $(origin).val() == "") && (destination == undefined || $(destination).val() == "")
			//	&& (departDate == undefined || $(departDate).val() == "") && (salesDateDisplay == undefined || $(salesDateDisplay).val() == "") &&
			//	(agentOptionalServicesConfirmationCode == undefined || $(agentOptionalServicesConfirmationCode).val() == ""))
			//	|| (((origin != undefined && $(origin).val() != "") || (destination != undefined && $(destination).val() != "")
			//	|| (departDate != undefined && $(departDate).val() != "") || (salesDateDisplay != undefined && $(salesDateDisplay).val() != "")) &&
			//	(agentOptionalServicesConfirmationCode != undefined && $(agentOptionalServicesConfirmationCode).val() != ""))) {
			//	ClearValues();
			//	optionalValidator.displayBubble($(origin), agentSearchValidation);
			//	return false;
			//}

			//if ((origin == undefined || $(origin).val() == "") && (agentOptionalServicesConfirmationCode != undefined && $(agentOptionalServicesConfirmationCode).val() == "")) {
			//	optionalValidator.displayBubble($(origin), originRequired); return false;
			//}
			//if ((destination == undefined || $(destination).val() == "") && (agentOptionalServicesConfirmationCode != undefined && $(agentOptionalServicesConfirmationCode).val() == "")) {
			//	optionalValidator.displayBubble($(destination), destinationRequired); return false;
			//}
			//if ((departDate == undefined || $(departDate).val() == "") && (agentOptionalServicesConfirmationCode != undefined && $(agentOptionalServicesConfirmationCode).val() == "")) {
			//	optionalValidator.displayBubble($(departDate), departureDateRequired); return false;
			//}
			//if ((salesDateDisplay == undefined || $(salesDateDisplay).val() == "") && (agentOptionalServicesConfirmationCode != undefined && $(agentOptionalServicesConfirmationCode).val() == "")) {
			//	optionalValidator.displayBubble($(salesDateDisplay), joureySalesDateReqMes); return false;
			//}

			//if((origin == undefined || $(origin).val() == "") && (destination == undefined || $(destination).val() == "")
			//	&& (departDate == undefined || $(departDate).val() == "") && (salesDateDisplay == undefined || $(salesDateDisplay).val() == "") &&
			//	(agentOptionalServicesConfirmationCode != undefined || $(agentOptionalServicesConfirmationCode).val() != "")) {
			//
			//	if (!validateConfirmationCode(document.getElementById("agent_OptionalServices_ConfirmationCode"))) {
			//		optionalValidator.displayBubble($(agentOptionalServicesConfirmationCode), confirmationCodeFormatCheck); return false;
			//	}
			//}

			//}
			//else {
			if (origin == undefined || $(origin).val() == "") {
				optionalValidator.displayBubble($(origin), originRequired); return false;
			}
			if (destination == undefined || $(destination).val() == "") {
				optionalValidator.displayBubble($(destination), destinationRequired); return false;
			}
			if (departDate == undefined || $(departDate).val() == "") {
				optionalValidator.displayBubble($(departDate), departureDateRequired); return false;
			}

			if (stations[$(origin).val()].IsInternational || stations[$(destination).val()].IsInternational) {
				if ((returnDate == undefined || $(returnDate).val() == "") && $.cookie('internationalPopup') != 'true') {
					$.cookie('internationalPopup', 'true');
					$("#error_msg_confirm").show();
					optionalValidator.displayBubble($(origin), internationalMsg); return false;
				}
			}

			//}

			break;
		case "reservation":
			var pnr = $("#OptionalServices_ConfirmationCode");
			var lastName = $("#OptionalServices_LName");
			if (lastName == undefined || $(lastName).val() == "") {
				optionalValidator.displayBubble($(lastName), lastNameRequired); return false;
			}
			if (!validateConfirmationCode(document.getElementById("OptionalServices_ConfirmationCode"))) {
				optionalValidator.displayBubble($(pnr), confirmationCodeFormatCheck); return false;
			}
			if (pnr == undefined || $(pnr).val() == "") {
				optionalValidator.displayBubble($(pnr), confirmationCodeRequired); return false;
			}
			break;
	}
	optionalValidator.hideBubble();
	return true;
}
$('body').on('click', '.howtoFind', function (event) {
	event.preventDefault();  //prevent the default action of the link
	var $this = $(this),
		$popup = $this.next("div[id^='howtoFind'] > div");
	console.log('popup' + $popup);
	$("#confirmation_tabs li:first").click();
	if (!$popup.is(':visible')) {
		$("#howtoFind").modal();

		function closeStopsLink(event) {
			if (!$(event.target).parents('#confirmation_tabs').length && !$(event.target).parents('#howtoFind').length && $(event.target).hasClass('ui-dialog').length) {
				event.preventDefault();
				$popup.hide();
				$(document).unbind('click', closeStopsLink);
			}
		}
		setTimeout(function () {
			$(document).bind('click', closeStopsLink);
		}, 100);
	}
});
$('body').on('click', '.ui-widget-overlay', function () {
	$('#howtoFind').modal('hide');
});
$('body').on('click', '#confirmation_tabs li', function () {
	var content = $(this).attr('rel');
	$(this).parent().find('li').removeClass('active');
	$(this).addClass('active');
	$('#howtoFind .tab_section').addClass('hidden');
	$('#' + content).removeClass('hidden');
});

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
$('body').on('click', 'a.other', function () {
	var j = $('a.other').attr("tabindex");
	$("html").find("#optional-others a, #optional-others ul, div.closeBtn").each(function () {
		if ($(this).prop("tagName").toLowerCase() == 'a' || $(this).prop("tagName").toLowerCase() == 'ul' || $(this).prop("tagName").toLowerCase() == 'div') {
			$(this).attr("tabindex", j);
			$(this).keydown(function (event) {
				var keyCode = (event.keyCode ? event.keyCode : event.which);
				if (keyCode == 13) {
					$(this).click();
				}
			});
		}
	});
});
$('body').on('click', 'a.membership', function () {
	var j = $('a.other').attr("tabindex");
	$("html").find("#optional-membership a, div.closeBtn").each(function () {
		if ($(this).prop("tagName").toLowerCase() == 'a' || $(this).prop("tagName").toLowerCase() == 'div') {
			$(this).attr("tabindex", j);
			$(this).keydown(function (event) {
				var keyCode = (event.keyCode ? event.keyCode : event.which);
				if (keyCode == 13) {
					$(this).click();
				}
			});
		}
	});
});
$('body').on('click', 'a.seats', function () {
	var j = $('a.other').attr("tabindex");
	$("html").find("#optional-seats a, div.closeBtn").each(function () {
		if ($(this).prop("tagName").toLowerCase() == 'a' || $(this).prop("tagName").toLowerCase() == 'div') {
			$(this).attr("tabindex", j);
			$(this).keydown(function (event) {
				var keyCode = (event.keyCode ? event.keyCode : event.which);
				if (keyCode == 13) {
					$(this).click();
				}
			});
		}
	});
});
$('body').on('click', '#bags_second_section ul', function () {
	var j = $('#bags_second_section ul').attr("tabindex");
	$("html").find("#bags_second_section a, div.closeBtn").each(function () {
		if ($(this).prop("tagName").toLowerCase() == 'a' || $(this).prop("tagName").toLowerCase() == 'div') {
			$(this).attr("tabindex", j);
			$(this).keydown(function (event) {
				var keyCode = (event.keyCode ? event.keyCode : event.which);
				if (keyCode == 13) {
					$(this).click();
				}
			});
		}
	});
});
$('body').on('click', '#bags_third_section ul', function () {
	var j = $('#bags_third_section ul').attr("tabindex");
	$("html").find("#bags_third_section a, div.closeBtn").each(function () {
		if ($(this).prop("tagName").toLowerCase() == 'a' || $(this).prop("tagName").toLowerCase() == 'div') {
			$(this).attr("tabindex", j);
			$(this).keydown(function (event) {
				var keyCode = (event.keyCode ? event.keyCode : event.which);
				if (keyCode == 13) {
					$(this).click();
				}
			});
		}
	});
});
$('body').on('click', '#other_second_section ul, #other_third_section ul, #other_forth_section ul, #other_fifth_section ul, #other_sixth_section ul', function () {
	var j = $('#other_second_section ul, #other_third_section ul, #other_forth_section ul, #other_fifth_section ul, , #other_sixth_section ul').attr("tabindex");
	$("html").find("#other_second_section a, #other_third_section a, #other_forth_section a, #other_fifth_section a, , #other_sixth_section a, div.closeBtn").each(function () {
		if ($(this).prop("tagName").toLowerCase() == 'a' || $(this).prop("tagName").toLowerCase() == 'div') {
			$(this).attr("tabindex", j);
			$(this).keydown(function (event) {
				var keyCode = (event.keyCode ? event.keyCode : event.which);
				if (keyCode == 13) {
					$(this).click();
				}
			});
		}
	});
});
function CloseBtnFun() {
	$(this).parent().hide();
	$("a.blurb-icon.active").focus();
	$("a.blurb-icon").removeClass('active');
}

//adults, children, birthdates & lapoptions
var childBirthDates = [];
var childLapOption = [];
var minorDialogClosed = false;

var $paxAdults,
	$paxMinors,
	$paxInfants,
	$lapoption,
	$birthdates,
	adultLabels,
	childLabels,
	childLabel,
	monthOptionLabels,
	monthData,
	yearData,
	dayData;

var adults = function () { return Number($("#paxAdults").val()); };
var children = function () { return Number($("#paxMinors").val()); };



$(document).ready(function () {
	$('[data-toggle="popover"]').popover({
		content: function () {
			// Get the content from the hidden sibling.
			return $(this).siblings('.my-popover-content').html();
		},
		animation: false,
		placement: 'right',
		container: 'body',
		trigger: 'click',
		html: true
	}).on('show.bs.popover', function (evntShow) {
		$('.popover').popover('hide');
	});

	$('[data-toggle="tab"]').on('show.bs.tab',
		function (e) {
			$('.popover').popover('hide');
		});

	adultLabels = PageModel.adultOptionLabels;
	childLabels = PageModel.childOptionLabels;
	childLabel = PageModel.childLabel;
	monthOptionLabels = PageModel.monthOptionLabels;

	$paxAdults = $("#paxAdults");
	$paxMinors = $("#paxMinors");
	$paxInfants = $("#paxInfants");
	$lapoption = $("#lapoption");
	$birthdates = $("#birthdates");

	// Initialize Adult/Children Drop Downs
	var adultSelect = document.getElementById('paxAdults');
	var adultFrag = document.createDocumentFragment();
	for (var i = 1, j = adultLabels.length; i < j; i++) {
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

	$paxAdults.setSelectByValue('1');

	monthData = (function () {
		var array = [];
		var data = monthOptionLabels;
		for (var i = 0, j = data.length; i < j; i++) {
			var txt = data[i];
			array.push({ key: i, value: txt });
		}
		return array;
	})();
	dayData = (function () {
		var array = [];
		for (var i = 1; i <= 31; i++) {
			array.push({ key: i, value: i });
		}
		return array;
	})();
	yearData = (function () {
		var array = [];
		for (var i = (new Date()).getFullYear(), j = i - 18; i >= j; i--) {
			array.push({ key: i, value: i });
		}
		return array;
	})();

	populateBirthdateFields();

	// Add/Remove options from Adults and Children drop-downs by
	$('#paxAdults,#paxMinors').change(function () {
		AdjustPaxNumbers();
	});

	function AdjustPaxNumbers() {
		var tmpAdults = adults();
		var tmpChildren = children();
		var pax = tmpAdults + tmpChildren;
		var max = 9;
		var adultMax = (max - tmpChildren);
		var minorMax = (max - tmpAdults);

		$paxAdults.children().remove();
		$paxMinors.children().remove();

		var adultSelect = document.getElementById('paxAdults');
		var adultFrag = document.createDocumentFragment();
		for (var i = 1, j = (max + 1), k = adultLabels.length; i < j; i++) {
			var txt = adultLabels[i];
			var opt = document.createElement("option");
			opt.value = i;
			opt.appendChild(document.createTextNode(txt));
			if (i == tmpAdults) {
				opt.selected = true;
			}
			adultFrag.appendChild(opt);
			if (i >= adultMax) {
				break;
			}
		}
		adultSelect.appendChild(adultFrag);

		var childSelect = document.getElementById('paxMinors');
		var childFrag = document.createDocumentFragment();
		for (var i = 0, j = (max + 1), k = childLabels.length; i < j; i++) {
			var txt = childLabels[i];
			var opt = document.createElement("option");
			opt.value = i;
			opt.appendChild(document.createTextNode(txt));
			if (i == tmpChildren) {
				opt.selected = true;
			}
			childFrag.appendChild(opt);
			if (i >= minorMax) {
				break;
			}
		}
		childSelect.appendChild(childFrag);

		$paxAdults.children('[value="0"]').remove();
		if (tmpAdults == 0) {
			$paxAdults.setSelectByValue('1');
		}
	}

	$('#childBirthDates').on('hidden.bs.modal', MinorDialogClosed);
	$('#childBirthDates').on('hide.bs.modal', MinorDialogClosing);


	$("#childBirthDates").find("button").click(function () {
		minorDialogClosed = true;
		$("#childBirthDates").modal('hide');
	});

	$("#fsMemberContinue").click(function () {
		$('#freeSpiritAwardNumber').modal('hide');
		DisplayBagPrices('search', this);
		return true;
	});

	$("#closeFSPopup").click(function () {
		$('#freeSpiritAwardNumber').modal('hide');
		return true;
	});

	var originalAwardSubmitText = null;

	$("#fsMemberRetrieve").click(function (event) {
		var clickedButton = $(this);
		if (originalAwardSubmitText == null) {
			originalAwardSubmitText = clickedButton.text();
		}
		var collectFSnumber = $("#fsActualNumber").val();
		blockPage();
		//if (FsNumberAwardBooking.processForm(this)) {
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
		//} else {
		//	ClearAwardSearch();
		//}
		unBlockPage();
	});

	function ClearAwardSearch() {
		$("#fsMemberNumber").val("");
		$("#fsActualNumber").val("");
		$("#fsMemberContinue").attr("data-fsmemberprovided", "false");
		$("#fsMemberResponseData, #fsMemberContinue").hide();

	}
});

// FS number for award booking
var FsNumberAwardBooking = new Validator("#fsAward_msg_bubble");
FsNumberAwardBooking.addField("headerEmail", [
	{ "fn": validateRequired, "msg": PageModel.headerEmailRequired },
	{ "fn": validateEmailConditionally, "msg": PageModel.headerEmailFormat },
	{ "fn": validateFSNumberConditionally, "msg": PageModel.headerFSNumberFormat }
]);

function populateBirthdateFields() {
	// Month Selects
	pushDataToSelects($("select.month"), monthData);
	// Day Selects
	pushDataToSelects($("select.day"), dayData);
	// Year Selects
	pushDataToSelects($("select.year"), yearData);
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

function AdjustDaysOfTheMonth(controlID, month, year) {
	//Calculate exact number of day's in a month
	correctDaysInMonth = 32 - new Date(year, month, 32).getDate();
	//console.log('exact Dates : ' + controlID + ' : ' + +correctDaysInMonth);
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

$('#closeButton_Lapchild').click(function () {
	$('#lapchildMismatch').modal('hide');
});

$("#closePopup").click(function () {
	$('#childBirthDates').modal('hide');
});

function closeSixDay() {
	$('#childSixDay').modal('hide');
}

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

var isInternationalFlight = function () {
	var from = stationFrom();
	var to = stationTo();

	if ((from && from != "" && stations[from].IsInternational == true) || (to && to != "" && stations[to].IsInternational == true)) {
		return true;
	}
	return false;
};

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

function VerifyBirthDates() {
	for (var i = 0; i < childBirthDates.length; i++) {

		var departDate = new Date($('#departDateDisplay').datepicker("getDate"));

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

function ChildDateChange(object) {
	var childNum = Number(object.attr("id").replace("child_", "").replace("_month", "").replace("_day", "").replace("_year", ""));
	var month = Number($("select#child_" + childNum + "_month").val());
	var day = Number($("select#child_" + childNum + "_day").val());
	var year = Number($("select#child_" + childNum + "_year").val());

	//Adjust number of days depending on Days and Month
	AdjustDaysOfTheMonth("select#child_" + childNum + "_day", month, year);

	if (month >= 0 && day > 0 && year > 0) {
		var bdate = new Date(year + 2, month, day);

		var dep = $("#departDateDisplay").val();
		var ret = $("#returnDateDisplay").val();
		var checkDate = new Date(ToENStringDate($("#departDateDisplay").val()));

		if ($("#returnDateDisplay").val() != "") {
			checkDate = new Date(ToENStringDate($("#returnDateDisplay").val()));
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

function VerifyRezAgent() {
	var fsMemberProvided = $("#fsMemberContinue").attr("data-fsmemberprovided");
	if (isRezAgent === "TRUE" && fsMemberProvided == "false") {
		$("#freeSpiritAwardNumber").modal();// We can't wait here, so we have to pop this and return false
		return false;
	}
	DisplayBagPrices('search', this);
	return true;

};

function VerifyMinors() {
	// validate trip selects prior to proceeding
	if (!ValidateOptionalForm('search'))
		return true;

	if (adults() == 0 && children() > 0) {

		if (childBirthDates.length == children()) {
			// Check for minors under 5
			var underFiveYrs = false;
			var over15Yrs = false;
			// var fiveYearsOld = (1000 * 60 * 60 * 24 * 365 * 5);
			// var fifteenYearsOld = (1000 * 60 * 60 * 24 * 365 * 15);
			//Child compare Date should be on Date of Departure rather than Booking Date
			var departDate = SelectionDateFormat($('#departDateDisplay').datepicker("getDate"));

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

			//// Display Minor not alllowed popup if its International flight
			//if (isInternationalFlight() && !over15Yrs) {
			//	//console.log("isInternationalFlight() is true");
			//	$('#unaccompaniedMinorNotAllowed').dialog({ modal: true, width: '400px' }); // Show international popup error
			//	return false;
			//}

			// Display child under 5 popup if date of birt is  under five yrs
			//if (underFiveYrs && !over15Yrs) {
			//	$('#childUnder5').dialog({ modal: true, width: '440px' }); // Show under 5 problem
			//	childBirthDates = []; // clear the birth dates for them to try again
			//	childLapOption = [];
			//	return false;
			//}

			//// Display unaccompanied minor fee popup
			//if ((!underFiveYrs && !over15Yrs) && !minorFeeAccepted) {
			//	$('#unaccompaniedMinorAccept').dialog({ modal: true, width: '420px' }); // Show minor Fee Acceptence popup
			//	return false;
			//}
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
		$("#childBirthDates").find("p[class='actions']").css("display", "none");
		$("#childBirthDates").modal(); // We can't wait here, so we have to pop this and return false
		$("ul#birthDatesArea li").show();
		return false;
	}
	return true;
};

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
			if (ValidateBirthDates() && VerifyBirthDates())
				//DisplayBagPrices('search', this);
				VerifyRezAgent();
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

function MinorDialogClosing() {
	$("#paxInfants").val($("input[id$='_lapChild']:checked").length);
	return true;
}

function CollectChildrenInformation() {
	//console.log("submitting!!!");
	//console.info(event.target);
	if (children() > 0) {
		if (!VerifyMinors()) { loadPlaceholders(); return; }
		//if (!VerifyBirthDates()) { loadPlaceholders(); return; }
	}
	else {
		if (!VerifyRezAgent()) { loadPlaceholders(); return; }
		//DisplayBagPrices('search', this);
	}
	return;
}

