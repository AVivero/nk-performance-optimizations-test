function formatPriceDisplayAmount (obj) {
	var $this = $(obj);
	if ($this.attr("realval") == null || $this.text().indexOf(".") > -1) {
		$this.attr("realval",$this.text());
	}
	var value = $this.attr("realval");
	var isNegative = (value.indexOf("-") > -1);
	if (value.indexOf("-") == 0) { value = value.replace("-", ""); }
	if ((value.indexOf("(") > -1) || (value.indexOf(")") > -1)) {
	    value = value.replace("(", "");
	    value = value.replace(")", "");
	    isNegative = true;
    }
	if (value.indexOf("$") == 0) { value = value.replace("$",""); }
	if (value.indexOf(".") > -1) {
		var splitval = value.split("."),
			dollarAmt = splitval[0],
			centsAmt = splitval[1];
		if (isNegative) { dollarAmt = "-"+dollarAmt; }
		$this.text(dollarAmt);
		if (parseInt(centsAmt) == 0) {
		    if (centsAmt.length > 1 && parseInt(centsAmt[1]) != 0) {
		        //when the second index is not 0 (zero) i.e. 09, 02
                //truncate string in case of nested values like the expanded Taxes and Fees section
		        $this.append("<sup>" + centsAmt.substring(0, 2) + "</sup>");
		    }
		    else {
		        $this.append("<sup>00</sup>");
		    }
		} else {
            var centsLen = centsAmt.length;
            if (centsLen < 1) { centsAmt = centsAmt + "0"; } // needs a 0
            else if (centsLen > 1) { centsAmt = centsAmt.substring(0,2); } // truncate string
			var sup = document.createElement("sup");
			sup.innerHTML = centsAmt;
			$this.append(sup);
		}
	} else {
		if (isNegative) { value = "-"+value; }
		$this.text(value).append("<sup>00</sup>");
	}
	$this.attr("isdecorated",true);
};
function toggleMoreInfo (obj, altValue) {
		var $this = $(obj),
			$target = $this.closest("tr").next(".sub_charges");
		if(!$this.attr("origtxt")) {
			$this.attr("origtxt",$this.text());
		}
		if($target.hasClass("hide")){
			$target.removeClass("hide");
			$this.text(altValue);
		} else {
			$target.addClass("hide");
			$this.text($this.attr("origtxt"));
		} 
};
function showBubble(obj, msg) {
    var bubbleId = "#error_msg_bubble";
    $(bubbleId).find("p").empty();
    var bubble = new BubbleHelper(bubbleId);
    var objtop = obj.position().top - 80;
    var objleft = obj.position().left - 25;
    $(bubbleId).find("p").html(msg);
    $(bubbleId).css({
        top: objtop,
        left: objleft,
        display: "block"
    });
    $(bubbleId).addClass("hertztermserror");
    window.location.hash = bubbleId;
};

function showhertztersandcondtions() {
    if ($("#hertzTermsCond").length > 0) {
        var termsAndConditions = $("input:checkbox[id*='hertzTermsCheckbox']").is(':checked');
        if (!termsAndConditions) {
			showBubble($("#hertzTermsCond"), hertzerrormsg);
			$("#hertzTermsCheckbox").focus();
            return false;
        } else {
            return true;
        }
    }
    else {
        //car upsell is turned off 
        return true;
    }
};