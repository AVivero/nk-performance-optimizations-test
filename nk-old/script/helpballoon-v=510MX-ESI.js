/**
 * HelpBalloon
 * Jquery based help balloons
 * @copyright 2007 Sergio M. Ammirata
 */

// Helper Functions
var HelpBalloon_Object_extend = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
	return destination;
};

var HelpBalloon_Object_genGUID = function() 
{ 
     var len = 8; 
     if(!isNaN(parseInt(arguments[0]))) len = parseInt(arguments[0]); 
     var chars = "abcdef0123456789"; 
     var output = ""; 
     while(output.length < len) 
     { 
             var rnd = Math.floor(Math.random() * (chars.length - 1)); 
             output += chars.charAt(rnd); 
     } 
     return output; 
};

var HelpBalloon_Position_cumulativeOffset = function(element) {
	var valueT = 0, valueL = 0;
	do {
	   valueT += element.offsetTop  || 0;
	   valueL += element.offsetLeft || 0;
	   element = element.offsetParent;
	  } 
	  while (element);
	  return [valueL, valueT];
};

/**
 * Instantiates the object
 * @param {Object} options
 */
function HelpBalloon(options)
{
	/**
	 * Establish default options and apply specified values
	 */
	this.options = HelpBalloon_Object_extend({
    	container: null,
	    containerType: 'A',
	    size: '',
	    icon: 'images/assitanceIcon.gif', 					//url to the icon to use
		altText: 'Click here for help with this topic',		//Alt text of the help icon
		dataURL: null,										//URL to pull the title/content XML
		title: 'Title',										//Title of the balloon topic
		content: 'Content',									//Static content of the help balloon
		duration: .2,										//Duration of fade/appear affect
		useEvent: ['click'],								//Events to trigger the balloon
		imagePath: 'images/',
		method:	'get'										//Method to retrieve the AJAX content
	}, options||{});

	/**
	 * collection of object elements
	 */
	this._elements = {
		container: null,									//Containing element of the balloon
		inner: null,										//Inner content container
		icon: null,											//Triggering icon
		content: null,										//Body Content container
		button: null,										//Closing 'X' button
		title: null,										//Title Content Container
		bgContainer: null									//For IE, renders the alpha-transparent PNG
	};

    /**
     * Get image_names
     */
    this.GetImageName = function(imgLoc) {
            var size = '';
		    if (this.options.size != '')
		        size = '-' + this.options.size;
		    if (imgLoc == 'tl')
			    return this.options.imagePath + 'balloon-tl' + size + '.png'			//Top Left
			else if (imgLoc == 'tr')
			    return this.options.imagePath + 'balloon-tr' + size + '.png'			//Top Right
			else if (imgLoc == 'bl')
			    return this.options.imagePath + 'balloon-bl' + size + '.png'			//Bottom Left
			else if (imgLoc == 'br')
			    return this.options.imagePath + 'balloon-br' + size + '.png'			//Bottom Right
    };
    
    this.GetImageHeight = function() {
        if (this.options.size == 'small')
            return '120';
        else if (this.options.size == 'large')
            return '360';        
        else
            return '240';
    }
    
	/**
	 * Properties and Attributes
	 */
	this._properties = {
		id: "HelpBalloon_" + HelpBalloon_Object_genGUID(),				//ID for object and Icon, Requires prototype.improvements.js
		balloons : [										//Path to 4 bubble images
		    this.GetImageName('tl'),			//Top Left
			this.GetImageName('tr'),			//Top Right
			this.GetImageName('bl'),			//Bottom Left
			this.GetImageName('br')			//Bottom Right
		],
		balloonStyle: {										//Balloon styling
			position: 'absolute',
			border: 'none',
			background: 'white',
			width: '400px',
			height: this.GetImageHeight() + 'px',
			display: 'block'
		},
		button: this.options.imagePath + 'button.png',		//Closing 'X' image
		visible: false,										//Status of Balloon's visibility
		balloonCoords: null,								//Stores the balloon coordinates
		innerDims: [230,this.GetImageHeight() / 1.4],								//Inner dimensions of the balloon, available for content
		outerDims: [300,this.GetImageHeight()],								//Outer dimensions of the balloon
		pointerDims: [20,20],								//Balloon tail dimensions
		innerMarginX: 15,									//Inner margin X
        innerMarginY: 8,									//Inner margin Y
		buttonHeight: 25,									//Size of 'X' image
		buttonWidth: 46,									//Size of 'X' image
		drawn: false,										//Rendering status
		renderXY: [0,0]										//X/Y coordinate of icon at time of render
	};


    /**
     * Toggles the help balloon
     * @param {Object} e Event
     */
    this.toggle = function(obj,e)
    {
	    if(!e) e = window.event || {type: this.options.useEvent, target: this._elements.icon};
        var icon = obj;	    
        if(e.type == this.options.useEvent && !this._properties.visible && icon == this._elements.icon)	    
		    this.show(e);
	    else
		    this.hide(e);
    }
	
    this.show = function(e)
    {
	    if(!this._properties.drawn) this._draw();
	    this._reposition();
	    this._hideOtherHelps(e);
	    $(this._elements.container).fadeIn(this.options.duration * 1000);
	    // TODO: Fix these
	    //setTimeout(this._hideLowerElements.bind(this), (this.options.duration * 1000) / 2);
	    //setTimeout(function(){this._elements.container.style.display = 'block';}.bind(this), (this.options.duration * 1000));
	    this._properties.visible = true;
   	    $(window).resize(this.handleWindowResize);
    }
    
    this.handleWindowResize = function()
    {
       $('img[id^=HelpBalloon]').each(function(i){
       	    if (this._HelpBalloon != undefined)
       	        this._HelpBalloon._reposition();
       	 });
    }

    /**
     * Hides the balloon
     */
    this.hide = function()
    {
	    this._showLowerElements();
	    $(this._elements.container).fadeOut(this.options.duration * 1000/2);
	    // TODO: next items
	    //setTimeout(function(){this._elements.container.style.display = 'none';}.bind(this), this.options.duration * 1000);
	    this._properties.visible = false;
	    $(window).unbind('resize',this.handleWindowResize);
	    return;
    }

    /**
     * Redraws the balloon based on the current coordinates of the icon.
     */
    this._reposition = function()
    {
        if ($(this._elements.icon).css('display') == 'none')
            var anchor = this._elements.icon.parentNode;
        else
            var anchor = this._elements.icon;
            
	    this._properties.balloonCoords = this._getXY(anchor);	    
	    this._properties.balloonCoords.x += Math.round(anchor.scrollWidth / 2);
	    this._properties.balloonCoords.y += Math.round(anchor.scrollHeight / 2);

	    var pos = 0;

	    var oh = this._properties.balloonCoords.x + parseInt(this._elements.container.style.width);
	    var ov = this._properties.balloonCoords.y - parseInt(this._elements.container.style.height);

	    if(ov > 0)
		    pos += 2;

	    var ww = $.browser.msie ? document.body.clientWidth : window.outerWidth;
	    if(oh > ww)
		    pos += 1;

	    // Fix for IE alpha transparencies
	    if($.browser.msie && this._properties.balloons[pos].toLowerCase().indexOf('.png') > -1)
	    {
		    var doAppend = false;
		    if(!this._elements.bgContainer)
		    {
			    doAppend=true;
			    this._elements.bgContainer = document.createElement('div');
		    }
		    this._elements.bgContainer.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this._properties.balloons[pos] + "', sizingMethod='crop')";
		    this._elements.bgContainer.style.position = 'absolute';
		    this._elements.bgContainer.style.left = '0px';
		    this._elements.bgContainer.style.top = '0px';
		    this._elements.bgContainer.style.width = this._elements.container.style.width;
		    this._elements.bgContainer.style.height = this._elements.container.style.width;
		    this._elements.bgContainer.style.zIndex = -1;
		    doAppend && this._elements.container.appendChild(this._elements.bgContainer);
	    }
	    else
		    this._elements.container.style.backgroundImage = 'url(' + this._properties.balloons[pos] + ')';

	    this._elements.container.style.backgroundRepeat = 'no-repeat';
	    this._elements.container.style.backgroundColor = 'transparent';
	    if($.browser.msie) this._elements.container.style.backgroundAttachment = 'fixed';
	    this._elements.container.style.backgroundPosition = 'top left';
	    this._elements.container.style.zIndex = 5000;

	    var cx = 0;
	    var cy = 0;
	    var zx = 0;
	    var zy = 0;
	    switch(pos)
	    {
		    case 1:
			    cx = this._properties.pointerDims[0];
			    cy = this._properties.pointerDims[1];

			    zx = this._properties.balloonCoords.x - parseInt(this._elements.container.style.width);
			    zy = this._properties.balloonCoords.y;
		    break;

		    case 2:
			    cx = this._properties.pointerDims[0];
			    cy = this._properties.pointerDims[1];

			    zx = this._properties.balloonCoords.x;
			    zy = this._properties.balloonCoords.y - parseInt(this._elements.container.style.height);
		    break;

		    case 3:
			    cx = this._properties.pointerDims[0];
			    cy = this._properties.pointerDims[1];

			    zx = this._properties.balloonCoords.x - parseInt(this._elements.container.style.width);
			    zy = this._properties.balloonCoords.y - parseInt(this._elements.container.style.height);
		    break;

		    default:
		    case 0:
			    cx = this._properties.pointerDims[0];
			    cy = this._properties.pointerDims[1];

			    zx = this._properties.balloonCoords.x;
			    zy = this._properties.balloonCoords.y;
		    break;
	    }

	    this._elements.container.style.left = zx + "px";
	    this._elements.container.style.top = zy + "px";
	    if(this._elements.inner) this._elements.inner.style.left = (cx + this._properties.innerMarginX) + 'px';
	    if (this.options.size == 'small')
	        cy = cy / 2;
	    if(this._elements.inner) this._elements.inner.style.top = (cy + this._properties.innerMarginY) + 'px';
    }

    /**
     * Render's the Balloon
     */
    this._draw = function()
    {
        $(this._elements.container).css(this._properties.balloonStyle);
	    if(this.options.dataURL && !this._properties.drawn)
	    {
		    var cont = new Ajax.Request(this.options.dataURL, {asynchronous: false, method: this.options.method});
		    /**
		     * Expects the following XML format:
		     * <HelpBalloon>
		     * 		<title>My Title</title>
		     * 		<content>My content</content>
		     * </HelpBaloon>
		     */
		    var doHTML = false;
		    if(cont.transport.responseXML)
		    {
			    var xml = cont.transport.responseXML.getElementsByTagName('HelpBalloon')[0];
			    if(xml)
			    {
				    xmlTitle = xml.getElementsByTagName('title')[0];
				    if(xmlTitle) this.options.title = xmlTitle.firstChild.nodeValue;

				    xmlContent = xml.getElementsByTagName('content')[0];
				    if(xmlContent) this.options.content = xmlContent.firstChild.nodeValue;
			    }
			    else
				    doHTML = true;
		    }
		    else
			    doHTML = true;

		    if(doHTML)
		    {
			    // Attempt to get the title from a <title/> HTML tag
			    var htmlTitle = cont.transport.responseText.match(/\<title\>([^\<]+)\<\/title\>/gi);
			    if(htmlTitle)
			    {
				    htmlTitle = htmlTitle.toString().replace(/\<title\>|\<\/title\>/gi, '');
				    this.options.title = htmlTitle;
			    }
			    this.options.content = cont.transport.responseText;
		    }
	    }


	    this._elements.inner = document.createElement('div');
	    this._elements.inner.style.position = 'absolute';
	    this._elements.inner.style.width = this._properties.innerDims[0] + 'px';
	    this._elements.inner.style.height = this._properties.innerDims[1] + 'px';

	    var title = document.createElement('div');
	    title.appendChild(document.createTextNode(this.options.title));
	    title.style.fontFamily = 'verdana';
	    title.style.fontSize = '13px';
	    title.style.fontWeight = 'bold';
	    //title.style.color = 'black';
	    title.style.color = '#000066';
	    title.style.width = (this._properties.innerDims[0] - this._properties.buttonWidth) + 'px';
	    title.style.height = this._properties.buttonHeight + 'px'
	    title.style.position = 'absolute';
	    title.style.overflow = 'hidden';
	    title.style.top = '0px';
	    title.style.left = '0px';
	    this._elements.inner.appendChild(title);

	    var closer = null;
        closer = document.createElement('a');
        closer.id = "hbClose";
        closer.className = "helpballoon_Close";
        closer.title = "Click to close this balloon";
        closer.style.cursor = 'pointer';
        $(closer).click(function(e){
	        var obj = this.parentNode.parentNode._HelpBalloon;
	        obj.toggle(obj,e);
	        });
	    $(closer).hover(function(){
	            $(this).css({'background-position':'left bottom'}); //mouseover    
	         },    
	         function(){         
	            $(this).css({'background-position':'left top'}); // mouseout    
	        });
	    this._elements.inner.appendChild(closer);

//         .helpballoon_Close
//         {
//	        background-repeat:no-repeat;
//	        height:14px;
//	        width:46px;
//	        float:right;
//	        background-image:url(../images/base/popup/close_white.gif);
//	        outline-color: -moz-use-text-color; 
//	        outline-style: none; 
//	        outline-width: medium; 
//	        background-position: left top;
//         }


	    var contents = document.createElement('div');
	    contents.style.width = this._properties.innerDims[0] + 'px';
	    contents.style.height = (this._properties.innerDims[1] - parseInt(title.style.height)) + 'px';
	    contents.style.overflow = 'auto';
	    contents.style.position = 'absolute';
	    contents.style.top = parseInt(title.style.height) + 'px';
	    contents.style.left = "0px";
	    contents.style.fontFamily = 'verdana';
	    contents.style.fontSize = '11px';
	    contents.style.fontWeight = 'normal';
	    contents.style.color = 'black';
	    contents.innerHTML = this.options.content;
	    this._elements.inner.appendChild(contents);
	    this._elements.container.appendChild(this._elements.inner);
	    document.getElementsByTagName('body')[0].appendChild(this._elements.container);
	    this._properties.drawn = true;
    }

    /**
     * Gets the current position of the obj
     * @param {Object} obj
     */
    this._getXY = function(obj)
    {
	    var pos = HelpBalloon_Position_cumulativeOffset(obj)
	    var y = pos[1];
	    var x = pos[0];
	    var x2 = x + parseInt(obj.offsetWidth);
	    var y2 = y + parseInt(obj.offsetHeight);
	    return {'x':x, 'y':y, 'x2':x2, 'y2':y2};

    }

    /**
     * Determins if the object is a child of the balloon element
     * @param {Object} obj
     */
    this._isChild = function(obj)
    {
	    var i = 15;
	    do{
		    if(obj == this._elements.container)
			    return true;
		    obj = obj.parentNode;
	    }while(obj && i--);
	    return false
    }

    /**
     * Determines if the balloon is over this_obj object
     * @param {Object} this_obj
     */
    this._isOver = function(this_obj)
    {
	    if(!this._properties.visible) return false;
	    if(this_obj == this._elements.container || this._isChild(this_obj)) return false;
	    var this_coords = this._getXY(this_obj);
	    var that_coords = this._getXY(this._elements.container);
	    if(
		    (
		     (
		      (this_coords.x >= that_coords.x && this_coords.x <= that_coords.x2)
		       ||
		      (this_coords.x2 >= that_coords.x &&  this_coords.x2 <= that_coords.x2)
		     )
		     &&
		     (
		      (this_coords.y >= that_coords.y && this_coords.y <= that_coords.y2)
		       ||
		      (this_coords.y2 >= that_coords.y && this_coords.y2 <= that_coords.y2)
		     )
		    )

	      ){
		    return true;
	    }
	    else
		    return false;
    },

    /**
     * Restores visibility of elements under the balloon
     * (For IE)
     */
    this._showLowerElements = function()
    {
	    var elements = this._getWeirdAPIElements();
	    for(var i = 0; i < elements.length; i++)
	    {
		    if(this._isOver(elements[i]))
		    {
			    if(elements[i].style.visibility != 'visible' && elements[i].hiddenBy == this)
			    {
				    elements[i].style.visibility = 'visible';
				    elements[i].hiddenBy = null;
			    }
		    }
	    }
    }

    /**
     * Hides elements below the balloon
     * (For IE)
     */
    this._hideLowerElements = function()
    {
	    var elements = this._getWeirdAPIElements();
	    for(var i = 0; i < elements.length; i++)
	    {
		    if(this._isOver(elements[i]))
		    {
			    if(elements[i].style.visibility != 'hidden')
			    {
				    elements[i].style.visibility = 'hidden';
				    elements[i].hiddenBy = this;
			    }
		    }
	    }
    }

    /**
     * Determines which elements need to be hidden
     * (For IE)
     */
    this._getWeirdAPIElements = function()
    {
	    if(!document.all) return [];
	    var objs = ['select', 'input', 'object'];
	    var elements = [];
	    for(var i = 0; i < objs.length; i++)
	    {
		    var e = document.getElementsByTagName(objs[i]);
		    for(var j = 0; j < e.length; j++)
		    {
			    elements.push(e[j]);
		    }
	    }
	    return elements;
    }

    /**
     * Hides the other visible help balloons
     * @param {Object} e
     */
    this._hideOtherHelps = function(e)
    {
	    if(!e) e = window.event;
	    var imgs = $('img[id*=HelpBalloon]');
	    for(var i = 0; i < imgs.length; i++)
	    {
			var hb = imgs[i]._HelpBalloon;
			if(hb && hb._properties.visible && (imgs[i] != this._elements.container))
			    hb.toggle(hb,e);
	    }
    }

	/**
	 * Preload the balloon images
	 */
	for(var i = 0; i < this._properties.balloons.length; i++)
	{
		var timg = document.createElement('img');
		timg.src = this._properties.balloons[i];
	}

	/**
	 * Create the anchoring icon
	 */
	this._elements.icon = document.createElement('img');
	this._elements.icon.src = this.options.icon;
//	this._elements.icon.width = 15;
//	this._elements.icon.height = 14;
	this._elements.icon.id = this._properties.id + "_icon";
	this._elements.icon._HelpBalloon = this;
//	this._elements.icon.style.verticalAlign = "top";
	if(!this._elements.icon) return false;

    if (this.options.container)
        var container = this.options.container;
    else
        var container = this._elements.icon;
	
	/**
	 * Attach rendering events
	 */
    for (i = 0; i < this.options.useEvent.length; i++) {
        $(container).bind(this.options.useEvent[i], function(e) {
            // Find img object
            var icon = $(this).children('img[id^=HelpBalloon]');
            if (!icon[0])
                icon = this;
            else
                icon = icon[0];
            if (icon._HelpBalloon != undefined)
                icon._HelpBalloon.toggle(icon, e);
        });
    }
	this._elements.icon.style.cursor = 'pointer';
	this._elements.container = document.createElement('div');
	this._elements.container._HelpBalloon = this;
    
    // Append The help icon to the container
    if (this.options.container)
    {
        $(this.options.container).append(this._elements.icon);
        if (container.firstChild.innerHTML == "")
            $(this._elements.icon).show();
        else if (container.tagName == this.options.containerType)
            $(this._elements.icon).hide();
        
    }
}
