(function () {
	'use strict';
	/**
    *  Extended String Object Methods
    */
	if (!String.prototype.ltrim) {
		String.prototype.ltrim = function () {
			return this.replace(/^\s\s*/, '');
		};
	}
	if (!String.prototype.rtrim) {
		String.prototype.rtrim = function () {
			return this.replace(/\s\s*$/, '');
		};
	}
	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		};
	}
	if (!String.prototype.startsWith) {
		String.prototype.startsWith = function (strVal) {
			return (this.match("^" + strVal) == strVal);
		};
	}
	if (!String.prototype.equalsIgnoreCase) {
		String.prototype.equalsIgnoreCase = function (strVal) {
			return (this.toLowerCase() === strVal.toLowerCase());
		};
	}

	/**
    *   Extended Date Object Methods
    */
	if (!Date.prototype.isLeapYear) {
		Date.prototype.isLeapYear = function () {
			var year = this.getFullYear();
			return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
		};
	}
	if (!Date.prototype.getYearsOfAge) {
		Date.prototype.getYearsOfAge = function () {
			return Math.floor(((new Date()).getTime() - this.getTime()) / 315576E5);
		};
	}
	if (!Date.prototype.isChild) {
		Date.prototype.isChild = function () {
			return (this.getYearsOfAge() <= 14);
		};
	}
	if (!Date.prototype.isLapChild) {
		Date.prototype.isLapChild = function () {
			return (this.getYearsOfAge() <= 2);
		};
	}
	/**
    *   Extended Array Object Methods
    */
	if (!Array.prototype.filter) { // Polyfill from MDN
		Array.prototype.filter = function (fun /*, thisp */) {
			if (this === void 0 || this === null)
				throw new TypeError();

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== "function")
				throw new TypeError();

			var res = [];
			var thisp = arguments[1];
			for (var i = 0; i < len; i++) {
				if (i in t) {
					var val = t[i]; // in case fun mutates this
					if (fun.call(thisp, val, i, t))
						res.push(val);
				}
			}

			return res;
		};
	}

	// Dummy object for console object within Webkit and Gecko
	if (!window.console) {
		window.console = {
			timeQueue: {},
			log: function (txt) { /* alert(txt); */ },
			time: function (key) { this.timeQueue[key] = new Date(); },
			timeEnd: function (key) {
				this.log(key + ": " + parseInt(new Date() - this.timeQueue[key]) + "ms");
			}
		};
	}

	// Cache document object for performance
	if (!window._document) {
		window._document = document;
	}

	// For storing variables off of the global scope
	if (!window.PageModel) {
		window.PageModel = {};
	}




	if (!window.checkEnter) {
		window.checkEnter = function (event, idRef) {
			var c = (c) ? c : ((event) ? event : null);
			var d = (c.target) ? c.target : ((c.srcElement) ? c.srcElement : null);
			if ((c.keyCode == 13)) {
				var e = $('#' + idRef);
				if (e.length) {
					var g = e.attr('onclick');
					var h = e.attr('href');
					var i = true;
					if (g != null) {
						var f = typeof (g) == 'function' ? g : new Function(g);
						i = f.apply(e[0]);
					}

					if (h != null) {
						i && eval(h);
					}
				}
				c.cancelBubble = true;
			}
		};
	}
	// moved to qubit qubitTag.cs to generate with qubit tag
	//if (typeof (window.universal_variable) === "undefined") {
	//    window.universal_variable = [];
	//    window.universal_variable.events = [];
	//}
})();

window['GoogleAnalyticsObject'] = 'ga';
window['ga'] = window['ga'] || function () {
	(window['ga'].q = window['ga'].q || []).push(arguments);
};

if (typeof analyticsEvent != 'function') {
	function analyticsEvent() {; }
};

var CookieHelper = {
	create: function (key, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toGMTString();
		}
		document.cookie = key + "=" + value + expires + "; path=/";
	},
	read: function (key) {
		var index = key + "=";
		var ca = document.cookie.split(';');
		for (var i = 0, j = ca.length; i < j; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(index) == 0) return c.substring(index.length, c.length);
		}
		return null;
	},
	erase: function (key) {
		this.create(key, "", -1);
	}
};


function blockPage(selector) {
	var id = selector || "#waitMessage";
	if ($(id).length == 0) return;
	$(id).modal({ backdrop: 'static', keyboard: false });

	if (id == "#waitMessage") {
		ieFixForProgressBar();

		var loadingText = $(id).find("p").first();
		loadingText.hide();
	}
}
function unBlockPage(selector) {
	var id = selector || "#waitMessage";
	if ($(id).length == 0) return;
	$(id).modal("hide");
}

var defaultModalPosition = { my: "center", at: "center", of: window };
var defaultMobileModalPosition = { my: "right", at: "right", collision: "fit", of: window };

function GetDefaultModalPosition() {
	if (IsMobileSpirit()) {
		return defaultMobileModalPosition;
	} else {
		return defaultModalPosition;
	}
}
function IsMobileSpirit() {
	//var mq = window.matchMedia('@media all and (max-width: 760px)');
	var retVal = false;
	try {
		if (window.matchMedia != null) {
			var mq = window.matchMedia('only screen and (max-width: 768px)');
			if (mq.matches) {
				retVal = true;
			} else {
				retVal = false;
			}
		} else {
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				retVal = true;
			} else {
				retVal = false;
			}
		}
	} catch (e) { }

	if (retVal) {
		defaultModalPosition = defaultMobileModalPosition;
	}
	return retVal;
}

function SessionExpired() {
	// window.location.href = "SessionExpired.aspx";
	$("#sessionTimeOutPrompt").hide();
	// Bug # 12209
	$(".primary.button").unbind("click");
	// Bug # 12209 Ends
	$("#sessionTimedOut").show();
	//makeSafe(window.universal_variable.events.push({ 'category': 'SessionTimeOut', 'action': 'SessionTimeOutExpired' }));
	QubitPush('SessionTimeOut', 'SessionTimeOutExpired');

	// window.location.href = "Default.aspx";
}

function QubitPush(category, action) {
	try {
		window.universal_variable = window.universal_variable || [];
		window.universal_variable.events = window.universal_variable.events || [];
		window.universal_variable.events.push({ 'category': category, 'action': action });
	} catch (ex) {
		//  ErrorHandler.Exception(ex);
	}
}

var makeSafe = function (fn) {
	return function () {
		try {
			return fn.apply(this, arguments);
		} catch (ex) {
			//  ErrorHandler.Exception(ex);
		}
	};
};


function WarnUser() {
	try {
		$('#divTimeOutPrompt').show();
		$("#divTimeOutPromptInactive").hide();
		//makeSafe(window.universal_variable.events.push({ 'category': 'SessionTimeOut', 'action': 'SessionTimeOutWarn' }));
		QubitPush('SessionTimeOut', 'SessionTimeOutWarn');
		$("#sessionTimeOutMsg").modal({ backdrop: 'static', keyboard: false });
		//.dialog({
		//         modal: true,
		//         closeOnEscape: false,
		//         dialogClass: 'no_close',
		//         width: 500,
		//         position: GetDefaultModalPosition(),
		//         resizable:false
		//     });
	}
	catch (e) {
		console.log('session warning popup not available');
	}
}

function ResetWebSessionTimeout() {
	clearTimeout(window.userSessionTimeoutID);
	clearTimeout(window.userSessionWarningID);
	window.userSessionTimeoutID = setTimeout('SessionExpired();', TASessiontimeout);
	window.userSessionWarningID = setTimeout('WarnUser();', TAUserSessionWarning);
	$("#sessionTimeOutMsg").modal('hide');
}

window.location.querystring = (function () {
	// The return is a collection of key/value pairs
	var result = {
		toString: function () {
			var querystring = "?";
			for (var key in location.querystring) {
				if (key && key != "toString")
					querystring += key + "=" + location.querystring[key] + "&";
			}
			querystring = querystring.substring(0, querystring.length - 1);
			return querystring;
		}
	};

	// Gets the query string with a preceeding '?'
	var querystring = location.search;

	// document.location.search is empty if a query string is absent
	if (!querystring)
		return result;

	// substring(1) to remove the '?'
	var pairs = querystring.substring(1).split("&");
	var splitPair;

	// Load the key/values of the return collection
	for (var i = 0; i < pairs.length; i++) {
		splitPair = pairs[i].split("=");
		result[splitPair[0]] = splitPair[1];
	}

	return result;
})();

/* global pobject woth months for date formatting */

var dateFormat = {
	monthsEn: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	monthsEs: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
};


/*
Parse the query string into an object and return only the object -
set jQuery.parseQuerystring(); to a variable and access through the variable name using object literal notation.
example: myVariable.someValue
*/
jQuery.extend({
	parseQuerystring: function () {
		var nvpair = (window.location.search === "") ? undefined : {};
		if (nvpair != undefined) {
			var qs = window.location.search.replace('?', '');
			var pairs = qs.split('&');
			$.each(pairs, function (i, v) {
				var pair = v.split('=');
				nvpair[pair[0]] = pair[1];
			});
		}
		return nvpair;
	}
});


function cultureRedirect(cultureCode) {
	$.cookie('cultureCode', cultureCode);
	var qs = window.location.search.substring(1);
	var qslandingpage = window.location.search.substring(1);
	qs = $.encoder.encodeForURL(qs);

	if (qs == "" || qs == undefined) {
		window.location.replace(window.location.protocol + "//" + window.location.hostname + window.location.pathname + "?culture=" + cultureCode);
	}
	else {
		if (qslandingpage.indexOf("special") != -1) {
			if (qslandingpage.indexOf("special") == 0) {
				if (qslandingpage.indexOf("culture") != -1) {
					qslandingpage = qslandingpage.substring(0, qslandingpage.indexOf("culture") - 1);
				}

				window.location.replace(window.location.protocol + "//" + window.location.hostname + window.location.pathname + "?" + qslandingpage + "&culture=" + cultureCode);
			}
		}
		else if (qs.indexOf("culture") != -1) {
			if (qs.indexOf("culture") == 0)
				window.location.replace(window.location.protocol + "//" + window.location.hostname + window.location.pathname + "?" + "culture=" + cultureCode);
			else
				window.location.replace(window.location.protocol + "//" + window.location.hostname + window.location.pathname + "?" + qs.substr(0, qs.indexOf("culture") - 1) + "&amp;culture=" + cultureCode);
		}
		else {
			window.location.replace(window.location.protocol + "//" + window.location.hostname + window.location.pathname + "?" + qs + "&amp;culture=" + cultureCode);
		}
	}
};

var PriceUtil = {
	formatNumber: function (numVal) {
		var strVal = String(numVal),
			valArr = (strVal.indexOf(".") > -1) ? strVal.split(".") : [strVal, "00"];
		//console.log("length: " + valArr[1].length);
		switch (valArr[1].length) {
			case 0:
				valArr[1] = "00";
				break;
			case 1:
				valArr[1] += "0";
			case 2:
				break;
			default:
				{
					var value = (Math.round(numVal * 100)) / 100;
					return PriceUtil.formatNumber(value);
					valArr[1] = valArr[1].substring(0, 2);
				}
		}
		strVal = valArr.join(".");
		//console.log(strVal);
		return strVal;
	}
};

(function (a) {
	(jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
})(navigator.userAgent || navigator.vendor || window.opera);

$(document).ready(function () {
	if ($.browser.msie && $.browser.version === "7.0") {
		var displayMethod = "block";
	} else {
		var displayMethod = "table-row";
	}
	$("#modalContent").bind("dialogopen", function (event, ui) {
		if ($("#modalContent").dialog("isOpen") && jQuery.browser.mobile) {
			$("#modalContent").parent().css("left", "25%");
		}
	});

	if ($("li.dropdown-menu").length > 0) {
		var borderrightcolor = "#385992";
		var borderleftcolor = "#6891D6";
		var fixbordercolor = "#0074cf";
		$("li.dropdown-menu").hover(function () {
			$(this).prev().find("a").css("border-right-color", fixbordercolor);
			$(this).next().find("a").css("border-left-color", fixbordercolor);
		}, function () {
			$(this).prev().find("a").css("border-right-color", borderleftcolor);
			$(this).next().find("a").css("border-left-color", borderrightcolor);
		});
	}
	//$(".more_info").toggle_deprecated(function(event) {
	//       if (event) {
	//           event.preventDefault();
	//       }        
	//       //$(this).attr('title', 'Less Info');
	//       $(this).closest("tr").next().css("display", displayMethod);
	//       $(this).text(PageModel.lessInfo);
	//   }, function(event) {
	//       if (event) {
	//           event.preventDefault();
	//       }
	//       //$(this).attr('title', 'More Info');
	//       $(this).closest("tr").next().css("display", "none");
	//       $(this).text(PageModel.moreInfo);
	//   });

	/***
    * More Information/Less Information behavior
    *
    * @author Anthony Carcelli
    * Handles default setting of PageModel
    * Toggle adds classes to clicked element and tr.info_container
    *
    **/
	$('.more_less').click(function () {

		// Checks that PageModel is set, to keep it from breaking.
		if (!PageModel.lessInfo || !PageModel.moreInfo) setPageModel();

		if ($(this).hasClass('active')) {
			$(this).removeClass('active').html(PageModel.moreInfo);
			$(this).parents('tr').nextAll('tr.info_container:first').children('td').slideUp(200, function () {
				$(this).parent().removeClass('active');
			});
		} else {
			$(this).addClass('active').html(PageModel.lessInfo);
			$(this).parents('tr').nextAll('tr.info_container:first').children('td').slideDown(200, function () {
				$(this).parent().addClass('active');
			});
		}
	});

	var seatsTooltip = $("#unitTipId").detach();
	$(seatsTooltip).appendTo("#deck");

	bindAdjacentText();

	$("p.p_res_summ").each(function () {
		if ($(this).text() == "") {
			$(this).hide();
		}
	});

	$('body').on('hidden.bs.modal', '.modal', function (e) {
		if ($('.modal').hasClass('in')) {
			$('body').addClass('modal-open');
		}
	});
});

/***
* function setPageModel(lessInfo, moreInfo)
*
* @author Anthony Carcelli
* Sets replacement values for PageModel obj
*
**/

function setPageModel(lessValue, moreValue) {
	if (lessValue == null || moreValue == null) {
		PageModel = {
			lessInfo: "Less Info",
			moreInfo: "More Info"
		};
	} else {
		PageModel = {
			lessInfo: lessValue,
			moreInfo: moreValue
		};
	}
}

function getCharCodeFromEvent(evt) {
	var evt = (evt) ? evt : ((event) ? event : null);
	return evt.charCode;
}

// jQuery Tooltip Plugin
(function ($) {
	var methods = {
		init: function (options) {
			return this.each(function () {
				var $this = $(this);
				// Add / Update options
				var data = $this.data('tooltip_opts') || {};
				var req = options || {};
				var fullData = $.extend(data, req);
				$this.data('tooltip_opts', fullData);
				var content = fullData.content ? fullData.content : $this.attr('title') ? "<p>" + $this.attr('title') + "</p>" : "<p></p>";
				var tip = $("<span class='tooltip'><span class='text'></span><span class='arrow'></span></span>").appendTo('body');
				tip.find('.text').html(content);

				// set positioning
				//var pos = $this.

				$this.mouseover(function () {
					tip.show();
				}).mouseout(function () {
					tip.hide();
				});
			});
		},
		option: function (option) {
			return this.each(function () {
				var $this = $(this);
				// Add / Update option
				var data = $this.data('tooltip_opts') || {};
				var req = option || {};
				var fullData = $.extend(data, req);
				$this.data('tooltip_opts', fullData);
			});
		}
	};
	$.fn.tooltip = function (method) {
		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.tooltip');
		}
	};
})(jQuery);

// function to fix progressbar animation issue in IE
function ieFixForProgressBar() {
	if (/MSIE/.test(navigator.userAgent)) {
		var targetParent = $('#submitWait').parent();
		var content = targetParent.html();
		targetParent.html(content);
	}
}
try {
	$.extend($.ui.dialog.prototype.options, {
		resizable: false,
		draggable: false
	});
} catch (ex) { }

// #9750 clicking adjacent text behaviour
function bindAdjacentText() {
	// F+H, F+C, F+H+C page
	var link_element = ["#change_departing_link", "#change_returning_link"],
		popup_element = ["#change_departing_flight", "#change_returning_flight"];

	$.each(link_element, function (index, elem) {
		if ($(elem).length > 0) {
			$("body").delegate(elem, "click", function () {
				if ($(popup_element[index]).length > 0) {
					init($(popup_element[index]));
				}
			});
		}
	});

	var init = function (popup_id) {
		var radio_elem = popup_id.find("input.memberFare"),
			fare_elem = popup_id.find("div.farediv");
		fare_elem.each(function () {
			if ($(this).children("label").index() !== 0 && !$(this).children().is("label")) {
				$(this).wrapInner("<label></label>");
			}
		});
	};

	var checkBoxChecked = function (checkbox) {
		var checkboxClass = $("." + checkbox + ":checked");
		var checkedCheckboxLength = 0;
		checkboxClass.each(function () {
			checkedCheckboxLength += 1;
		});
		if (checkedCheckboxLength > 0) {
			return true;
		} else {
			return false;
		}
	};

	var selectBoxCheck = function (selectBox, otherselectBox) {
		var selectBoxClass = $("." + selectBox + " option:selected");
		var selectBoxChecked = false;
		if ($("." + selectBox).length > 0) {
			selectBoxClass.each(function () {
				var selectedValue = $(this).val();
				if (selectedValue !== "0") {
					selectBoxChecked = true;
				}
			});
		}
		if (!$("." + selectBox).prop("disabled") && $("." + otherselectBox).prop("disabled")) {
			selectBoxChecked = true;
		}
		return selectBoxChecked;
	};

	// Bags page
	if ($("div.bagPrice").length > 0) {
		$('body').on('click', 'div.bagPrice', function () {
			if ($(this).parent().hasClass("priceInputMember") && !checkBoxChecked("priceInputStandardSelect") && !selectBoxCheck("standardBagsAmount", "memberBagsAmount")) {
				$(this).parent().find("div.priceInputMemberMask").click();
			}
			if ($(this).parent().hasClass("priceInputStandard") && !checkBoxChecked("priceInputMemberSelect") && !selectBoxCheck("memberBagsAmount", "standardBagsAmount")) {
				$(this).parent().find("div.priceInputStandardMask").click();
			}
		});
	}

	// Purchase page
	var termscond_id = $("div#acceptTermsCond");
	if (termscond_id.length > 0) {
		if (termscond_id.parent().children().is("input:checkbox") && termscond_id.parent().find(".legend").length > 0) {
			if (!termscond_id.parent().find(".legend").children().is("span.asterisk")) {
				termscond_id.parent().append("<span class='appendeddiv'>" + termscond_id.parent().find(".legend").html() + "</span>");
				var appendeddivwidth = $(".appendeddiv").width() + 65;
				termscond_id.parent().find(".legend").css("width", "auto");
				$(".appendeddiv").remove();
			}
			termscond_id.parent().find(".legend").css("float", "left");
			termscond_id.parent().find(".legend").css("line-height", "26px");
			termscond_id.parent().find(".legend").click(function () {
				termscond_id.click();
			});
		}
	}
}

//Conversen SDK
window.cnvAsyncInit = function () {
	Cnv.init({
		custId: '348',                                                                                       //Experian CCMP CustomerID
		entityId: '100',                                                                   // Table Entity ID – 100 = Customer
		restLink: 'activity.conversen.com',
		enableFacebook: false,                                                                 //Only to be used if Enabling Facebook Tracking
		enableSocialEvents: false                                             //Only to be used if Enabling Social Tracking
	});
};

$.fn.toggle_deprecated = function (arguments) {
	console.error('This .toggle method signature was deprecated in jQuery 1.8 and removed in jQuery 1.9.');
};

$.fn.toggleClick = function () {
	var functions = arguments;
	return this.each(function () {
		var iteration = 0;
		$(this).click(function () {
			functions[iteration].apply(this, arguments);
			iteration = (iteration + 1) % functions.length;
		});
	});
};


//NameSpace for Marketing purposes
var SPIRIT_MKTG = SPIRIT_MKTG || {
	EVENTS: {
		EEtransaction: {
			Products: {
				Flight: {},
				Infant: {}
			}
		},
		EEproductImpression: {
			Impressions: {
				event: function (value) {
					this.event = value;
				},
				currencyCode: function (value) {
					this.currencyCode = value;
				},
				coupon: function (value) {
					this.coupon = value;
				},
				totalPax: function (value) {
					this.totalPax = value;
				},
				totalAdult: function (value) {
					this.totalAdult = value;
				},
				totalChild: function (value) {
					this.totalChild = value;
				},
				totalInfant: function (value) {
					this.totalInfant = value;
				},
				flightTrip: function (value) {
					this.flightTrip = value;
				},

				Flight: [],
				NineFareClub : []

			}

		},
		EEaddToCart: {

		},
		EEcheckout: {

		}
	},
	LOGIC: {
		PopulateImpressions: {
			DaysDifference: function (firstDate, secondDate) {
				var startDay = new Date(firstDate);
				var endDay = new Date(secondDate);
				var millisecondsPerDay = 1000 * 60 * 60 * 24;

				var millisBetween = startDay.getTime() - endDay.getTime();
				var days = millisBetween / millisecondsPerDay;
				return Math.floor(days);
			},
			GetDateOnly: function (myDate) {
				return myDate.getFullYear() + '/' + (myDate.getMonth() + 1) + '/' + myDate.getDate();
			},
			GetFSNumber: function (isLoggedin) {

				if (isLoggedin == "True") {
					var element = $("ul.dropdown-menu li:nth-child(2)").get(0);
					if (typeof element != 'undefined') {
						var text = element.textContent;
						var fsNumber = '';
						if (text.indexOf(':') > 0) {
							fsNumber = text.split(':')[1].trim();
						}
						return fsNumber;
					}
					else {
						return '';
					}
				}
				else {
					return '';
				}
			},
			GetTravelTime: function (travelTime) {
				var hours = 0;
				var minutes = 0;
				for (i = 0; i <= travelTime.length; i++) {
					var lastTime = travelTime.pop();
					hours += parseInt(lastTime.split(':')[0]);
					minutes += parseInt(lastTime.split(':')[1]);
				}
				minutes = (minutes % 60);
				hours = hours + Math.floor(minutes / 60);
				minutes = minutes < 10 ? '0' + minutes : minutes;
				hours = hours < 10 ? '0' + hours : hours;
				return hours + ':' + minutes;
			},
			GetFullSegment: function (segments) {
				var segment = null;
				if (segments.length > 0) {
					var depCode = segments[0].split('-')[0];
					var arrCode = '-' + segments[segments.length - 1].split('-')[1];
					var interCodes = '';
					for (i = 1; i < segments.length; i++) {
						interCodes += '-' + segments[i].split('-')[0];
					}
					var fullSegment = depCode + interCodes + arrCode;
					return fullSegment;
				}
				return '';
			},
			GetHotels: function (loyalty) {
				var hotelsArray = [];
				$('.impressionHotels').each(function (index) {
					var hotelObject = new Object();

					hotelObject.id = $(this).attr("id");
					hotelObject.name = $(this).attr("name");
					hotelObject.category = "Hotel";
					hotelObject.price = LogicImpressions.GetFormattedPrice($(this).attr("price"));
					hotelObject.dimension10 = loyalty;
					hotelObject.dimension11 = $(this).attr("dimension11");
					hotelObject.dimension12 = $(this).attr("dimension12");
					hotelObject.dimension13 = $(this).attr("dimension13");
					hotelObject.position = index + 1;

					hotelsArray.push(hotelObject);
				});
				return hotelsArray;
			},
			GetCars: function () {
				var hotelsArray = [];
				$('.impressionCars').each(function (index) {
					var hotelObject = new Object();
					var carVendor = $(this).attr("company");
					var carDataArray = $(this).attr("name").split(' ');
					if (carDataArray.length >= 3)
					{
						var carSegment = carDataArray[1];
						var carName = carSegment + ' ' + carVendor + ' Car';
						var idCar = 'Car|' + carVendor + '|' + carSegment;
					}
					hotelObject.id = idCar;
					hotelObject.name = carName;
					hotelObject.price = LogicImpressions.GetFormattedPrice($(this).attr("price"));
					hotelObject.category = $(this).attr("category");
					hotelObject.dimension14 = $(this).attr("city");
					hotelObject.dimension15 = carVendor;
					hotelObject.position = index + 1;

					hotelsArray.push(hotelObject);
				});
				return hotelsArray;
			},
			GetActivities: function () {
				var activityArray = [];
				$('.impressionActivity').each(function (index) {
					var activity = new Object();

					activity.id = $(this).attr("id");
					activity.name = $(this).attr("name");
					activity.category = $(this).attr("category");
					activity.price = LogicImpressions.GetFormattedPrice($(this).attr("price"));
					activity.dimension18 = $(this).attr("dimension18");
					activity.position = index + 1;

					activityArray.push(activity);
				});
				return activityArray;
			},
			GetFormattedPrice: function (priceString) {
				if (priceString != undefined && priceString.length > 0) {
					var cleanedString = priceString.trim().replace('$', '');
					try {
						var price = Number(cleanedString).toFixed(2);
						return price;
					}
					catch(err){
						return "0.0";
					}
				}
				else {
					return "0.00";
				}
				
			},
			GetDateToTimestamp : function (dateToConvert) {
				var dateNum = Date.parse(dateToConvert);
				return dateNum; // / 1000;
			},
			ConvertToMilitaryTime: function (timeString) {
				if (timeString.length > 0) {
					timeString = timeString.toLowerCase();
					var hours = parseInt(timeString.substr(0, 2));
					if (timeString.indexOf('am') != -1 && hours == 12) {
						timeString = timeString.replace('12', '0');
					}
					if (timeString.indexOf('pm') != -1 && hours < 12) {
						timeString = timeString.replace(hours, (hours + 12));
					}
					var timeChunk = timeString.replace(/(am|pm)/, '').trim().split(':');
					var finalDate = '';
					var hour = timeChunk[0];
					var minutes = timeChunk[1];
					finalDate += hour.length == 1 && Number(hour) < 10 ? '0' + hour + ':' : hour + ':';
					finalDate += minutes.length == 1 && Number(minutes) < 10 ? '0' + minutes : minutes;
					
					return finalDate;
				}
				else {
					return null;
				}
				
			},
			Set9fcImpression: function(nfcOffer, price, position){
				var nineFareClubProduct = new Object();
				nineFareClubProduct.id = "9FC|" + nfcOffer;
				nineFareClubProduct.name = "9FC|" + nfcOffer;
				nineFareClubProduct.price = LogicImpressions.GetFormattedPrice(price);
				nineFareClubProduct.category = "9FC";
				nineFareClubProduct.position = position;

				if (SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.NineFareClub == undefined) {
					SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.NineFareClub = [nineFareClubProduct];
				} else {
					SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.NineFareClub.push(nineFareClubProduct);
				}
				 
			},
			GetFormattedDate: function (dateToFormat) {
				if (dateToFormat.indexOf('/') > -1) {
					var finalDate = '';
					var fragments = dateToFormat.split('/');
					var counter = 0;
					fragments.forEach(function (elem) {
						finalDate += elem.length == 1 && Number(elem) < 10 ? '0' + elem : elem;
						counter++;
						if (counter < fragments.length) {
							finalDate += '/';
						}
					});
					return finalDate;
				}
				else {
					return dateToFormat;
				}
			},
			GetVesselFromFlightId: function (flightId) {
				var vesselObject = JSON.parse(localStorage.getItem('MKTG_SelectedFlights'));
				var vesselArray = [];
				vesselObject.forEach(function (element) {
					if (element.idFlight.substring(0, element.idFlight.length - 5) == flightId.substring(0, flightId.length - 5)) {
						vesselArray.push(element.vesselType);
					}
				});

				return vesselArray;
			},
			GetFareFromFlightId: function (flightId) {
				var flightsObject = JSON.parse(localStorage.getItem('MKTG_SelectedFlights'));
				var flightFare = '';
				flightsObject.forEach(function (element) {
					if (element.idFlight == flightId) {
						flightFare = element.fare;
					}
				});

				return flightFare;
			},
			UpdateBagsPrices: function (ThrillsComboSold) {
				var offset = 1;
				var bagsImpression = pageImpressions.Impressions.Bags;
				for (var b = bagsImpression.length - 1; b > 0; b--) {

					if (b >= offset) {
						if (!isBagIntoCollection(bagsImpression[b].dimension1, ThrillsComboSold)) {
							bagsImpression[b].price = LogicImpressions.GetFormattedPrice(String(parseFloat(bagsImpression[b].price) - parseFloat(bagsImpression[b - offset].price)));
							
						}
					}
				}
				if (ThrillsComboSold) {
					for (var b = bagsImpression.length - 1; b >= 0; b--) {
						bagsImpression[b].position = bagsImpression[b].position - 2;
					}
				}

				function isBagIntoCollection(bagSSR, isThrillsCombo) {
					var bagsArray = ['BAGC', 'BAGM', 'BAG1', 'BG1M', 'BGZC', 'BGZ1'];

					if (isThrillsCombo)
						bagsArray.push('BG2M', 'BAG2', 'BGZ1');

					if (bagsArray.indexOf(bagSSR) > -1) {
						return true;
					} else {
						return false;
					}
						
				};
				//console.log(bagsImpression);
			},
			GetArrivalDateTime: function (departureDateTime, durationFlight) {
				if (flightDuration.indexOf(':') > -1) {
					var duration = flightDuration.split(':');
					var arrivalDateTime = new Date(departureDateTime).addTime(Number(duration[0]), Number(duration[1]));
					return arrivalDateTime;
				} else {

					return departureDateTime;
				}
			},
			Get9FcAddToCart: function () {
				var nineFcAddToCart = new Object();
				var nfc = pageImpressions.Impressions.NineFareClub;
				if (nfc != 'undefined' && nfc.length > 0){
					nineFcAddToCart.id = nfc[0].id;
					nineFcAddToCart.name = nfc[0].name;
					nineFcAddToCart.price = LogicImpressions.GetFormattedPrice(nfc[0].price);
					nineFcAddToCart.category = nfc[0].category;
					nineFcAddToCart.position = nfc[0].position;

					pageAddToCart.NineFcAddToCart = nineFcAddToCart;
					pageAddToCart.NineFareClub = nineFcAddToCart;
					//SPIRIT_MKTG.EVENTS.EEaddToCart.NineFareClub = nineFcAddToCart;
					console.log(pageAddToCart);
				}
			},
			GetSelectedSeats: function () {
				var seatsObject = JSON.parse(localStorage.getItem('MKTG_SelectedSeats'));
				return seatsObject;
			},
			UpdateEETransacionData: function () {
				UpdateQPdata();
				UpdateThrillsCombo();
				UpdateSeatsData();
				

				function UpdateQPdata() {
					SPIRIT_MKTG.EVENTS.EEtransaction.ecommerce.purchase.products.forEach(function (product) {
						if (product.category == 'Flight') {
							var myQPdata = LogicImpressions.GetVesselFromFlightId(product.id);
							product.vesselType = myQPdata;
						}
					});
				}

				function UpdateSeatsData() {
					var storedSeats = JSON.parse(localStorage.getItem('MKTG_SelectedSeats')); 
					//SPIRIT_MKTG.EVENTS.EEtransaction.ecommerce.purchase.products.seat = JSON.parse(localStorage.getItem('MKTG_SelectedSeats'));
					if (storedSeats != null && storedSeats.length > 0) {
						SPIRIT_MKTG.EVENTS.EEtransaction.ecommerce.purchase.products.seat = [];
						storedSeats.forEach(function (item) {
							SPIRIT_MKTG.EVENTS.EEtransaction.ecommerce.purchase.products.push(item);
						});

						SPIRIT_MKTG.EVENTS.EEtransaction.ecommerce.purchase.products.forEach(function (product, index) {
							if (product.category == 'Seat') {
								SPIRIT_MKTG.EVENTS.EEtransaction.ecommerce.purchase.products.splice(index, 1);
							}
						});
					}
				}

				function UpdateThrillsCombo() {
					SPIRIT_MKTG.EVENTS.EEtransaction.ecommerce.purchase.products.forEach(function (product, index) {
						if (product.category == 'Thrills Combo') {
							var storedPrice = localStorage.getItem('MKTG_thrillsComboCartItem');
							if (storedPrice.indexOf('-')) {
								product.price = storedPrice.split('-')[1];
							}							
						}
					});
				} 
			},

		},
		Session: {
			CreateGuid: function () {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
					var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});
			},		
			NewMktgSessionId: function () {
				CookieHelper.create("SPIRIT_MKTGsessionId", SPIRIT_MKTG.LOGIC.Session.CreateGuid());
			},
			GetMktgSessionId: function () {
				return CookieHelper.read("SPIRIT_MKTGsessionId");
			},
			InitMktgSessionId: function () {
				SPIRIT_MKTG.LOGIC.Session.NewMktgSessionId();
				SPIRIT_MKTG.sessionId = SPIRIT_MKTG.LOGIC.Session.GetMktgSessionId()
				console.log('SPIRIT_MKTG.sessionId : ', SPIRIT_MKTG.sessionId);
			},
			SetMktgSessionId: function () {
				SPIRIT_MKTG.sessionId = SPIRIT_MKTG.LOGIC.Session.GetMktgSessionId();
			},
			CleanMarketingLocalStorage: function () {
				localStorage.removeItem("MKTG_SelectedFlights");
				localStorage.removeItem("MKTG_thrillsComboCartItem");
				localStorage.removeItem("MKTG_SelectedSeats");
				localStorage.removeItem("MKTG_SelectedFlightData");
				localStorage.removeItem("MKTG_UserType");
				localStorage.removeItem("MKTG_PassengersData");
				localStorage.removeItem("MKTG_IBE");
				//localStorage.removeItem("MKTG_flightsSelected");
				//localStorage.removeItem("flightsSelected");
				//localStorage.removeItem("thrillsComboCartItem");
			},
		},
		MktgCallback: {
			ActivateFunction: function (functionNameString, avoidDuplicateCallbacks) {
				if (avoidDuplicateCallbacks != 'undefined' && avoidDuplicateCallbacks == true) {
					var functionName = window[functionNameString];
					if (typeof functionName === 'function' && functionName && callbackWasCalled != functionNameString) {
						try {
							functionName();
							if (callbackWasCalled != 'InitialLoading') {
								callbackWasCalled = functionNameString;
							}
						} catch (e) {
							console.log(functionName + ' error: ' + e);
						}
					}

				} else {
					var functionName = window[functionNameString];
					if (typeof functionName === 'function' && functionName) {
						try {
							functionName();
						} catch (e) {
							console.log(functionName + ' error: ' + e);
						}
					}
				}
			}
		},
		IBE: {
			PopulateIbeDataLayer: function (page) {

				var IbeObject = new Object();

				if (page == 'Flight') {
					IbeObject.FFPLoggedIn = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.FFPLoggedIn;
					IbeObject.FFPLoyaltyLevel = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.FFPLoyaltyLevel;
					IbeObject.FFPUserID = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.FFPUserID;
					IbeObject.flightDaysInAdvance = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.flightDaysInAdvance;
					IbeObject.totalPax = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.totalPax;
					IbeObject.totalAdult = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.totalAdult;
					IbeObject.totalChild = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.totalChild;
					IbeObject.totalInfant = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.totalInfant;
					IbeObject.flightTrip = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.flightTrip;
					IbeObject.flightJourney = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.flightJourney;
					IbeObject.flightType = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.flightType;
				} else {
					//we retreive the stored values and mapping the DataLayer object
					this.ValidateLoginActivity();
					IbeObject = this.RetrieveIbeDataLayer();
					IbeObject.flightSegment = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.flightSegment;
					IbeObject.flightLeg = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.flightLeg;
					IbeObject.flightOperatingAirline = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.flightOperatingAirline;
				}
				//if (page != 'Flight') {
				//	IbeObject.flightSegment = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.flightSegment;
				//	IbeObject.flightLeg = page = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.flightLeg;
				//	IbeObject.flightOperatingAirline = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.flightOperatingAirline;
				//}

				if (page == 'Confirmation') {
					IbeObject.paymentMethod = SPIRIT_MKTG.EVENTS.EEtransaction.ecommerce.purchase.actionField.paymentMethod;
				}

				//console.log('IBE: ', IbeObject);
				return IbeObject;
			},
			StoreIbeDataLayer: function (IbeObj) {
				localStorage.setItem('MKTG_IBE', JSON.stringify(IbeObj));
			},
			RetrieveIbeDataLayer: function () {
				var object = JSON.parse(localStorage.getItem('MKTG_IBE'));
				return object;
			},
			GetIbeDataLayer: function (page) {
				var dataLayer = this.PopulateIbeDataLayer(page);
				this.StoreIbeDataLayer(dataLayer);
				console.log('IBE DataLayer:', dataLayer);
				//return dataLayer;
			},
			ValidateLoginActivity: function () {
				var storedIbe = this.RetrieveIbeDataLayer();
				if (storedIbe != 'undefined') {
					var isLoggedIn = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.FFPLoggedIn.toLowerCase();
					var loggedInStored = storedIbe.FFPLoggedIn.toLowerCase();
					console.log(isLoggedIn, loggedInStored);
					if (isLoggedIn != loggedInStored) {
						storedIbe.FFPLoggedIn = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.FFPLoggedIn;
						storedIbe.FFPLoyaltyLevel = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.FFPLoyaltyLevel;
						storedIbe.FFPUserID = window.SPIRIT_MKTG.EVENTS.EEproductImpression.Impressions.FFPUserID;
						this.StoreIbeDataLayer(storedIbe);
					}
				}
			}
		}
	},
	sessionId:'',
};

var SPIRIT_MKTG_IBE = new Object();

//Fuction to generating nested namespaces
SPIRIT_MKTG.extendSpiritNS = function (ns, ns_string) {
	var parts = ns_string.split('.'),
		parent = ns,
		pl, i;

	if (parts[0] === "SPIRIT_MKTG") {
		parts = parts.slice(1);
	}

	pl = parts.length;
	for (i = 0; i < pl; i++) {
		//create a property if it doesnt exist
		if (typeof parent[parts[i]] === 'undefined') {
			parent[parts[i]] = {};
		}

		parent = parent[parts[i]];
	}

	return parent;
}

var pageImpressions = SPIRIT_MKTG.EVENTS.EEproductImpression;
var pageAddToCart = SPIRIT_MKTG.EVENTS.EEaddToCart;
var pageCheckout = SPIRIT_MKTG.EVENTS.EEcheckout;
var LogicImpressions = SPIRIT_MKTG.LOGIC.PopulateImpressions;
var LogicMktg = SPIRIT_MKTG.LOGIC.Session;
var LogicCallback = SPIRIT_MKTG.LOGIC.MktgCallback;
//This object store info about flight 
var itineraryDppNewImpression = new Object();
var callbackWasCalled = '';

Date.prototype.addHours = function (h) {
	this.setHours(this.getHours() + h);
	return this;
}

Date.prototype.addTime = function (h, m) {
	this.setHours(this.getHours() + h, this.getMinutes() + m);
	return this;
}

function Set_ReloadBagsPage(value) {
	if (value == 'Y') {
		localStorage.setItem('ReloadBagsPages', 'Y');
	} else {
		localStorage.setItem('ReloadBagsPages', 'N');
	}
}

function ReloadBagsPage() {
	if (localStorage.getItem('ReloadBagsPages') == 'Y') {
		Set_ReloadBagsPage('N');
		window.location.reload();
	}
}

function detectIE() {
	var ua = window.navigator.userAgent;

	// Test values; Uncomment to check result …

	// IE 10
	// ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

	// IE 11
	// ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

	// Edge 12 (Spartan)
	// ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

	// Edge 13
	// ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

	var msie = ua.indexOf('MSIE ');
	if (msie > 0) {
		// IE 10 or older => return version number
		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	}

	var trident = ua.indexOf('Trident/');
	if (trident > 0) {
		// IE 11 => return version number
		var rv = ua.indexOf('rv:');
		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	}

	var edge = ua.indexOf('Edge/');
	if (edge > 0) {
		// Edge (IE 12+) => return version number
		return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	}

	// other browser
	return false;
}

