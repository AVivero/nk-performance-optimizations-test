$(document).ready(function () {
    if (navigator.userAgent.indexOf('MSIE') != -1) {       //IS any IE Version
        var tablerow = "block";
        var tablerowgroup = "block";
    }
    else {
        //FireFox etc.
        var tablerow = "table-row";
        var tablerowgroup = "table-row-group";
    }

    // self executing function that will format and display the date for each flight
    (function () {

        initializeCountries();

        // remove "selected" attribute from the first option tag, from navitaire generated select dropdowns
        $("select option").each(function () {
            $(this).removeProp("selected");
        });

        //        $("table.agentFullInfo select option").each(function (i) {
        //            var displayText = $(this).text();
        //            //   var searchElements = $(this).parents("div.hiddenElement").prev("div.dropDownMaskWidestXL").children("div.dropDownMaskItems").children("ul");
        //            $(this).closest("div.hiddenElement").prev("div.dropDownMaskWidestXL").children("div.dropDownMaskItems").children("ul").each(function (j) {
        //                var listElement = $(this);
        //                var listElementID = listElement.attr("id") + "Item" + i;
        //                listElement.append("<li id='" + listElementID + "'>" + displayText + "</li>");
        //            });
        //        });

        var idCount = 0;
        $("table.agentFullInfo").find("select").each(function (i) {

            var ulContainer = $(this).closest("div.hiddenElement").prev("div.dropDownMaskWidestXL").children("div.dropDownMaskItems").children("ul");
            var listElement = $(this);
            //                var listElementID = listElement.attr("id") + "Item" + i;
            var ulID = listElement.attr("id")
            var liCollection = '';
            $(this).find("option").each(function (j) {
                idCount++;
                var displayText = $(this).text();
                var listElementID = ulID + "Item" + idCount;
                liCollection += "<li id='" + listElementID + "'>" + displayText + "</li>";
            });
            ulContainer.append(liCollection);
        });

    })();

    var $stateReqIcon = $('#state_req_icon');
    var $zipReqIcon = $('#zip_req_icon');
    var $zipInput = $('#zip_req_icon').parents('td').children('div.container').children('input');
    var countryValue = $('div#countryMask span').text()
    if (countryValue != null && countryValue != '' && $zipInput != null && $zipInput != undefined) {
        if (countryValue != "United States of America" && countryValue != "Canada") {
            $stateReqIcon.css('visibility', 'hidden');
            $zipReqIcon.css('visibility', 'hidden');
            $zipInput.attr('required', 'false');
            $(ccState + '').attr('required', 'false');
        } else {
            $stateReqIcon.css('visibility', 'visible');
            $zipReqIcon.css('visibility', 'visible');
            $zipInput.attr('required', 'true');
            $(ccState + '').attr('required', 'true');
        }
    }

    $(".dropDownMask").toggleClick(function () {
        $(this).children(".dropDownMaskItems").css("display", "block");
        $(this).addClass("dropdownFocus");
    }, function () {
        $(this).children(".dropDownMaskItems").css("display", "none");
        $(this).removeClass("dropdownFocus");
        });

    $(".dropDownMaskWide").toggleClick(function () {
        $(this).children(".dropDownMaskItems").css("display", "block");
        $(this).addClass("dropdownFocus");
    }, function () {
        $(this).children(".dropDownMaskItems").css("display", "none");
        $(this).removeClass("dropdownFocus");
    });
    $(".dropDownMaskWider").toggleClick(function () {
        $(this).children(".dropDownMaskItems").css("display", "block");
        $(this).addClass("dropdownFocus");
    }, function () {
        $(this).children(".dropDownMaskItems").css("display", "none");
        $(this).removeClass("dropdownFocus");
    });
    $(".dropDownMaskWidest").toggleClick(function () {
        $(this).children(".dropDownMaskItems").css("display", "block");
        $(this).addClass("dropdownFocus");
    }, function () {
        $(this).children(".dropDownMaskItems").css("display", "none");
        $(this).removeClass("dropdownFocus");
    });
    $(".dropDownMaskWidestXL").toggleClick(function () {
        $(this).children(".dropDownMaskItems").css("display", "block");
        $(this).addClass("dropdownFocus");
    }, function () {
        $(this).children(".dropDownMaskItems").css("display", "none");
        $(this).removeClass("dropdownFocus");
    });
    $(".dropDownMaskItems ul li").click(function () {
        var captureSelection = $(this).text();
        $(this).parents(".dropDownMaskItems").prev("span").text(captureSelection);
        var position = $(this).parent().attr("id");
        var parent = $(this).parent();

        //  var selectPosition = $(this).parents("div[class^='dropDownMask']").next("div.hiddenElement").find("select").attr("id");
        //  var index = $("#" + position + " li").index(this);
        var indexTrue = parent.find("li").index(this);
        // var parentMask = $(this).parent().parent().parent().parent().children(".hiddenElement");
        var parentMask = $(this).closest(".dropDownMaskItems").parent().parent().find(".hiddenElement");

        var calcIndex = indexTrue + 1;

        parentMask.find(":input").val(captureSelection);

        //  var selectOption = parentMask.children(":input");
        //$("#" + selectPosition + " option").removeAttr("selected");
        //$("#" + selectPosition + " option:nth-child(" + calcIndex + ")").attr("selected", "selected");

        // parentMask.children(":input").val(captureSelection);
        parentMask.find(":input").find("option").removeProp("selected");
        parentMask.find(":input").find("option:nth-child(" + calcIndex + ")").prop("selected", "selected");


        var stateSwapField = $(this).parents("div").attr("id");
        if (stateSwapField == "dropDownCountriesCitizenship") {
            var $stateReqIcon = $('#state_req_icon');
            var $zipReqIcon = $('#zip_req_icon');
            var $zipInput = $('#zip_req_icon').parents('td').children('div.container').children('input');
            if (captureSelection != "United States of America" && captureSelection != "Canada") {
                $("div#foreignProvinceMask").css("display", "none");
                $("div#foreignProvince").css("display", "block");
                $(ccStateTB + '').val("");
                $(ccState + '').find('option').remove();
                $("ul#ulAgentInfoStateProvince").find('li').remove();
                var stateDDL = $($(ccState).get(0));
                stateDDL.append($("<option value='none' selected='selected'></option>"));
                $stateReqIcon.css('visibility', 'hidden');
                $zipReqIcon.css('visibility', 'hidden');
                $zipInput.attr('required', 'false');
                $(ccState + '').attr('required', 'false');
            } else {
                $("div#foreignProvinceMask").css("display", "block");
                $("div#foreignProvince").css("display", "none");
                $stateReqIcon.css('visibility', 'visible');
                $zipReqIcon.css('visibility', 'visible');
                $zipInput.attr('required', 'true');
                $(ccState + '').attr('required', 'true');
                if (captureSelection == "United States of America" || captureSelection == "Canada") {
                    $("ul#ulAgentInfoStateProvince").find('li').remove();
                    updateStateWith(ccCountry[0]);
                    $(ccState + " option").each(function (i) {
                        var displayText = $(this).text();
                        var id = $(this).parents("div.hiddenElement").prev("div.dropDownMaskWidestXL").children("div.dropDownMaskItems").children("ul").attr("id") + "Item" + i;
                        $(this).parents("div.hiddenElement").prev("div.dropDownMaskWidestXL").children("div.dropDownMaskItems").children("ul").append("<li id='" + id + "'>" + displayText + "</li>");
                    });
                    $("ul#ulAgentInfoStateProvince li").click(function () {
                        var captureSelection = $(this).text();
                        $(this).parents(".dropDownMaskItems").prev("span").text(captureSelection);
                        var position = $(this).parent().attr("id");
                        var selectPosition = $(this).parents("div[class^='dropDownMask']").next("div.hiddenElement").find("select").attr("id");
                        var index = $("#" + position + " li").index(this);
                        var calcIndex = index + 1;
                        $("#" + selectPosition + " option").removeProp("selected");
                        $("#" + selectPosition + " option:nth-child(" + calcIndex + ")").attr("selected", "selected");
                    });
                    if (captureSelection == "United States of America") {
                        $(ccStateTB + '').val("AK");                     // WHEN "USA" IS SELECTED, SET THE "VALUE" ATTRIBUTE TO THE DEFAULT STATE (ALASKA)
                        $("div#foreignProvinceMask span.selectPrompt").text("Alaska");
                    }
                    if (captureSelection == "Canada") {
                        $(ccStateTB + '').val("AL");                     // WHEN "CA" IS SELECTED, SET THE "VALUE" ATTRIBUTE TO THE DEFAULT STATE (ALBERTA)
                        $("div#foreignProvinceMask span.selectPrompt").text("Alberta");
                    }
                }
            }
        }
    });
    $("div.checkBoxMask").toggleClick(function () {
        $(this).children().show();
        $(this).next("input:checkbox").attr("checked", "checked");
        $('body').find(".bubble").remove();
        $(this).parent().next("div.bubble").remove();
    }, function () {
        $(this).children().hide();
        $(this).next("input:checkbox").removeAttr("checked");
        validateOnlyThis($(this).next("input:checkbox").get(0));
    });
    $("div.checkBoxMaskReversed").toggleClick(function () {
        $(this).children().hide();
        $(this).next("input:checkbox").removeAttr("checked");
    }, function () {
        $(this).children().show();
        $(this).next("input:checkbox").attr("checked", "checked");
    });
});
