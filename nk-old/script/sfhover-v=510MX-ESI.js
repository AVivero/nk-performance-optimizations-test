// Created a long, long time ago by Tanny O'Haley
// Update history.
// 24 Oct 2006 - Added to http://tanny.ica.com
// 14 Jul 2006 - Modified the way the iframe is added to the DOM. I no longer use 
//			innerHTML but use DOM methods.
// 15 Sep 2006 - Added a check to see if the target element onmouseout is contained
//			in the onmouseout element. If it is then I dont' remove the
//			sfhover class. I made use of the Microsoft proprietary
//			obj.contains() method.
//		 Added check to make sure that the sfhover class is not already in
//			the li element.
//
sfHover = function() {
	// Support the standard nav without a class of nav.
	var el = document.getElementById("main-nav");
	if( el == null )
	{
	    return;
	}
	if(!/\bnav\b/.test(el.className) && el.tagName == "UL")
		setHover(el);

	// Find all unordered lists.
	var ieNavs = document.getElementsByTagName('ul');
	for(i=0; i<ieNavs.length; i++) {
		var ul = ieNavs[i];
		// If they have a class of nav add the menu hover.
		if(/\bnav\b/.test(ul.className))
			setHover(ul);
	}

}

function setHover(nav) {
	var ieULs = nav.getElementsByTagName('ul');
	if ($.browser.msie && ($.browser.version < 7)) {
		// IE script to cover <select> elements with <iframe>s
		for (j=0; j<ieULs.length; j++) {
			var ieMat=document.createElement('iframe');
			if(document.location.protocol == "https:")
				ieMat.src="javascript:false;";
			else if(window.opera != "undefined")
				ieMat.src="";
			else
				ieMat.src="javascript:false;";
			ieMat.scrolling="no";
			ieMat.frameBorder="0";
			ieMat.style.width=ieULs[j].offsetWidth+"px";
			ieMat.style.height=ieULs[j].offsetHeight+"px";
			ieMat.style.zIndex="-1";
			ieULs[j].insertBefore(ieMat, ieULs[j].childNodes[0]);
			ieULs[j].style.zIndex="101";
		}
		// IE script to change class on mouseover
		var ieLIs = nav.getElementsByTagName('li');
		for (var i=0; i<ieLIs.length; i++) if (ieLIs[i]) {
			// Add a sfhover class to the li.
			ieLIs[i].onmouseover=function() {
				if(!/\bsfhover\b/.test(this.className))
					this.className+=" sfhover";
			}
			ieLIs[i].onmouseout=function() {
				if(!this.contains(event.toElement))
					this.className=this.className.replace(' sfhover', '');
			}
		}
	}
}

// If IE 5.0 hide and show the select statements.
function hideSelects(){
	var oSelects=document.getElementsByTagName("select");
	for(var i=0;i<oSelects.length;i++)
		oSelects[i].className+=" hide";
}

function showSelects(){
	var oSelects=document.getElementsByTagName("select");
	for(var i=0;i<oSelects.length;i++)
		oSelects[i].className=oSelects[i].className.replace(" hide","");
}

// Run this only for IE.
if (window.attachEvent) window.attachEvent('onload', sfHover);
// end
