$(function(){
    var hb = new Array();

  $('a.showContentBig').each(function(i){
    // Get the content
    var $title = $(this).next('div.stopOverInfo').find('p.title').html();
    var $content = $(this).next('div.stopOverInfo').children('div.hideShow').html();

    hb[i] = new HelpBalloon({
        container: this, 
        title: $title,
        content: $content
    });
  });
  
  $('a.showContentSmall').each(function(i){
    // Get the content
    var $title = $(this).next('div.stopOverInfo').find('p.title').html();
    var $content = $(this).next('div.stopOverInfo').children('div.hideShow').html();
    hb[i] = new HelpBalloon({
        size: 'small',
        container: this, 
        title: $title,
        content: $content
    });
  });  
});

function getCharCodeFromEvent(evt)
{
    var evt  = (evt) ? evt : ((event) ? event : null);
    return evt.charCode;
}

// Calculate Fare
function calculate() 
{
    var nTotal =
        parseFloat(document.getElementById("taxesfees").value) +
        parseFloat(document.getElementById("airfare").value) +
	    parseFloat(document.getElementById("fare").value) + 
	    parseFloat(document.getElementById("insurance").value);
	
	document.getElementById("total").value = nTotal;
	document.getElementById("totaldue").value = nTotal;
}

function calculate_subtractadd(obj,obj2)
{
    var el = document.getElementById(obj);
	if ( el.style.display != 'none' ) 
	{
	    var nTotal  =
	        parseFloat(document.getElementById("total").value) + 
	        parseFloat(document.getElementById(obj2).value);
	    document.getElementById("total").value = nTotal;
    	document.getElementById("totaldue").value = nTotal;
	}
	else 
	{
        var nTotal   =
	        parseFloat(document.getElementById("total").value) -
	        parseFloat(document.getElementById(obj2).value);
	    document.getElementById("total").value = nTotal;
	    document.getElementById("totaldue").value = nTotal;
	}
}

function delCookie(name)
{
	setCookie(name, "", -1);
}

function setCookie(name, value, days)
{
	var expires
	if (days)
	{
		var date = new Date();
		date.setTime (date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
	}
	else expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name)
{
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i=0; i < ca.length; i++)
	{
		var c = ca[i]; 
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

//This function is used im MyRes - Both for purchase of Seats and Bags
function CheckTermsAndConditions(controlId, warning)
{
  
 if (  $("input:checkbox[id*='CheckBoxTermsConditions']").attr("ischecked") == "YES"  ||    $('#'+controlId).is(':checked')  )
    {   return true;  }
    else
    {    
        alert(warning);
		$('#'+controlId).focus();
        return false;
	}
}

function validateAtLeastOneSeatSelected(controlId, warning) {

    //There is a price so at least 1 seat was selected        
    if ($("#paxSeatFeeTotal").text() != "$0.00") {
    return true; }
    else {
        //Zero seats selected - don't continue
        $('#' + controlId).focus();
        return false;
    }
}



function checkEnter(a, b) 
{
    var c = (c) ? c : ((a) ? a : null);
    var d = (c.target) ? c.target : ((c.srcElement) ? c.srcElement : null);
    if ((c.keyCode == 13)) 
    {
        var e = $('#' + b);
        if (e.length) 
        {
            var g = e.attr('onclick');
            var h = e.attr('href');
            var i = true;
            if (g != null) 
            {
                var f = typeof (g) == 'function' ? g : new Function(g);
                i = f.apply(e[0])
            }

            if (h != null) 
            {
                i && eval(h)
            }
        }
        c.cancelBubble = true;
    }
}
try
{
    $.extend($.ui.dialog.prototype.options, {
        resizable: false
    });
}catch(ex) {}
