//(function (){
//	var modalClose = document.getElementById('closeModal');
//	if(document.getElementsByClassName){
//		var anchorTrigger = document.getElementsByClassName('modal');
//		var anchorTotal = anchorTrigger.length;
//		for(var i = 0; i < anchorTotal ; i++){
//			assignEventsMoz(anchorTrigger, i);
//		}
//	}else if(document.getElementsByTagName){
//		var i = 0;
//		var anchorTrigger = document.getElementsByTagName("a");
//		if(anchorTrigger[0].className == 'modal'){
//			var anchorTotal = anchorTrigger.length;
//			for(var i = 0; i < anchorTotal ; i++){
//				assignEventsIe(anchorTrigger, i);
//			}
//		}
//	}
//	if(modalClose.addEventListener){
//		modalClose.addEventListener('click', closeModal, false);
//	}else if(modalClose.attachEvent){
//		modalClose.attachEvent('onclick', closeModal);
//	}
//})();
//
//function assignEventsMoz(anchorTrigger, i, modalClose){
//	anchorTrigger[i].addEventListener('click', fireModal, false);
//}
//function assignEventsIe(anchorTrigger, i, modalClose){
//	anchorTrigger[i].attachEvent('onclick', fireModal);
//}
//(function (culture){
//debugger
//var test = document.getElementById("currentCulture");
//var text = test.innerHTML;

//console.log(text);
//})();

function fireModal(elem, currentCulture, ndfcSavings1, ndfcSavings2, paxCount){
//    var languaje = currentCulture;	
//	function getModalContent(filesToLoad){
//		if (window.XMLHttpRequest){
//			xhttp=new XMLHttpRequest();
//		}else{
//			xhttp=new ActiveXObject("Microsoft.XMLHTTP");
//		}
//		xhttp.open("GET",filesToLoad,false);
//		xhttp.send("");
//		return xhttp.responseXML;
//	}
//	
//	function displayResult(elem){
//		var modalContent = document.getElementById('modalContent');
//		var url = String(location.href);
//		var string = "SkySales";
//        if(url.match(string)){
//            xml=getModalContent("../"+string+"/Views/Base/Cultures/"+languaje+"/Controls/"+elem+".xml");
//		    xsl=getModalContent("../"+string+"/Views/Base/XSLT/Controls/"+elem+".xslt");
//        }else{
//            xml=getModalContent("../Views/Base/Cultures/"+languaje+"/Controls/"+elem+".xml");
//		    xsl=getModalContent("../Views/Base/XSLT/Controls/"+elem+".xslt");
//        }
//		if (window.ActiveXObject){ 
//			ex=xml.transformNode(xsl);
//			var txt = ex;
//			modalContent.innerHTML = txt ;
//		}else if (document.implementation && document.implementation.createDocument){ 
//			xsltProcessor=new XSLTProcessor();
//			xsltProcessor.importStylesheet(xsl);
//			resultDocument = xsltProcessor.transformToFragment(xml,document);
//			var txt = resultDocument;
//			modalContent.appendChild(resultDocument);
//		}
//	}
//	displayResult(elem);

        var count = $(".memberFare:checked").length;
        if(count > 0){
        
        }else if(count == 0){
            __doPostBack('CalendarMarketSelectControl$MarketSelectAjaxCalendarControl$LinkButtonSubmit', '');
            return true;//gps 3.2 should hav etrue after no memberFares selected maybe not?
        }

        var savingsPerPaxDepart = ndfcSavings1.replace(/\$/, '');
	    var savingsPerPaxArrive = ndfcSavings2.replace(/\$/, '');
	    if(savingsPerPaxDepart === ""){
	        var defineSavingsDepart = 0;
	    }else{
	        var defineSavingsDepart = parseFloat(savingsPerPaxDepart);
	    }
	    if(savingsPerPaxArrive === ""){
	        var defineSavingsArrive = 0;
	    }else{
	        var defineSavingsArrive = parseFloat(savingsPerPaxArrive);
	    }
	    var passengerCount = parseFloat(paxCount);
	    var amountToSave = defineSavingsDepart + defineSavingsArrive;
	    var allRadios = document.getElementsByTagName("input");
        for (i=0;i<allRadios.length;i++){
            if(allRadios[i].className == 'memberFare'){
                if (allRadios[i].checked == true){
                    document.getElementById('declineSavingsMember').style.display = 'block';
                    document.getElementById('declineSavingsGeneric').style.display = 'none';
                    break;
                }else{
                    document.getElementById('declineSavingsGeneric').style.display = 'block';
                    document.getElementById('declineSavingsMember').style.display = 'none';
                    //break;
                }
            }
        }
	    
        if (isTravelAgent == "True" || is9DFCMember == "True"){
            __doPostBack('CalendarMarketSelectControl$MarketSelectAjaxCalendarControl$LinkButtonSubmit', '');
            return true;
        }else if(amountToSave <= 0){
            __doPostBack('CalendarMarketSelectControl$MarketSelectAjaxCalendarControl$LinkButtonSubmit', '');
            return true;
        }else {
        var showMask = document.getElementById('mask');
	    var showModal = document.getElementById('modalWindow');
	    var windowWidth = document.body.clientWidth;
	    var windowHeight = document.body.clientHeight;
	    showMask.style.display = 'block';
	    showModal.style.display = 'block';
	    
	    
	    var totalSavings = amountToSave * passengerCount;
	    var roundedSavings = totalSavings.toFixed(2);	    
	    var savingsLegend1 = document.getElementById("savingsAmount1");
	    var savingsLegend2 = document.getElementById("savingsAmount2");
	    var savingsLegend3 = document.getElementById("savingsAmount3");
	    savingsLegend1.innerHTML = " $"+roundedSavings;
	    savingsLegend2.innerHTML = " $"+roundedSavings;
	    savingsLegend3.innerHTML = " $"+roundedSavings;
    	
	    var modalWidth = showModal.offsetWidth;
	    var modalHeight = showModal.offsetHeight;
	    var leftPos = (windowWidth-modalWidth)/2;
	    showMask.style.height = windowHeight+'px';
	    showModal.style.left = leftPos+'px';
	    showModal.style.top = '200px';
    	
	    function fadeIn(showMask){
		    if(showMask.style){
			    showMask.style.opacity= '0';
		    }
		    if(showMask.style){
			    showMask.style.filter= "alpha(opacity=0)";
		    }
    		
		    if (navigator.userAgent.indexOf('MSIE') !=-1){
			    var animate = setInterval(function(){
				    if(showMask.style.filter){
					    var getCurrentOpacity = showMask.style.filter;
					    var explodeProperty = getCurrentOpacity.split("=");
					    var propertyDigit = explodeProperty[1].split(")");
					    var turnToNumber = parseFloat(propertyDigit[0]);
					    var defineOpacity = turnToNumber+10;
					    showMask.style.filter = "alpha(opacity="+defineOpacity+")";
					    if(showMask.style.filter == "alpha(opacity=70)"){
						    clearInterval(animate);
					    }
				    }
			    }, 500 / 50);
		    }else{
			    var animate = window.setInterval(function(){
				    if(showMask.style.opacity ){
					    showMask.style.opacity = +(showMask.style.opacity)+.10;
					    if(showMask.style.opacity >= 0.7){
						    clearInterval(animate);
					    }
				    }
			    }, 500 / 500);
		    }
	    }
	    fadeIn(showMask);
	    window.scroll(0,0);
    }
}




function fireModal_TaxesFees(currentCulture){
        
        var showMask = document.getElementById('mask_TaxesFees');
	    var showModal = document.getElementById('modalWindow_TaxesFees');
	    var windowWidth = document.body.clientWidth;
	    var windowHeight = document.body.clientHeight;
	    showMask.style.display = 'block';
	    showModal.style.display = 'block';
	    
	    
	    var modalWidth = showModal.offsetWidth;
	    var modalHeight = showModal.offsetHeight;
	    //var leftPos = (windowWidth-modalWidth)/8;
	    var leftPos = 75;
	    var pageHeight = $(document).height();
	    showMask.style.height = pageHeight+'px';
	    showModal.style.left = leftPos+'px';
	    showModal.style.top = '250px';
	    showModal.style.width = '600px';
    	
	    function fadeIn_TaxesFees(showMask){
		    if(showMask.style){
			    showMask.style.opacity= '0';
		    }
		    if(showMask.style){
			    showMask.style.filter= "alpha(opacity=0)";
		    }
    		
		    if (navigator.userAgent.indexOf('MSIE') !=-1){
			    var animate = setInterval(function(){
				    if(showMask.style.filter){
					    var getCurrentOpacity = showMask.style.filter;
					    var explodeProperty = getCurrentOpacity.split("=");
					    var propertyDigit = explodeProperty[1].split(")");
					    var turnToNumber = parseFloat(propertyDigit[0]);
					    var defineOpacity = turnToNumber+10;
					    showMask.style.filter = "alpha(opacity="+defineOpacity+")";
					    if(showMask.style.filter == "alpha(opacity=70)"){
						    clearInterval(animate);
					    }
				    }
			    }, 500 / 50);
		    }else{
			    var animate = window.setInterval(function(){
				    if(showMask.style.opacity ){
					    showMask.style.opacity = +(showMask.style.opacity)+.10;
					    if(showMask.style.opacity >= 0.7){
						    clearInterval(animate);
					    }
				    }
			    }, 500 / 500);
		    }
	    }
	    fadeIn_TaxesFees(showMask);
	    window.scroll(0,0);    
}



function fireModalNewEmail(){

	var showMask = document.getElementById('mask');
	var showModal = document.getElementById('modalWindow');
	var windowWidth = document.body.clientWidth;
	var windowHeight = document.body.clientHeight;
	showMask.style.display = 'block';
	showModal.style.display = 'block';
	var modalWidth = showModal.offsetWidth;
	var modalHeight = showModal.offsetHeight;
	var leftPos = (windowWidth-modalWidth)/2;
	showMask.style.height = windowHeight+'px';
	showModal.style.left = leftPos+'px';
	showModal.style.top = '200px';
	
	function fadeIn(showMask){
		if(showMask.style){
			showMask.style.opacity= '0';
		}
		if(showMask.style){
			showMask.style.filter= "alpha(opacity=0)";
		}
		
		if (navigator.userAgent.indexOf('MSIE') !=-1){
			var animate = setInterval(function(){
				if(showMask.style.filter){
					var getCurrentOpacity = showMask.style.filter;
					var explodeProperty = getCurrentOpacity.split("=");
					var propertyDigit = explodeProperty[1].split(")");
					var turnToNumber = parseFloat(propertyDigit[0]);
					var defineOpacity = turnToNumber+10;
					showMask.style.filter = "alpha(opacity="+defineOpacity+")";
					if(showMask.style.filter == "alpha(opacity=70)"){
						clearInterval(animate);
					}
				}
			}, 500 / 50);
		}else{
			var animate = window.setInterval(function(){
				if(showMask.style.opacity ){
					showMask.style.opacity = +(showMask.style.opacity)+.10;
					if(showMask.style.opacity >= 0.7){
						clearInterval(animate);
					}
				}
			}, 500 / 500);
		}
	}
	fadeIn(showMask);
	window.scroll(0,0);
}

function closeModal(){
	var hideMask = document.getElementById('mask');
	var hideModal = document.getElementById('modalWindow');
	var modalContent = document.getElementById('modalContent');
	hideMask.style.display = 'none';
	hideModal.style.display = 'none';
	hideModal.style.left = '0px';
	hideModal.style.top = '0px';
}

function closeModal_TaxesFees(){
	var hideMask = document.getElementById('mask_TaxesFees');
	var hideModal = document.getElementById('modalWindow_TaxesFees');
	var modalContent = document.getElementById('modalContent_TaxesFees');
	hideMask.style.display = 'none';
	hideModal.style.display = 'none';
	hideModal.style.left = '0px';
	hideModal.style.top = '0px';
}

function closeModalPurchase(){
	var hideMask = document.getElementById('mask');
	var hideModal = document.getElementById('modalWindow');
	var modalContent = document.getElementById('modalContent');
	hideMask.style.display = 'none';
	hideModal.style.display = 'none';
	hideModal.style.left = '0px';
	hideModal.style.top = '0px';
	//$("a.green").click(function () {
	//var checkBox=$("#NewPaymentPriceDisplay_NewPaymentNineDollarFareClubAnnualInput_FeeCheckBox"); Old purchase page checkbox
	var checkBox = $("#PurchaseNineDollarFareClub_FeeCheckBox");

    //gps jquery even checked happens after the manual click so messes up handler on page have to manually change it. bug 4237
    if (checkBox.length > 0) {
        checkBox[0].click();
        $("#nineDollarFareClubCheckBoxMask").children().show();
    }

    //	$("#NewPaymentPriceDisplay_NewPaymentNineDollarFareClubAnnualInput_FeeCheckBox").trigger('click');
    //	$("#NewPaymentPriceDisplay_NewPaymentNineDollarFareClubAnnualInput_FeeCheckBox").val('true');

    //This is only used in the old Purchase page.
    //Options_Toggle();
}

function enterNewEmail(){
    closeModal();
    var newEmailField = document.getElementById('PassengerContactGroup_PassengerContactContactInput_TextBoxEmailAddress');
    var confirmNewEmailField = document.getElementById('PassengerContactGroup_PassengerContactContactInput_EmailCompare');
    newEmailField.style.backgroundColor = "yellow";
    confirmNewEmailField.style.backgroundColor = "yellow";
    newEmailField.value = "";
    confirmNewEmailField.value = "";
    newEmailField.focus();
    window.scrollTo(0,99999999999);
    return true;
}

function nineDollarFareRemoval(){
    var showMask = document.getElementById('mask');
	var showModal = document.getElementById('modalWindow');
	var windowWidth = document.body.clientWidth;
	var windowHeight = document.body.clientHeight;
	showMask.style.display = 'block';
	showModal.style.display = 'block';
	var modalWidth = showModal.offsetWidth;
	var modalHeight = showModal.offsetHeight;
	var leftPos = (windowWidth-modalWidth)/2;
	var getSavings = $("span#9dfcSavings").text();
        $("span#savingsAmount3").text(getSavings);
	showMask.style.height = windowHeight+'px';
	showModal.style.left = leftPos+'px';
	showModal.style.top = '200px';
	
	function fadeIn(showMask){
		if(showMask.style){
			showMask.style.opacity= '0';
		}
		if(showMask.style){
			showMask.style.filter= "alpha(opacity=0)";
		}
		
		if (navigator.userAgent.indexOf('MSIE') !=-1){
			var animate = setInterval(function(){
				if(showMask.style.filter){
					var getCurrentOpacity = showMask.style.filter;
					var explodeProperty = getCurrentOpacity.split("=");
					var propertyDigit = explodeProperty[1].split(")");
					var turnToNumber = parseFloat(propertyDigit[0]);
					var defineOpacity = turnToNumber+10;
					showMask.style.filter = "alpha(opacity="+defineOpacity+")";
					if(showMask.style.filter == "alpha(opacity=70)"){
						clearInterval(animate);
					}
				}
			}, 500 / 50);
		}else{
			var animate = window.setInterval(function(){
				if(showMask.style.opacity ){
					showMask.style.opacity = +(showMask.style.opacity)+.10;
					if(showMask.style.opacity >= 0.7){
						clearInterval(animate);
					}
				}
			}, 500 / 500);
		}
	}
	fadeIn(showMask);
	window.scroll(0,0);
}

function fireModal_DebitCard(){

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

    //debugger;
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

