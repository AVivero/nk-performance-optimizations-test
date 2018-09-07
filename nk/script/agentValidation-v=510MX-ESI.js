$(document).ready(function () {

    // Get all the required input nodes and prep their events
    $("input[required='true']").change(function () {
        validateOnlyThis(this);
    });

    $("input[required='true']").click(function () {
        $(this).parent("div.container").children("div.bubble").remove();
        hideAllBubbles(this);
        clearBubble(this);
        $("div.bubble").remove();       
    });

    //$("input[required='true']").blur(function () {
    //    $(this).removeClass("errorField");
    //    $("div.bubble").remove();
    //    $(this).parent("div.container").children("div.bubble").remove();
    //    hideAllBubbles(this);
    //    clearBubble(this);
    //    validateOnlyThis(this);
    //});

});

var specificErrorBubble = "<div id='error_msg_bubble' class='bubble'><span class='arrow ' /></div>";
var isIE7 = (function () { return ($.browser.msie && (parseFloat($.browser.version) == 7)) })();
var errorsHeader = 'Please correct the following.\n\n';
var canLookAhead = "!Abcdabcd123".match("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=!.*[\\.,~])(?=.*\\W).{8,32}$");

function cleanZIndex(obj) {
    var dropDown = $(obj).closest('table[id]').find("td.IEdropDown");
    var realzindex = dropDown.attr("realzindex");
    if (realzindex && realzindex != "") {
        dropDown.css("z-index", realzindex);
        //alert('z-index -- saved : ' + realzindex + ', actual:' + dropDown.css("z-index"));
    }
}

function clearBubble(obj) {
    var id = $(obj).closest('table[id]').attr('id');
    if (id == "validateCreditCard") {
        $(obj).closest('table[id]').find("td.IEdropDown").attr("style", "position:relative");
    }
    else if (id == "juniperCardApplication" && isIE7) {
        cleanZIndex(obj);
    }
}

function hideAllBubbles(fieldInQuestion) {
    $("input[required='true']").each(function () {
        var id = $(this).closest('table[id]').attr('id');
        if (id == "juniperCardApplication" && isIE7) {
            cleanZIndex(this);
        }
    });
}

//var bubbleCounter = 100;

function showBubble(obj, errorType, msg) {

    $(obj).unbind('focus click', hide);
    $('body').children("div.bubble").remove();
    $('body').append(errorType);
    $('body').children("div.bubble").append('<p>' + msg + '</p>');


    var top = obj.offset().top - $("div.bubble").height() - 50;
   // var top = obj.offset().top - obj.parent().css('padding-top').replace("px", "") - 67;
    var left = obj.offset().left;

    if (obj.attr('class') === 'checkBoxMaskWrapper') {
        $('body').children("div.bubble").css({
            'left': left - 37,
            'top': top + 15
        });
    }

    else {
        $('body').children("div.bubble").css({
            'left': left,
            'top': top
        });
    }

    function hide() {
        $("div.bubble").remove();
    }

//    setTimeout(function () {
//        $(obj).bind('focus click', hide);
//    }, 250);
}

function showSpecificBubble(obj, msg) {
    showBubble(obj, specificErrorBubble, msg);
}

function validateOnlyThis(e) {
    var validate = new Validate(document['SkySales'], $(e).attr("id"));
    validate.preventSetFocus = true;
    validate.validateSingleElement(e);
    return validate.outputErrors();
}

// Get all the required input nodes and prep their events
//$("input[required='true']").change(function () {
//    validateOnlyThis($(this));
//});

//$("input[required='true']").focus(function () {
//    $(this).removeClass("error");
//    $(this).next("div.bubble").remove();
//    hideAllBubbles(this);
//    clearBubble(this);
//});

//$("input[required='true']").blur(function () {
//    $(this).removeClass("error");
//    $(this).next("div.bubble").remove();
//     hideAllBubbles(this);
//    clearBubble(this);
//});

function Validate(form, controlID, errorsHeader, regexElementIdFilter) {
    // set up properties
    this.preventSetFocus = false;
    this.form = form;
    this.namespace = controlID;
    this.errors = '';
    this.setfocus = null;
    this.errorsHeader = errorsHeader;
    this.namedErrors = new Array();
    if (regexElementIdFilter) {
        this.regexElementIdFilter = regexElementIdFilter;
    }
    // set up attributes
    this.requiredAttribute = 'required';
    this.requiredEmptyAttribute = 'requiredempty';
    this.validationTypeAttribute = 'validationtype';
    this.regexAttribute = 'regex';
    this.minLengthAttribute = 'minlength';
    this.numericMinLengthAttribute = 'numericminlength';
    this.maxLengthAttribute = 'maxlength';
    this.numericMaxLengthAttribute = 'numericmaxlength';
    this.minValueAttribute = 'minvalue';
    this.maxValueAttribute = 'maxvalue';
    this.equalsAttribute = 'equals';
    this.confirmsAttribute = 'confirms';

    // set up error handling attributes
    this.defaultErrorAttribute = 'error';
    this.requiredErrorAttribute = 'requirederror';
    this.validationTypeErrorAttribute = 'validationtypeerror';
    this.regexErrorAttribute = 'regexerror';
    this.minLengthErrorAttribute = 'minlengtherror';
    this.maxLengthErrorAttribute = 'maxlengtherror';
    this.minValueErrorAttribute = 'minvalueerror';
    this.maxValueErrorAttribute = 'maxvalueerror';
    this.equalsErrorAttribute = 'equalserror';
    this.confirmsErrorAttribute = 'confirmserror';

    // set up error handling default errors
    this.defaultError = '{label} is invalid.';
    this.defaultRequiredError = '{label} is required.';
    this.defaultValidationTypeError = '{label} is invalid.';
    this.defaultRegexError = '{label} is invalid.';
    this.defaultMinLengthError = '{label} is too short in length.';
    this.defaultMaxLengthError = '{label} is too long in length.';
    this.defaultMinValueError = '{label} must be greater than {minValue}.';
    this.defaultMaxValueError = '{label} must be less than {maxValue}.';
    this.defaultEqualsError = '{label} is not equal to {equals}';
    this.defaultNotEqualsError = '{label} cannot equal {equals}';
    this.defaultConfirmsError = '{label} does not match {confirms}';

    this.defaultValidationErrorClass = 'validationError';
    this.defaultValidationErrorLabelClass = 'validationErrorLabel';

    // add methods to object
    this.run = run;
    this.runBySelector = runBySelector;
    this.validateSingleElement = validateSingleElement;
    this.outputErrors = outputErrors;
    this.checkFocus = checkFocus;
    this.setError = setError;
    this.cleanAttributeForErrorDisplay = cleanAttributeForErrorDisplay;
    this.OldvalidateRequired = OldvalidateRequired;
    this.validateType = validateType;
    this.validateRegex = validateRegex;
    this.validateMinLength = validateMinLength;
    this.validateMaxLength = validateMaxLength;
    this.validateMinValue = validateMinValue;
    this.validateMaxValue = validateMaxValue;
    this.validateEquals = validateEquals;
    this.validateConfirms = validateConfirms;
    this.isExemptFromValidation = isExemptFromValidation;

    // add validation type methods
    this.setValidateTypeError = setValidateTypeError;
    this.validateAmount = validateAmount;
    this.validateDate = validateDate;
    this.validateMod10 = validateMod10;
    this.validateNumeric = validateNumeric;

    //this.nonePattern = '^\.*$';
    this.stringPattern = '^.+$';
    this.upperCaseStringPattern = '^[A-Z]([A-Z)|\s)*$';
    this.numericPattern = '^\\d+$';
    this.numericStripper = /\D/g;
    this.alphaNumericPattern = '^\\w+$';

    var amountSeparators = '(\\.|,)';
    this.amountPattern = '^(\\d+(' + amountSeparators + '\\d+)*)$';

    this.dateYearPattern = '^\\d{4}$';
    this.dateMonthPattern = '^\\d{2}$';
    this.dateDayPattern = '^\\d{2}$';

    this.emailPattern = '^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$';
}

function checkKeyPressed(evt, input) {
    evt = (evt) ? evt : (window.event) ? event : null;
    if (evt) {
        var charCode = (evt.charCode) ? evt.charCode :
                   ((evt.keyCode) ? evt.keyCode :
                   ((evt.which) ? evt.which : 0));
        if (charCode == 13) {
            input.click();

        }
    }
}

function run(prefix) {
    var nodeArray = $('#SkySales').find(':input', 'select').get();
    // run validation on the form elements
    for (var i = 0; i < nodeArray.length; i++) {
        var e = nodeArray[i];

        if (!this.isExemptFromValidation(e)) {
            this.validateSingleElement(e);
        }
    }

    return this.outputErrors(prefix);
}

function runBySelector(selectorString) {
    var nodeArray = $(selectorString).find(':input').get();
    // run validation on the form elements
    for (var i = 0; i < nodeArray.length; i++) {
        var node = nodeArray[i];
        this.validateSingleElement(node);
    }
    return false;
}

function isExemptFromValidation(e) {
    if (e.id.indexOf(this.namespace) != 0) {
        return true;
    }

    if ((this.regexElementIdFilter) && (!e.id.match(this.regexElementIdFilter))) {
        return true;
    }

    if (this.setfocus) {
        return true;
    }

    if (e instanceof jQuery) {
        if (!e.is(":visible") && e.get(0).type != 'checkbox') {
            return true;
        }
    }
    else
        if (!$(e).is(":visible") && e.type != 'checkbox' && e.type != 'select-one') {
            return true;
        }
    return false;
}

function outputErrors(prefix) {
    // if there is an error output it
    if (this.errors) {
        if (this.setfocus && !this.preventSetFocus) {
            if ($(this.setfocus).is(":visible"))
                $(this.setfocus).focus();
            else if (this.setfocus.type == "select-one") {
                $($(this.setfocus).parents("div").get(0)).show();
                $(this.setfocus).show();
                $(this.setfocus).focus();
                $(this.setfocus).hide();
                $($(this.setfocus).parents("div").get(0)).hide();
            }
        }
        return false;
    }

    return true;
}

function validateSingleElement(e) {
    $(e).removeClass(this.defaultValidationErrorClass);
    $("label[for=" + e.id + "]").eq(0).removeClass(this.defaultValidationErrorLabelClass);

    this.OldvalidateRequired(e);
    // only validate the rest if they actually have something
    var value = getValue(e);
    if (this.errors.length < 1 && value && 0 < value.length) {
        this.validateType(e);
        this.validateRegex(e);
        this.validateMinLength(e);
        this.validateMaxLength(e);
        this.validateMinValue(e);
        this.validateMaxValue(e);
        this.validateEquals(e);
        this.validateConfirms(e);
    }
}

function checkFocus(e) {
    if (!this.setfocus) {
        this.setfocus = e;
    }
}

function OldvalidateRequired(e) {
    var requiredAttribute = this.requiredAttribute;
    var requiredEmptyAttribute = this.requiredEmptyAttribute;
    var required = eval('(e.' + requiredAttribute + ');');
    var requiredEmptyString = eval('(e.' + requiredEmptyAttribute + ');');

    if (required == null) {
        required = e.getAttribute(requiredAttribute);
    }
    if (requiredEmptyString == null) {
        requiredEmptyString = e.getAttribute(this.requiredEmptyAttribute);
    }

    if (required != null) {
        required = required.toString();
        required = required.toLowerCase();
        if (requiredEmptyString != null) {
            requiredEmptyString = requiredEmptyString.toLowerCase();
        }

        if (required == 'true') {
            var value = getValue(e);
            if (value != null) {
                if ((value.length < 1) || (value.toLowerCase() == requiredEmptyString)) {
                    this.setError(e, this.requiredErrorAttribute, this.defaultRequiredError);
                }
            }
        }
    }
}

function getValue(e) {
    if (e) {
        if (e.type == 'radio') {
            if (e.getAttribute('name').length > 0) {
                var arrayOfRadioButtons = document.getElementsByName(e.getAttribute('name'));
                for (var i = 0; i < arrayOfRadioButtons.length; i++) {
                    if (arrayOfRadioButtons[i].checked == true) {
                        return arrayOfRadioButtons[i].value;
                    }
                }
            }
            return '';
        }
        else if (e.type == 'checkbox') {
            if (e.checked == true) {
                return e.value;
            }
        }
        else {
            return e.value;
        }
    }
    return '';
}

function validateType(e) {
    var type = eval('(e.' + this.validationTypeAttribute + ');');
    if (type == null) {
        type = e.getAttribute(this.validationTypeAttribute);
    }
    //var type = e.getAttribute(this.validationTypeAttribute);
    var value = getValue(e);

    if (type) {
        type = type.toLowerCase();
        if ((type == 'address') && (!value.match(this.stringPattern))) {
            this.setValidateTypeError(e);
        }
        else if ((type == 'alphanumeric') && (!value.match(this.alphaNumericPattern))) {
            this.setValidateTypeError(e);
        }
        else if ((type == 'amount') && (!this.validateAmount(value))) {
            this.setValidateTypeError(e);
        }
        else if ((type == 'country') && (!value.match(this.stringPattern))) {
            this.setValidateTypeError(e);
        }
        else if ((type == 'email') && (!value.match(this.emailPattern))) {
            this.setValidateTypeError(e);
        }
        else if ((type == 'mod10') && (!this.validateMod10(value))) {
            this.setValidateTypeError(e);
        }
        else if ((type == 'name') && (!value.match(this.stringPattern))) {
            this.setValidateTypeError(e);
        }
        else if ((type == 'numeric') && (!this.validateNumeric(value))) {
            this.setValidateTypeError(e);
        }
        else if ((type.indexOf('date') == 0) && (!this.validateDate(e, type, value))) {
            this.setValidateTypeError(e);
        }
        else if ((type == 'state') && (!value.match(this.stringPattern))) {
            this.setValidateTypeError(e);
        }
        else if ((type == 'string') && (!value.match(this.stringPattern))) {
            this.setValidateTypeError(e);
        }
        else if ((type == 'uppercasestring') && (!value.match(this.upperCaseStringPattern))) {
            this.setValidateTypeError(e);
        }
        else if ((type == 'zip') && (!value.match(this.stringPattern))) {
            this.setValidateTypeError(e);
        }
    }
}

function validateRegex(e) {
    var regex = eval('(e.' + this.regexAttribute + ');');
    if (regex == null) {
        regex = e.getAttribute(this.regexAttribute);
    }
    //var regex = e.getAttribute(this.regexAttribute);
    var value = getValue(e);

    if ((regex) && (!value.match(regex))) {
        //Note: IE7 cannot handle "look ahead" regular expressions.  Therefore we must treat regex validation on a case by case basis
        // as of 1/7/11, only name and password fields use regex validation, and of those only password appear affected by the bug
        if (!canLookAhead && regex != "^[a-zA-Z]") {
          //  if (regex == "^(?=.*\\\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*[\\\\.,~])(?=.*\\\\W).{8,32}$"
            if (regex.indexOf("{8,32}") !== -1
            && value.length >= 8
            && value.length <= 32
            && value.search(/\d/) > -1
            && value.search(/[a-z]/) > -1
            && value.search(/[A-Z]/) > -1
            && value.search(/\W/) > -1
            && value.search(/[\.,~]/) == -1
            )
                return;
        }
        this.setError(e, this.regexErrorAttribute, this.defaultRegexError);
    }
}

function validateMinLength(e) {
    var length = eval('(e.' + this.minLengthAttribute + ');');
    var numericLength = eval('(e.' + this.numericMinLengthAttribute + ');');
    if (length == null) {
        length = e.getAttribute(this.minLengthAttribute);
    }
    if (numericLength == null) {
        numericLength = e.getAttribute(this.numericMinLengthAttribute);
    }
    //var length = e.getAttribute(this.minLengthAttribute);
    //var numericLength = e.getAttribute(this.numericMinLengthAttribute);
    var value = getValue(e);

    if ((0 < length) && (value.length < length)) {
        this.setError(e, this.minLengthErrorAttribute, this.defaultMinLengthError);
    }
    else if ((0 < numericLength) && (0 < value.length) && (value.replace(this.numericStripper, '').length < numericLength)) {
        this.setError(e, this.minLengthErrorAttribute, this.defaultMinLengthError);
    }
}

function validateMaxLength(e) {
    var length = eval('(e.' + this.maxLengthAttribute + ');');
    var numericLength = eval('(e.' + this.numericMaxLengthAttribute + ');');
    if (length == null) {
        length = e.getAttribute(this.maxLengthAttribute);
    }
    if (numericLength == null) {
        numericLength = e.getAttribute(this.numericMaxLengthAttribute);
    }
    //var length = e.getAttribute(this.maxLengthAttribute);
    //var numericLength = e.getAttribute(this.numericMaxLengthAttribute);
    var value = getValue(e);

    if ((0 < length) && (length < value.length)) {
        this.setError(e, this.maxLengthErrorAttribute, this.defaultMaxLengthError);
    }
    else if ((0 < numericLength) && (0 < value.length) && (numericLength < value.replace(this.numericStripper, '').length)) {
        this.setError(e, this.maxLengthErrorAttribute, this.defaultMaxLengthError);
    }
}

function validateMinValue(e) {
    var min = eval('(e.' + this.minValueAttribute + ');');
    if (min == null) {
        min = e.getAttribute(this.minValueAttribute);
    }
    //var min = e.getAttribute(this.minValueAttribute);

    if ((min != null) && (0 < min.length)) {
        var value = getValue(e);

        if ((5 < min.length) && (min.substring(0, 5) == '&gt;=')) {
            if (value < parseFloat(min.substring(5, min.length))) {
                this.setError(e, this.minValueErrorAttribute, this.defaultMinValueError);
            }
        }
        else if ((4 < min.length) && (min.substring(0, 4) == '&gt;')) {
            if (value <= parseFloat(min.substring(4, min.length))) {
                this.setError(e, this.minValueErrorAttribute, this.defaultMinValueError);
            }
        }
        else if (value < parseFloat(min)) {
            this.setError(e, this.minValueErrorAttribute, this.defaultMinValueError);
        }
    }
}

function validateMaxValue(e) {
    var max = eval('(e.' + this.maxValueAttribute + ');');
    if (max == null) {
        max = e.getAttribute(this.maxValueAttribute);
    }
    //var max = e.getAttribute(this.maxValueAttribute);

    if ((max != null) && (0 < max.length)) {
        var value = getValue(e);

        if ((5 < max.length) && (max.substring(0, 5) == '&lt;=')) {
            if (value > parseFloat(max.substring(5, max.length))) {
                this.setError(e, this.maxValueErrorAttribute, this.defaultMaxValueError);
            }
        }
        else if ((4 < max.length) && (max.substring(0, 4) == '&lt;')) {
            if (value >= parseFloat(max.substring(4, max.length))) {
                this.setError(e, this.maxValueErrorAttribute, this.defaultMaxValueError);
            }
        }
        else if (parseFloat(value) > max) {
            this.setError(e, this.maxValueErrorAttribute, this.defaultMaxValueError);
        }
    }
}

function validateEquals(e) {
    // eventually this should be equipped to do string
    // comparison as well as other element comparisons

    var equal = eval('(e.' + this.equalsAttribute + ');');
    if (equal == null) {
        equal = e.getAttribute(this.equalsAttribute);
    }
    //var equal = e.getAttribute(this.equalsAttribute);

    if ((equal != null) && (0 < equal.length)) {
        var value = getValue(e);

        if ((2 < equal.length) && (equal.substring(0, 2) == '!=')) {
            if (value == equal.substring(2, equal.length)) {
                this.setError(e, this.equalsErrorAttribute, this.defaultEqualsError);
            }
        }
        else if ((2 < equal.length) && (equal.substring(0, 2) == '==')) {
            if (value != equal.substring(2, equal.length)) {
                this.setError(e, this.equalsErrorAttribute, this.defaultEqualsError);
            }
        }
        else if (equal.charAt(0) == '=') {
            if (value != equal.substring(1, equal.length)) {
                this.setError(e, this.equalsErrorAttribute, this.defaultEqualsError);
            }
        }
        else if (value != equal) {
            this.setError(e, this.equalsErrorAttribute, this.defaultEqualsError);
        }
    }
}

function validateConfirms(e) {
    var confirm = eval('(e.' + this.confirmsAttribute + ');');
    if (confirm == null) {
        confirm = e.getAttribute(this.confirmsAttribute);
    }

    if ((confirm != null) && (0 < confirm.length)) {
        var prefixArray = e.id.split("_");
        prefixArray[prefixArray.length - 1] = confirm;
        confirm = "";
        for (var i = 0; i < prefixArray.length; i++) {
            if (i != 0)
                confirm = confirm + "_";
            confirm = confirm + prefixArray[i];
        }
        confirm = $("#" + confirm)[0];
        if (confirm != undefined) {
            var confirmValue = getValue(confirm);
            var value = getValue(e);

            if (confirmValue != null && value != null) {
                if (confirmValue != value) {
                    this.setError(e, this.confirmsErrorAttribute, this.defaultConfirmsError);
                }
            }
        }
    }
}

function setValidateTypeError(e) {
    this.setError(e, this.validationTypeErrorAttribute, this.defaultValidationTypeError);

}

function setError(e, errorAttribute, defaultTypeError) {
    if (e.type == 'radio') {
        var name = e.getAttribute('name');
        if (name.length > 0) {
            if (this.namedErrors[name] != null) {
                return;
            }
            this.namedErrors[name] = name;
        }
    }

    var error = eval('(e.' + errorAttribute + ');');
    if (error == null) {
        error = e.getAttribute(errorAttribute);
    }
    //var error = e.getAttribute(errorAttribute);
    if (!error) {
        if (eval('(e.' + this.defaultErrorAttribute + ');')) {
            error = eval('(e.' + this.defaultErrorAttribute + ');');
        }
        else if (defaultTypeError) {
            error = defaultTypeError;
        }
        else {
            error = this.defaultError;
        }
    }

    if (e.type == 'checkbox') {
        showSpecificBubble($(e).parent(), error);
    }
    else {
        if (e instanceof jQuery) {
            showSpecificBubble(e, error);
            e.addClass("errorField");
        }
        else {
            showSpecificBubble($(e), error);
            $(e).addClass("errorField");
        }
    }
    //alert(errorAttribute + "\n" + error + "\n" + e.requiredError);

    // this would make more sense but it doesn't work
    // so i'll do each explicitly while i make this work
    var results = error.match(/{\s*(\w+)\s*}/g);
    if (results) {
        for (var i = 0; i < results.length; i++) {
            var dollarOne = results[i].replace(/{\s*(\w+)\s*}/, '$1');
            error = error.replace(/{\s*\w+\s*}/, this.cleanAttributeForErrorDisplay(e, dollarOne));
        }
    }

    $(e).addClass(this.defaultValidationErrorClass);
    $("label[for=" + e.id + "]").eq(0).addClass(this.defaultValidationErrorLabelClass);
    //this.errors += error + '\n';
    this.errors += error + "<br/>";
    this.checkFocus($(e).get(0));

}

function cleanAttributeForErrorDisplay(e, attributeName) {
    attributeName = attributeName.toLowerCase();
    var attribute = "";
    if (attributeName == 'label') {
        attribute = $("label[for=" + e.id + "]").eq(0).text();
    }
    if ((attribute == null) || (attribute == "")) {
        attribute = e.id;
        //attribute = eval('(e.' + attributeName + ');');
        //attribute = e.getAttribute(attributeName.toLowerCase());
    }

    if (attribute == null) {
        return attributeName;
    }

    if (attributeName.match(/^(minvalue|maxvalue)$/i)) {
        return attribute.replace(/[^\d.,]/g, '');
    }

    return attribute;
}

function validateAmount(amount) {
    if ((!amount.match(this.amountPattern)) || (amount == 0)) {
        return false;
    }

    return true;
}

function validateDate(e, type, value) {
    var lowerCaseType = '';
    if (type) {
        lowerCaseType = type.toLowerCase();
    }
    var today = new Date();

    if ((lowerCaseType == 'dateyear') && ((value < today.getYear()) || (!value.match(this.dateYearPattern)))) {
        return false;
    }
    //just make sure it is two digits for now
    else if ((lowerCaseType == 'datemonth') && (!value.match(this.dateMonthPattern))) {
        return false;
    }
    //just make sure it is two digits for now
    else if ((lowerCaseType == 'dateday') && (!value.match(this.DateDayPattern))) {
        return false;
    }

    return true;
}

function validateMod10(cardNumber) {
    var ccCheckRegExp = /\D/;
    var cardNumbersOnly = cardNumber.replace(/ /g, "");

    if (!ccCheckRegExp.test(cardNumbersOnly)) {
        var numberProduct;
        var checkSumTotal = 0;

        while (cardNumbersOnly.length < 16) {
            cardNumbersOnly = '0' + cardNumbersOnly;
        }

        for (digitCounter = cardNumbersOnly.length - 1; 0 <= digitCounter; digitCounter -= 2) {
            checkSumTotal += parseInt(cardNumbersOnly.charAt(digitCounter));
            numberProduct = String((cardNumbersOnly.charAt(digitCounter - 1) * 2));
            for (var productDigitCounter = 0; productDigitCounter < numberProduct.length; productDigitCounter++) {
                checkSumTotal += parseInt(numberProduct.charAt(productDigitCounter));
            }
        }

        return (checkSumTotal % 10 == 0);
    }

    return false;
}

function validateNumeric(number) {
    number = number.replace(/\s/g, '');

    if (!number.match(this.numericPattern)) {
        return false;
    }

    return true;
}

function validateBySelector(selectorString) {
    if (selectorString != null) {
        // run validation on the form elements
        var validate = new Validate(null, '', errorsHeader, null);
        validate.runBySelector(selectorString);
        return validate.outputErrors();
    }
    return true;
}

function validate(controlID, elementName, filter) {
    //make sure we can run this javascript
    if (document.getElementById && document.createTextNode) {
        // check if you can getAttribute if you can it is an element use the id.
        if (controlID.getAttribute) {
            controlID = controlID.getAttribute("id").replace(/_\w+$/, "");
        }
        var validate = new Validate(document['SkySales'], controlID + '_', errorsHeader, filter);

        if (elementName) {
            var e = elementName;
            if (!elementName.getAttribute) {
                e = document.getElementById(controlID + "_" + elementName);
            }
            validate.validateSingleElement(e);
            return validate.outputErrors();
        }

        return validate.run(controlID);
    }

    // could not use javascript rely on server validation
    return true;
}
