function checkCityPairRulesOneWayRoundTrip() {
    var origin = $('#' + applicationJavaScriptHtmlId + '_DropDownListMarketOrigin1').val();
    var destination = $('#' + applicationJavaScriptHtmlId + '_DropDownListMarketDestination1').val();
    var roundTrip = $('#' + applicationJavaScriptHtmlId + '_RoundTrip').attr("checked");
    var departDate = '';
    var returnDate = '';
    var monthYear = $('#' + applicationJavaScriptHtmlId + '_DropDownListMarketMonth1').val();
    var theYear = getYearFromDDLValue(monthYear);
    var theMonth = getMonthFromDDLValue(monthYear);
    var theDay = $('#' + applicationJavaScriptHtmlId + '_DropDownListMarketDay1').val();
    departDate = new Date(theYear, theMonth, theDay);

    if (roundTrip) {
        monthYear = $('#' + applicationJavaScriptHtmlId + '_DropDownListMarketMonth2').val();
        theYear = getYearFromDDLValue(monthYear);
        theMonth = getMonthFromDDLValue(monthYear);
        theDay = $('#' + applicationJavaScriptHtmlId + '_DropDownListMarketDay2').val();
        returnDate = new Date(theYear, theMonth, theDay);
    }
    return (validateCityPairRules(origin, destination, departDate, returnDate));
}

function checkCityPairRulesMultiCity() {
    for (var i = 1; i <= 4; i++) {
        if (CheckMarketRow("fromMultiCity" + CurrentRow)) {
            var origin = $('#' + applicationJavaScriptHtmlId + '_DropDownListMarketOrigin'+i).val();
            var destination = $('#' + applicationJavaScriptHtmlId + '_DropDownListMarketDestination' + i).val();
            var departDate = '';
            var returnDate = '';
            var monthYear = $('#' + applicationJavaScriptHtmlId + '_DropDownListMarketMonth' + i).val();
            var theYear = getYearFromDDLValue(monthYear);
            var theMonth = getMonthFromDDLValue(monthYear);
            var theDay = $('#' + applicationJavaScriptHtmlId + '_DropDownListMarketDay' + i).val();
            departDate = new Date(theYear, theMonth, theDay);
            if (!validateCityPairRules(origin, destination, departDate, returnDate)) {
                return false;
            }
        }
    }
    return true;
}
function checkCityPairRules() {
    if (!isMultiCity()) {
        return checkCityPairRulesOneWayRoundTrip();
    }
    else {
        return checkCityPairRulesMultiCity();
    }
}

function getYearFromDDLValue(departMonthYear) {
    if (departMonthYear.indexOf("-") > -1) {
        return departMonthYear.substring(0, departMonthYear.indexOf("-"));
    }
    else {
        return '';
    }
}

function getMonthFromDDLValue(departMonthYear) {
    if (departMonthYear.indexOf("-") > -1) {
        return new Number(departMonthYear.substring(departMonthYear.indexOf("-") + 1)) - 1;
    }
    else {
        return '';
    }
}

function validateCityPairRules(origin, destination, departDate, returnDate) {
    //debugger;
    var isValid = true;
    var rule = getCityRule(origin, destination);

    if (rule != undefined) {
        var msg = '';

        for (var i = 0; i < rule.length; i++) {
            // validate dates of operations
            isInEffect = validateCityPairDates(getDateFromString(rule[i].startdate), getDateFromString(rule[i].enddate), departDate, rule[i].origin, rule[i].destination);
            if (isInEffect) {
                // validate days of operations
                isValid = validateCityPairDays(rule[i].days, departDate);
                if (!isValid) {
                    // alert(rule[i].message);
                    $('#closeButton_error_cityPair').click(function () {
                        $('#error_cityPair').modal('hide');
                    });
                    $('#closeButton_cityPair').click(function () {
                        $('#error_cityPair').modal('hide');
                    });

                    $("#cityPairMessage").text(rule[i].message);
                    $('#error_cityPair').modal(); // Show international popup error

                //    cityPairMessage(rule[i].message);
                    return isValid;
                }
            }
        }
    }

    if (returnDate != '' && isValid == true) {
        isValid = validateCityPairRules(destination, origin, returnDate, '');
    }
    return isValid;
}



function getDateFromString(stringDate) {
    var temp = '';
    var year = '';
    var month = '';
    var day = '';

    if (stringDate == undefined || stringDate == '' || stringDate == null) return null;

    if (stringDate.indexOf("/") > -1) {
        month = new Number(stringDate.substring(0, stringDate.indexOf("/"))) - 1;
        temp = stringDate.substring(stringDate.indexOf("/") + 1);
    }
    if (temp != '' && temp.indexOf("/") > -1) {
        day = temp.substring(0, temp.indexOf("/"));
        year = temp.substring(temp.indexOf("/") + 1);
    }
    return new Date(year, month, day);
}

function getCityRule(origin, destination) {
    //debugger;
    var rules = new Array();

    if (StationsTimeTable[origin + destination] != undefined)
        rules = rules.concat(StationsTimeTable[origin + destination]);

    if (StationsTimeTable["ANY" + destination] != undefined)
        rules = rules.concat(StationsTimeTable["ANY" + destination]);

    if (StationsTimeTable[origin + "ANY"] != undefined)
        rules = rules.concat(StationsTimeTable[origin + "ANY"]);

    if (StationsTimeTable["ANYANY"] != undefined)
        rules = rules.concat(StationsTimeTable["ANYANY"]);

    return rules;
}

function validateCityPairDates(startDate, endDate, dateToValidate, origin, destination) {
    //debugger;
    var isValid = false;
    if (origin == "ANY" && destination == "ANY") {
        if (dateToValidate > startDate && dateToValidate <= endDate) {
            return true;
        }
    }
    else {
        if (dateToValidate >= startDate && dateToValidate <= endDate) {
            return true;
        }
    }
    return isValid;
}

function validateCityPairDays(days, dateToValidate) {
    //debugger;
    var isValid = true;
    switch (dateToValidate.getDay()) {
        case 0:
            isValid = (days[0].toLowerCase() == 'true')
            break;
        case 1:
            isValid = (days[1].toLowerCase() == 'true')
            break;
        case 2:
            isValid = (days[2].toLowerCase() == 'true')
            break;
        case 3:
            isValid = (days[3].toLowerCase() == 'true')
            break;
        case 4:
            isValid = (days[4].toLowerCase() == 'true')
            break;
        case 5:
            isValid = (days[5].toLowerCase() == 'true')
            break;
        case 6:
            isValid = (days[6].toLowerCase() == 'true')
            break;
    }
    return isValid;
}