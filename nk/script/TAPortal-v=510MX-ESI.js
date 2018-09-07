var genericErrorBubble = "<div class='bubble'>	<span class='arrow ' /></div>";

$(document).ready(function () {
    if ($("#passwordWindow").length) {
        $("#passwordWindow").dialog({
            autoOpen: false,
            width: 484,
            resizable: false,
            modal: true,
            open: function () {
                $(this).prev().find(".ui-dialog-titlebar-close").show(); // remove cross icon
                //$("input[id$='TextBoxAgentUserName']").blur(); // to remove auto focus of dialog textbox
                $("input[id$='TextBoxAgentUserName']").val('');  // clear text box
            }
        }).parent().appendTo("form");
    }
    if ($(".date_picker_mask").length) {
        monthOptionLabels = [];
        dayNameLabels = [];
        createArray("#js_days", dayNameLabels);
        createArray("#js_months", monthOptionLabels);
        var today = new Date();
        today.setDate(today.getDate() - 183);
        var yearFromToday = new Date();
        yearFromToday.setFullYear(today.getFullYear() + 1);
        var dates = $(".date_picker_mask").datepicker({
            numberOfMonths: 2,
            dateFormat: 'MM dd, yy',
            monthNames: monthOptionLabels,
            dayNamesMin: dayNameLabels,
            minDate: today,
            maxDate: 0,
            showOtherMonths: true,
            selectOtherMonths: true,
            showButtonPanel: true,
			closeText: clearCalender,
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
			beforeShow: function (input) {
                $(this).datepicker("widget").delegate(".ui-datepicker-close", "click", function () {
                    $.datepicker._clearDate(input);
                    var agentID = $(input).parent().data('agentid'),
                    count = 0;
                    $('[data-agentid=' + agentID + '] .date_picker').each(function () {
                        if ($(this).val() == '') {
                            count++;
                        }
                        if (count >= 2) {
                            $(".date_picker").removeAttr('disabled').removeClass('disabled'); ;
                        }
                    });
				});
				
	            if (!window.matchMedia) return;
	            var mq = window.matchMedia("(max-width: 768px)");

	            if (mq.matches) {
		            $(this).datepicker("option", "numberOfMonths", [2, 1]);
	            } else {
		            $(this).datepicker("option", "numberOfMonths", 2);
	            }
            },
            onSelect: function (selectedDate) {
                var $this = $(this),
                    inpName = $this.attr('name'),
                    instance = $this.data("datepicker"),
				    date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings),
                    agentID = $this.parent().data('agentid'),
                    agentUID = $this.parent().attr('agentUid');

                if (selectedDate != "")
                    $('#hidAgentId').val(agentUID);
                else
                    $('#hidAgentId').val('');

                $this.next("input").val(selectedDate.substring(0, selectedDate.indexOf(',')));
                $("#Agentdetails .date_picker").attr('disabled', 'disabled').addClass('disabled'); ;
                $('[data-agentid=' + agentID + '] .date_picker').removeAttr('disabled').removeClass('disabled'); ;
                if (inpName == 'startDate') {
                    $('#hidStartDate').val($.datepicker.formatDate("mm/dd/yy", date));
                    var ele = $('[data-agentid=' + agentID + '] .date_picker_mask[id*=endDate]');
                    ele.datepicker("option", "minDate", date);
                    var nextDate = ele.datepicker("getDate");
                    if (!nextDate || date >= nextDate) {
                        ele.datepicker("setDate", date);
                        $('#hidEndDate').val($.datepicker.formatDate("mm/dd/yy", date));
                        $('[data-agentid=' + agentID + '] .date_picker[id*=EndDate]').val($('[data-agentid=' + agentID + '] .date_picker[id*=StartDate]').val());
                    }
                }
                else {
                    $('#hidEndDate').val($.datepicker.formatDate("mm/dd/yy", date));
                }
                $("#ui-datepicker-div").hide();
                $(this).next("input").removeClass('placeholder');
            },
            onClose: function () {
                $("div.bubble").remove();
                mouse_is_inside = false;
            }
        });
    }
    $('.date_picker').keydown(function (e) {
        if (e.keyCode == 9 && !e.shiftKey) {
            $('#ui-datepicker-div').hide();
            mouse_is_inside = false;
        }
    });

    var mouse_is_inside = false;
    $('body').on('mousemove', '#ui-datepicker-div', function () {
        mouse_is_inside = true;
    }, function () {
        mouse_is_inside = false;
        });
    $('body').on('mouseout', '#ui-datepicker-div', function () {
        mouse_is_inside = false;
    });

    $('body').mouseup(function () {
        if (!mouse_is_inside) {
            if ($('#Agentdetails').length > 0) {
                if ($('#ui-datepicker-div').length > 0) {
                    $('#ui-datepicker-div').hide();
                    $("div.bubble").remove();
                    mouse_is_inside = false;
                }
            }
        }
    });

    if ($("#checkeFund").length) {
        if (isTravelAgent == 'False') {
            $("#checkeFund").removeAttr("href");
        }

        if (availableCredit != 'True' && isTravelAgent != 'False') {
            $("#checkeFund").attr('href', 'javascript:void(0)');
        }

        $("#checkeFund").click(function () {
            if (isEnableRequestFund && availableCredit != 'True' && isTravelAgent != 'False') {
                $("#InsufficientFunds").modal();
            }
        });
    }

    if ($("#href-requestfund").length) {
        if (isTravelAgent == 'False') {
            $("#href-requestfund").removeAttr("href");
        }

        if (availableCredit != 'True' && isTravelAgent != 'False') {
            $("#href-requestfund").attr('href', 'javascript:void(0)');
        }
        $("#href-requestfund").click(function () {
            if (isEnableRequestFund && availableCredit != 'True' && isTravelAgent != 'False') {
                $("#InsufficientFunds").modal();
            }
        });
    }

    $("#TAPortalRequestSentPopup").dialog({
        autoOpen: false,
        width: 300,
        modal: true,
        dialogClass: 'no_close',
        position: GetDefaultModalPosition()
    });

    $('body').on('click', '.popupclose', function() {
        $(this).parents(".dialog-popup").dialog("close");
    });

    $("body").delegate("[data-btip]", "click", function (event) {
        $("#bubbleTip").remove();
        $(this).after('<div id="bubbleTip" class="bTipWrapper"><div class="bTipContent"></div><div class="popUpWrapperTail"></div></div>');
        event.preventDefault();  //prevent the default action of the link
        var $this = $(this),
            $popup = $("#bubbleTip"),
            $content = $this.data('btip');

        if ($this.data('btipclass')) {
            var newclass = $this.data('btipclass');
            $popup.addClass(newclass);
        }

        if (!$popup.is(':visible')) {
            displayBubbleTip($this, $popup, $content, true);
            function closeTaxFeesLink(event) {
                event.preventDefault();
                if (!$(event.target).hasClass('bTipWrapper') && !$(event.target).hasClass('bTipContent')) {
                    $popup.remove();
                    $(document).unbind('click', closeTaxFeesLink);
                }
            }
            setTimeout(function () {
                $(document).bind('click', closeTaxFeesLink);
            }, 100);
        }
    });

    loadPlaceholders();

    //Set width of member login in header
    $('.main_header .support .logged_in').hover(function () {
        $('#memberNavigation').width($('.user_info').width() + 24);
        $('#memberNavigation .member_data').width($('.user_info').width());
    });
    if (!Modernizr.input.placeholder) {
      $('input[placeholder]').each(function () {
        if (this.value == $(this).attr('placeholder')) {
          $(this).addClass('placeholder');
        }
      });
    }
});
function showpopup(id) {
    //$("#delete_" + id).dialog('open');
    $("#delete_" + id).modal();
}
function closepopup(id) {
    //$("#delete_" + id).dialog('close');
    $("#delete_" + id).modal('toggle');
}
$('body').on('click', 'div.checked', function () {
    $(this).removeAttr("class");
    $(this).attr("class", "Unchecked");
    $(this).children().hide();
    $(this).next("input:checkbox").removeAttr("checked");
    var checkBoxId = $(this).next("input:checkbox").attr('id').split('_')[2];
    var controlId = $(this).next("input:checkbox").attr('id').split('_')[0];
    var teamReportCheckBox = controlId + '_TeamReporthiddenfield_' + checkBoxId;
    var requestFundCheckBox = controlId + '_RequestFundhiddenfield_' + checkBoxId;
    var adminCheckBox = controlId + '_Adminhiddenfield_' + checkBoxId;
    var creditBalanceCheckBox = controlId + '_USeCreditBalance_' + checkBoxId;
    if ($('#' + teamReportCheckBox).is(':checked') == false || $('#' + requestFundCheckBox).is(':checked') == false || $('#' + creditBalanceCheckBox).is(':checked') == false) {

        $('#' + adminCheckBox).removeAttr("checked");
        $('#' + adminCheckBox).parent().find('div').removeAttr("class");
        $('#' + adminCheckBox).parent().find('div').attr("class", "Unchecked");
        $('#' + adminCheckBox).parent().find('div').children().hide();
    }
    if ($(this).next("input:checkbox").attr('id') == adminCheckBox) {
        $('#' + teamReportCheckBox).removeAttr("checked");
        $('#' + teamReportCheckBox).parent().find('div').removeAttr("class");
        $('#' + teamReportCheckBox).parent().find('div').attr("class", "Unchecked");
        $('#' + teamReportCheckBox).parent().find('div').children().hide();
        $('#' + requestFundCheckBox).removeAttr("checked");
        $('#' + requestFundCheckBox).parent().find('div').removeAttr("class");
        $('#' + requestFundCheckBox).parent().find('div').attr("class", "Unchecked");
        $('#' + requestFundCheckBox).parent().find('div').children().hide();
        $('#' + creditBalanceCheckBox).removeAttr("checked");
        $('#' + creditBalanceCheckBox).parent().find('div').removeAttr("class");
        $('#' + creditBalanceCheckBox).parent().find('div').attr("class", "Unchecked");
        $('#' + creditBalanceCheckBox).parent().find('div').children().hide();
    }

});

$('body').on('click', 'div.Unchecked', function () {
    $(this).removeAttr("class");
    $(this).attr("class", "checked");
    $(this).children().show();
    $(this).next("input:checkbox").attr("checked", "checked");
    var checkBoxId = $(this).next("input:checkbox").attr('id').split('_')[2];
    var controlId = 'TravelPortalAdminDisplay';
    var teamReportCheckBox = controlId + '_TeamReporthiddenfield_' + checkBoxId;
    var requestFundCheckBox = controlId + '_RequestFundhiddenfield_' + checkBoxId;
    var adminCheckBox = controlId + '_Adminhiddenfield_' + checkBoxId;
    var creditBalanceCheckBox = controlId + '_USeCreditBalance_' + checkBoxId;
    if ($('#' + teamReportCheckBox).is(':checked') == true && $('#' + requestFundCheckBox).is(':checked') == true && $('#' + creditBalanceCheckBox).is(':checked') == true) {
        $('#' + adminCheckBox).attr("checked", "checked");
        $('#' + adminCheckBox).parent().find('div').removeAttr("class");
        $('#' + adminCheckBox).parent().find('div').attr("class", "checked");
        $('#' + adminCheckBox).parent().find('div').children().show();
    }
    if ($(this).next("input:checkbox").attr('id') == adminCheckBox) {
        $('#' + teamReportCheckBox).attr("checked", "checked");
        $('#' + teamReportCheckBox).parent().find('div').removeAttr("class");
        $('#' + teamReportCheckBox).parent().find('div').attr("class", "checked");
        $('#' + teamReportCheckBox).parent().find('div').children().show();
        $('#' + requestFundCheckBox).attr("checked", "checked");
        $('#' + requestFundCheckBox).parent().find('div').removeAttr("class");
        $('#' + requestFundCheckBox).parent().find('div').attr("class", "checked");
        $('#' + requestFundCheckBox).parent().find('div').children().show();
        $('#' + creditBalanceCheckBox).attr("checked", "checked");
        $('#' + creditBalanceCheckBox).parent().find('div').removeAttr("class");
        $('#' + creditBalanceCheckBox).parent().find('div').attr("class", "checked");
        $('#' + creditBalanceCheckBox).parent().find('div').children().show();
    }

});

var createArray = function (elem, array) {
    var calanderDumpTimeArray = $(elem).val().split(",");
    $.each(calanderDumpTimeArray, function (index, value) {
        array.push(value);
    });
};
function ShowCalender(inputID) {
    var id = $("#" + inputID.id).prev().attr('id');
    //$("#" + id).datepicker("option", "maxDate", '+1y');
    $('#ui-datepicker-div').show();
    $("#" + id).datepicker("show").datepicker("show");
    
}

function displayBubbleTip(originater, popup, content, toRight) {
    $('#bubbleTip .bTipContent').html(content);
    var isRight = false;
    if (toRight && toRight === true) {
        isRight = true;
    }
    var $this = (originater instanceof jQuery) ? originater : $(originater);
    var linkCoord = $this.position();
    var prepareBubble = (popup instanceof jQuery) ? popup : $(popup);
    var bubbleHeight = (prepareBubble.outerHeight() + 20);
    var horizDiff = isRight ? (prepareBubble.outerWidth() - 55) : 20;
    prepareBubble.css({ "left": +(linkCoord.left - horizDiff), "top": +(linkCoord.top - bubbleHeight) });
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

  function RunReport(){
          var paramAgentID = $('#hidAgentId').val();
          var startDate = $('#hidStartDate').val();
          var endDate = $('#hidEndDate').val();
          if (startDate && endDate != '') {
              var param = "?AgentID=" + paramAgentID + "&StartDate=" + startDate + "&EndDate=" + endDate;
              window.open('travel_portal_Expot_Excel.aspx' + param, '_blank', "height=200,width=200");
          } else {
              $("html, body").animate({ scrollTop: 350 }, '500');
              showBubble($('.date_picker:eq(0)'), genericErrorBubble, errorMessageSelectDate);
              $('.date_picker:eq(0)').focus();
              return false;
          }
  }

function loadPlaceholders() {
    if (!Modernizr.input.placeholder) {
        $('[placeholder]').focus(function () {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function () {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur();
    }
}
function clearPlaceholders() {
    if (!Modernizr.input.placeholder) {
        $('[placeholder]').each(function () {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
              input.val('');
              input.removeClass('placeholder');
            }
        });
    }
}