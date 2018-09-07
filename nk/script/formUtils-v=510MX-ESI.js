/**
*   Requires: 
*   - global.js
*/

// TODO: Remove this polyfill!!
// If native trim doesn't exist
if (!String.prototype["trim"]) {
    String.prototype["trim"] = function () {
        return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
}

// Cache document object for performance
if (!_document) { var _document = document; }

/**
* DecorateFields - Static Obj
* Contains functionality to create masks for checkboxes and drop-downs.
*/

// Base Decorate Vars
var DecorateFields = {
    selectsCnt: 0, checkboxesCnt: 0, radioCnt: 0,
    chkBxFrag: '<span class="field_chkbx" />',
    radioFrag: '<span class="field_radio" />',
    selectFrag: '<span class="selected_index">&nbsp;</span><ul class="select_options"></ul>',
    optionDocFrag: null,
    selectPre: "obj",
    liPre: "_li_"
};
// Decorate Checkboxes & Selects
DecorateFields.decorateFormFields = function (obj, onHidden) {
    console.error('The function decorateFormFields has been removed.');
};
// Decorate Checkboxes with HTML 
DecorateFields.decorateCheckboxes = function (obj, onHidden) {
    console.error('The function decorateCheckboxes has been removed.');
};
// Decorate Radio with HTML 
DecorateFields.decorateRadioBtns = function (obj, onHidden) {
    console.error('The function decorateRadioBtns has been removed.');
};
// Iterate over options, creating <li>s in preparation to populate <ul>
DecorateFields.copyOptionsToListFragment = function (optList, prefix, listTag) {
    console.error('The function copyOptionsToListFragment has been removed.');
};
// Decorate Selects with HTML
DecorateFields.decorateSelects = function (obj, onHidden) {
    console.error('The function decorateSelects has been removed.');
};
// Replicate select options into UL
DecorateFields.populateSelectMask = function (maskEle) {
    console.error('The function populateSelectMask has been removed.');
};
// Backwards Compatibility
function decorateFormFields(obj, onHidden) {
    DecorateFields.decorateFormFields(obj, onHidden);
};


/**
* Functions and event bindings for checkbox and drop-down masks.
*/

// Click Events on Form Elements
function toggleCheckBox(obj) {
    var $this = $(obj),
        $input = $this.find("input");
    if ($this.hasClass("active")) {
        $this.removeClass("active");
        $input.prop("checked", false);
    } else {
        $this.addClass("active");
        $input.prop("checked", true);
    }
    $input.trigger('change');
};
function closeSelects(obj) {
    var $fieldSelects = $(".field_select");
    if ($fieldSelects.length > 0) {
        if (obj) {
            $fieldSelects.not(obj).removeClass('active');
        } else {
            $fieldSelects.removeClass('active');
        }
    }
}
function toggleSelect(obj) {
    var $this = $(obj);
    if ($this.hasClass("active")) {
        $this.removeClass("active");
    } else {
        $this.addClass("active");
    }
};
function updateSelect(obj) {
    var $this = $(obj),
        $parent = $(obj).closest(".field_select"),
        $select = $parent.children("select").first();
    $select.prop('selectedIndex', $this.prop('class')).trigger('change');
    var text = $select.find("option:selected").text();
    if (text == "") { text = "&nbsp;"; }
    $parent.find(".selected_index").html(text);
};
function fieldCheckBoxEvent() {
    if ($(this).hasClass("disabled") == false) {
        closeSelects(); toggleCheckBox(this);
    }
};
function fieldRadioBtnEvent() {
    if ($(this).hasClass("disabled") == false) {
        closeSelects(); toggleRadioBtn(this);
    }
};
function toggleRadioBtn(obj) {
    var $this = $(obj),
        $input = $this.find("input"),
        name = $input.attr("name"),
        radioGroup = $this.closest('form')[0].elements[name],
        $radioGroup = $(radioGroup);

    $radioGroup.each(function () {
        var $ele = $(this);
        $ele.removeAttr('checked');
        $ele.closest('.field_radio').removeClass('active');
    });

    $this.addClass("active");
    $input.attr("checked", "checked");
    var inputClick = $input[0].onclick;
    if (inputClick) {
        inputClick();
    }
};
function fieldSelectEvent() {
    //console.log('fieldSelectEvent() called');
    //if ($(this).prop('populated') != 1) {
    DecorateFields.populateSelectMask(this);
    //}
    if ($(this).hasClass("disabled") == false) {
        closeSelects(this); toggleSelect(this);
    }
};
function updateSelectEvent() {
    updateSelect(this);
};
// Basic bind Events for Selects and Checkboxes
$('body').on('focus', ':input', function () { closeSelects(); })

$('body').on('click', '.field_chkbx', fieldCheckBoxEvent);

$('body').on('click', '.field_radio', fieldRadioBtnEvent);

$('body').on('click', '.field_select', fieldSelectEvent);

$(".select_options").on('click', 'li', updateSelectEvent);

// Country / State bindings
function updateStateFromMask(obj) {
    //console.log("updateStateFromMask() called");
    var $select = $(obj).closest(".field_select").children("select").first();
    //console.log($select.val());
    updateStateWith($select);
    //console.log($select.attr("stateDDL"));
    var $target = $($select.attr("stateDDL"));
    DecorateFields.populateSelectMask($target.closest(".field_select"));

    var $stateTxt = $($select.attr('stateTXT'));
    if ($stateTxt.val() == selectedState) {
        $stateTxt.val('');
    }
};
function updateStateFromMaskEvent() {
    updateStateFromMask(this);
};

$(".field_select.country .select_options").on('click', 'li', updateStateFromMaskEvent);

// jQuery Interface to Drop-Down Masks
(function ($) {
    var methods = {
        init: function (options) {
            var req = options || {};
        },
        lock: function (bool) {
            var lockMask = Boolean(bool);
            return this.each(function () {
                var $this = $(this);
                if ($this.hasClass('.field_select') == false) {
                    $this = $this.closest(".field_select");
                }
                if (lockMask) {
                    $this.addClass("disabled");
                } else {
                    $this.removeClass("disabled");
                }
            });
        },
        disable: function (bool) {
            var disableMask = Boolean(bool);
            return this.each(function () {
                var $this = $(this);
                var $select;
                if ($this.hasClass('.field_select') == false) {
                    $select = $this;
                    $this = $this.closest('.field_select');
                } else {
                    $select = $this.children('select').first();
                }
                if (disableMask) {
                    $select.prop('disabled', true);
                    $this.selectMask('lock', true);
                } else {
                    $select.prop('disabled', false);
                    $this.selectMask('lock', false);
                }
            });
        },
        setIndex: function (strVal) { //sets selectedIndex
            return this.each(function () {
                var $this = $(this);
                var $select;
                if ($this.hasClass('.field_select') == false) {
                    $select = $this;
                    $this = $this.closest('.field_select');
                } else {
                    $select = $this.children('select').first();
                }
            });
        },
        getIndex: function () { //gets selectedIndex
            return this.each(function () {
                var $this = $(this);
                var $select;
                if ($this.hasClass('.field_select') == false) {
                    $select = $this;
                    $this = $this.closest('.field_select');
                } else {
                    $select = $this.children('select').first();
                }
            });
        },
        setValue: function (strVal) { //sets selectedIndex from value
            return this.each(function () {
                var $this = $(this);
                var $select;
                if ($this.hasClass('.field_select') == false) {
                    $select = $this;
                    $this = $this.closest('.field_select');
                } else {
                    $select = $this.children('select').first();
                }
            });
        },
        getValue: function () { //gets value
            return this.each(function () {
                var $this = $(this);
                var $select;
                if ($this.hasClass('.field_select') == false) {
                    $select = $this;
                    $this = $this.closest('.field_select');
                } else {
                    $select = $this.children('select').first();
                }
                var selector = "option[value='" + val + "']";
                //console.log("selector: "+selector+"  - pos: "+$select.children(selector).index());
                $select.prop('selectedIndex', $select.children(selector).index());
                var text = $select.find("option:selected").first().text();
                if ($.trim(text) == "") { text = "&nbsp;"; }
                $this.find(".selected_index").html(text);
            });
        },
        setText: function (strVal) { //sets selectedIndex from text
            return this.each(function () {
                var $this = $(this);
                var $select;
                if ($this.hasClass('.field_select') == false) {
                    $select = $this;
                    $this = $this.closest('.field_select');
                } else {
                    $select = $this.children('select').first();
                }
            });
        },
        getText: function () { //gets text
            return this.each(function () {
                var $this = $(this);
                var $select;
                if ($this.hasClass('.field_select') == false) {
                    $select = $this;
                    $this = $this.closest('.field_select');
                } else {
                    $select = $this.children('select').first();
                }
            });
        }
    };
    $.fn.selectMask = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.selectMask');
        }
    };
    $.fn.lockSelect = function () {
        $(this).selectMask('lock', true);
    };
    $.fn.unLockSelect = function () {
        $(this).selectMask('lock', false);
    };
    $.fn.disableSelect = function () {
        $(this).selectMask('disable', true);
    };
    $.fn.enableSelect = function () {
        $(this).selectMask('disable', false);
    };
    $.fn.setSelectByValue = function (strVal) {
        var val = strVal;
        return this.each(function () {
            var $this = $(this);
            var $select;
            //console.log("value: "+val);
            if ($this.hasClass('.field_select') == false) {
                $select = $this;
                $this = $this.closest('.field_select');
            } else {
                $select = $this.children('select').first();
            }
            var selector = "option[value='" + val + "']";
            //console.log("selector: "+selector+"  - pos: "+$select.children(selector).index());
            $select.prop('selectedIndex', $select.children(selector).index());
            var text = $select.find("option:selected").first().text();
            if ($.trim(text) == "") { text = "&nbsp;"; }
            $this.find(".selected_index").html(text);
        });
    };
    $.fn.setSelectByIndex = function (strVal) {
        var val = parseInt(strVal);
        return this.each(function () {
            var $this = $(this);
            var $select;
            //console.log("selected index: "+val);
            if ($this.hasClass('.field_select') == false) {
                $select = $this;
                $this = $this.closest('.field_select');
            } else {
                $select = $this.children('select').first();
            }
            $select.prop('selectedIndex', val);
            var text = $select.find("option:selected").first().text();
            if ($.trim(text) == "") { text = "&nbsp;"; }
            $this.find(".selected_index").html(text);
        });
    };
    $.fn.setSelectCountry = function (strVal) {
        var val = strVal;
        return this.each(function () {
            var $this = $(this);
            var $select;
            //console.log("country: "+val);
            if ($this.hasClass('.field_select') == false) {
                $select = $this;
                $this = $this.closest('.field_select');
            } else {
                $select = $this.children('select').first();
            }
            $this.setSelectByValue(val);
            updateStateFromMask($select);
        });
    };
})(jQuery);

function disableSelectMask(obj) {
    $(obj).lockSelect();
};

function enableSelectMask(obj) {
    $(obj).unLockSelect();
};

function BubbleHelper(target) {
    var bubble = target;
    var $bubble = $(bubble);
    var lastObjMarked;

    //console.log(bubble);
    //console.log($bubble);

    function hideEvent() {
        hide();
    }

    function display(obj, msg, focusHide, altObj) {
        if ($bubble.length == 0) {
            $bubble = $(bubble);
        }
        if (obj && msg) {
            if (lastObjMarked) {
                $(lastObjMarked).unbind('focus', hideEvent);
                lastObjMarked = null;
            }

            var $obj = $(obj),
                $ele = $obj;
            if (obj.nodeName == "SELECT" && $obj.attr("ismask") == "true") {
                $ele = $obj.closest('.field_select');
            } else if (obj.nodeName == "INPUT" && obj.type == "checkbox" && $obj.attr("ismask") == "true") {
                $ele = $obj.closest('.field_chkbx');
            }
            
            var offset = altObj ? $(altObj).offset() : $ele.offset();
            var parentOffset = $('#content').offset();

            $bubble.children('p').first().text(msg);
            $bubble.show();

            var adjustedOffsetTop = parseInt(offset.top);
            var adjustedOffsetLeft = parseInt(offset.left);

            if ($obj.data('inpopup') === true) {
                parentOffset = $obj.closest('.modal-body').offset();
                adjustedOffsetTop = parseInt(offset.top - parentOffset.top);
                adjustedOffsetLeft = parseInt(offset.left - parentOffset.left);
            }

            var leftPos = adjustedOffsetLeft;

            if (obj.type && obj.type == "checkbox") {
                // Defect id: 13182
                leftPos = leftPos - 25;
            } else if ($obj.hasClass('checkBoxMask')) {
                leftPos = leftPos - 35;
                topPos = parseInt(adjustedOffsetTop - ($bubble[0].clientHeight + 15));
            }

            $bubble.css("left", leftPos);

            var topPos = parseInt(adjustedOffsetTop - ($bubble[0].clientHeight + 30));
            if (obj.type && obj.type == "checkbox") {
                topPos = parseInt(adjustedOffsetTop - ($bubble[0].clientHeight + 35));
            } else if ($obj.hasClass('checkBoxMask')) {
                topPos = parseInt(adjustedOffsetTop - ($bubble[0].clientHeight + 15));
            }
            $bubble.css("top", topPos);

            window.scrollTo(0, topPos - 10);

            // Hack to resolve bug 3818.
            if (altObj) {
                if (altObj.attr('id') == 'tg_error_goes_here') {
                    $bubble.css("left", leftPos + 11);
                    $bubble.css("top", topPos + 10);
                }
			}

			// Another hack.  What's one more at this point?
			if ($obj.attr('id') == 'fsActualNumber') {
				$bubble.css('top', topPos - 75);
			}
			
            if (focusHide != 'false') {
                // Set bindings & state
                lastObjMarked = obj;
                setTimeout(function () {
                    $obj.bind('focus click', hideEvent);
                }, 250);
            }

            $bubble.hide();
            //$bubble.children('p').first().width($bubble.width());
            $bubble.show();

            $(window).on('resize', function () {
                var offset = $ele.offset(),
                    parentOffset = $('#content').offset();

                var adjustedOffsetTop = parseInt(offset.top),
                    adjustedOffsetLeft = parseInt(offset.left);

                var leftPos = adjustedOffsetLeft;
                if (obj.type && obj.type == "checkbox") {
                    // Defect id: 13182
                    leftPos = leftPos - 40;
                } else if ($obj.hasClass('checkBoxMask')) {
                    leftPos = leftPos - 25;
                    topPos = parseInt(adjustedOffsetTop - ($bubble[0].clientHeight + 15));
                }

                $bubble.css("left", leftPos);
				
                var topPos = parseInt(adjustedOffsetTop - ($bubble[0].clientHeight + 30));
                if (obj.type && obj.type == "checkbox") {
                    topPos = parseInt(adjustedOffsetTop - ($bubble[0].clientHeight + 21));
                } else if ($obj.hasClass('checkBoxMask')) {
                    topPos = parseInt(adjustedOffsetTop - ($bubble[0].clientHeight + 15));
                }
                $bubble.css("top", topPos);

                // Hack to resolve bug 3818.
                if (altObj) {
                    if (altObj.attr('id') == 'tg_error_goes_here') {
                        $bubble.css("left", leftPos + 11);
                        $bubble.css("top", topPos + 10);
                    }
				}

	            // Another hack.  What's one more at this point?
	            if ($obj.attr('id') == 'fsActualNumber') {
		            $bubble.css('top', topPos - 75);
	            }
            });
        }
    }
    this.display = display;

    function hide() {
        if ($bubble.length == 0) {
            $bubble = $(bubble);
        }
        $bubble.children('p').first().text('');
        $bubble.hide();
        if (lastObjMarked) {
            $(lastObjMarked).unbind('focus click', hideEvent);
            lastObjMarked = null;
        }
    }
    this.hide = hide;
};

/**
* Validator Class
* For creating a group of form Validations to perform.
* Creates a new instance of Validator. 
*/
function Validator(bublId) {
    this.hasEvents = false; // TODO: What's this for?
    var validationQueue = {}; // This is a hash
    var bubbleId = bublId || "#error_msg_bubble"; // Create a get method (or obj?) for retreiving/using the bubble obj
    var errClass = this.errClass = "validationError";
    var BubbleClear = true;
    //console.log(bubbleId);

    function addField(key, validationList) {
        validationQueue[key] = validationList; // Expecting array of objects
    };
    this.addField = addField;

    function getField(key) { // should be private
        if (validationQueue[key]) {
            return validationQueue[key];
        }
        return [];
    };
    this.getField = getField;

    var bubble = new BubbleHelper(bubbleId);

    function hideBubble() {
        bubble.hide();
    };
    this.hideBubble = hideBubble;

    function clearBubble(jqObj) {
        hideBubble();
        //console.log("clear bubble");
        var objs = $(jqObj) || $("[validatekey]");
        objs.removeClass(errClass);
        $(window).off('resize');
    };
    this.clearBubble = clearBubble;

    function displayBubble(obj, msg) {
        bubble.display(obj, msg);
    };

    this.displayBubble = displayBubble;

    $(window).on('load', clearBubble);


};
Validator.prototype = {
    displayBubbleFromRef: function (obj, msgRef) { // Get the error message from an element attribute
        if (obj && msgRef) {
            //console.log("display bubble from ref");
            this.displayBubble(obj, $(obj).prop(msgRef));
        }
    },
    markError: function (objArr) {
        //console.log('markError count: ' + objArr.length);
        for (var i = 0, j = objArr.length; i < j; i++) {
            var $obj = $(objArr[i]);
            if ($obj.prop('nodeName') != "SELECT") {
                $obj.addClass(this.errClass);
            } else {
                if ($obj.attr("ismask") == "true") {
                    $obj.closest('.field_select').addClass(this.errClass);
                } else {
                    $obj.addClass(this.errClass);
                }
            }
            //console.log('marking obj: ' + $obj.prop('name') + ' - ' + $obj.prop('nodeName'));
        }
    },
    clearError: function (objArr) {
        //console.log('clearError count: ' + objArr.length);
        for (var i = 0, j = objArr.length; i < j; i++) {
            var $obj = $(objArr[i]);
            if ($obj.prop('nodeName') != "SELECT") {
                $obj.removeClass(this.errClass);
            } else {
                $obj.closest('.field_select').removeClass(this.errClass);
            }
            //console.log('clearing obj: ' + $obj.prop('name') + ' - ' + $obj.prop('nodeName'));
        }
    },
    cleanField: function (ele) {
        if ((ele.type && (ele.type == "text" || ele.type == "password")) || ele.nodeName == "TEXTAREA") {
            var valueStr = ele.value;
            valueStr = valueStr.trim();
            while (valueStr.indexOf("  ") > -1) {
                valueStr = valueStr.replace("  ", " ");
            }
            ele.value = valueStr;
        }
    },
    processValidateField: function (ele, fromForm) { // Validate a field
        //console.log('processField called');
        this.cleanField(ele);
        var isSubmit = (fromForm != null) ? fromForm : false;
        var result = true,
            $ele = $(ele),
            key = $ele.attr('validatekey');
        if (key) {
            var validations = this.getField(key);
            for (var i = 0, j = validations.length; i < j; i++) {
                var validation = validations[i];
                if (result &&
                    (!validation.condition || (validation.condition && validation.condition() == true)) &&
                    (!validation.submitonly || (validation.submitonly && validation.submitonly == "true" && isSubmit))) {
                    if (!validation.params) {
                        //console.log("no params");
                        result = validation.fn(ele);
                    } else if ($.isArray(validation.params)) {
                        //console.log("array of params");
                        var args = [];
                        args.push(ele);
                        args = args.concat(validation.params);
                        result = validation.fn.apply(window, args);
                    } else {
                        //console.log("one param");
                        result = validation.fn(ele, validation.params);
                    }
                    //console.log(ele.value + " - " + result);
                    var eles = [];
                    eles.push(ele);
                    if (validation.dependents) {
                        eles = eles.concat(validation.dependents);
                        //console.log("added dependents, count: " + eles.length);
                    }
                    this.clearBubble($ele);

                }
            }
        }
        return result;
    },
    processField: function (ele, fromForm) { // Validate a field
        //console.log('processField called');
        this.cleanField(ele);
        var isSubmit = (fromForm != null) ? fromForm : false;
        var result = true,
            $ele = $(ele),
            key = $ele.attr('validatekey');
        if (key) {
            var validations = this.getField(key);
            for (var i = 0, j = validations.length; i < j; i++) {
                var validation = validations[i];
                if (result &&
                    (!validation.condition || (validation.condition && validation.condition() == true)) &&
                    (!validation.submitonly || (validation.submitonly && validation.submitonly == "true" && isSubmit))) {
                    if (!validation.params) {
                        //console.log("no params");
                        result = validation.fn(ele);
                    } else if ($.isArray(validation.params)) {
                        //console.log("array of params");
                        var args = [];
                        args.push(ele);
                        args = args.concat(validation.params);
                        result = validation.fn.apply(window, args);
                    } else {
                        //console.log("one param");
                        result = validation.fn(ele, validation.params);
                    }
                    //console.log(ele.value + " - " + result);
                    var eles = [];
                    eles.push(ele);
                    if (validation.dependents) {
                        eles = eles.concat(validation.dependents);
                        //console.log("added dependents, count: " + eles.length);
                    }

                    if (!result) {
                        this.clearBubble($ele);

                        //this.markError(eles);

                        if (validation.msg) {
                            this.displayBubble(ele, validation.msg);
                            $("#error_msg_bubble").attr("tabindex", "-1");
                            $("#error_msg_bubble").focus();
                        } else if (validation.msgRef) {
                            this.displayBubbleFromRef(ele, validation.msgRef);
                        }
                        break;
                    } else {
                        this.clearError(eles);

                        this.clearBubble($ele);
                    }
                }
            }
        }
        return result;
    },
    ValidateOnly: function (obj) {
        var $frm = $(obj).closest("form"),
            frm = $frm[0],
            fields = frm.elements;
        $frm
            .find(':input').removeClass(this.errClass)
            .end()
            .find('.field_select').removeClass(this.errClass);
        for (var i = 0, j = fields.length; i < j; i++) {
            var field = fields[i];
            var key = $(field).attr('validatekey');
            if (key) {
                var result = true;
                result = this.processValidateField(field, true);
                if (!result) {

                    return false;
                }
            }
        }
        return true;

    },
    processForm: function (obj) { // Validate all relavent fields		

        var $frm = $(obj).closest("form"),
            frm = $frm[0],
            fields = frm.elements;
        $frm
            .find(':input').removeClass(this.errClass)
            .end()
            .find('.field_select').removeClass(this.errClass);
        for (var i = 0, j = fields.length; i < j; i++) {
            var field = fields[i];
            var key = $(field).attr('validatekey');
            if (key) {
                var result = true;
                result = this.processField(field, true);
                if (!result) {
                    return false;
                }
            }
        }
        return true;
    }

};
