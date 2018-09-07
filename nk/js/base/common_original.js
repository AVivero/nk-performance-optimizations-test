/*!
    This file is part of the Navitaire NewSkies application.
    Copyright (C) Navitaire.  All rights reserved.
*/

/*
    Dependencies:
        This file depends on other JavaScript files to be there at run time.
        
        jquery.js:
            $ is a jquery variable

    Standards:
        JavaScript file names are camelCase, starting with a lower case letter
        Put all code in the appropriate namespace such as all object definitions go in SKYSALES.Class
        Objects take no parameters when they are constructed, but implement an init method for initialization of their data members
        
        Every object definition has some basic methods
            init(jsonObject) - calls the initializing methods
            setSettingsByObject(jsonObject) - initializes the object by matching the jsonObject key name with the public member variable name
            setVars - accesses nodes on the dom
            addEvents - adds dom events to the object, and sets event handlers
            supplant - swaps out the objects member value names in [] with there actual values
            
        Event handler method names end in Handler, for example clickEventHandler, 
        this is to identify that the this variable will be the dom object and not the object instance.
        
        You pass string ids of dom nodes to objects and they handle finding that node on the dom, and wiring up its own events
        
        Do not write HTML in JavaScript, use a template node from the XSLT, and swap out the object values with a supplant method.
            Array brackets [] are used to tell the supplant method to replace the member name with the member value.
            [name] is replaced with this.name, Hello [title] [name], becomes Hello Mr. Anderson
      
        Inheritance
            Note that I have to instantiate an instance of the base class. And keep it around to be able to call base class methods.
                var parent = new GLOBAL.Class.Base();
                
            You must make a copy of the this object, to be used when the this object turns into the window or a dom object.
                var thisChildObject = GLOBAL.extendObject(parent);
                
            To call a parent method, you must use the build in call function
                parent.setSettingsByObject.call(this);
            
            The child class must override event handler methods to set the this variable correctly.
                // The event is added in a addEvents method
                thisChildObject.domButton.click(this.updateHandler);

                // The event is handeled by the correct method, and has thisChildObject available to use via closure
                thisChildObject.updateHandler = function ()
                {
                    thisChildObject.update();
                };
            
            How to know when to use the "this" keyword, or the copied this object (thisChildObject)
            
                You should always use the copied this variable on the left side of an assignment operator.
                    thisChildObject.type = 'childObject';
                    
                Inside of an event handler method where you know the the this variable will be set to the dom object.
                    thisChildObject.updateHandler = function ()
                    {
                        thisChildObject.update();
                    };
                    
                Use the "this" keyword in every other scenario.
                    this.setSettingsByObject(jsonObject);
                    var name = this.name;
                    
        
        Follow all of the JsLint rules that apply when you click good parts.
        
        It is highly recommended that you use a JavaScript code compressor to decrease the size of the JavaScript files in production.
        Be sure to keep the original file around, because making edits to a compressed file is very difficult.
        JavaScript Compressors: 
            YUI Compressor: http://developer.yahoo.com/yui/compressor/
            JsMin: http://crockford.com/javascript/jsmin.html
        We highly recommend turning on gzip compression on your web server.
        

    General Notes:
        The common.js file is where JavaScript that is used in multiple places goes,
        or JavaScript that is commonly used. Such as code for a control that is on many views.
        
        All of the SkySales JavaScript should be behind the SKYSALES object defined in this file.
        You can think of the SKYSALES object as a namespace.
        
    ToDo:
        + Move all of the JavaScript that is dynamically output from the server to external JavaScript files 
        + Put all code behind the SKYSALES namespace, there are currently some global functions that can not be moved yet
        + Change all of the if (SKYSALES.Class.ClassName === undefined) to just if (!SKYSALES.Class.ClassName) is is shorter
        + Make all event handler function names end in Handler, such as updateDomHandler. This way you will be able to easily tell what the this variable is set to.
        
        
    JsLint Status:
        JsLint Status:
        Pass - JsLint Edition 2008-05-31
        
        + Strict whitespace
        + Assume a browser 
        + Disallow undefined variables
        + Disallow leading _ in identifiers
        + Disallow == and !=
        + Disallow ++ and --
        + Disallow bitwise operators
        + Tolerate eval
        Indentation 4
        
*/

/*
    Initialize SKYSALES namespace
    All javascript in skysales should be behind the SKYSALES namespace
    This prevents naming collisions
*/

/*global window: false, SKYSALES: true, $: false, document: false, alert: false */
'use strict';

var SKYSALES = {};

//The JSON parser, and serializer
SKYSALES.Json = window.JSON;

//A pointer to the active resource object instance
SKYSALES.Resource = {};

//A static helper class
SKYSALES.Util = {};

//A namespace for class definitions
SKYSALES.Class = {};

/*
    A namespace for instances, 
    this is used for instances of objects that are auto generated from object tags. 
*/
SKYSALES.Instance = {};
SKYSALES.Instance.index = 0;
SKYSALES.Instance.getNextIndex = function ()
{
    SKYSALES.Instance.index += 1;
    return SKYSALES.Instance.index;
};

/*
    Name: 
        Class LocaleCurrency
    Param:
        num
    Return: 
        An instance of LocaleCurrency
    Functionality:
        This class is used by Util.convertToLocaleCurrency(num)
    Notes:
        This class provides the ability to convert a number to the local currency format
    Class Hierarchy:
        LocaleCurrency
*/
if (!SKYSALES.Class.LocaleCurrency) 
{
    SKYSALES.Class.LocaleCurrency = function ()
    {
        var parent = new SKYSALES.Class.SkySales();
        var thisLocaleCurrency = SKYSALES.Util.extendObject(parent);
        
        thisLocaleCurrency.num = null;
        thisLocaleCurrency.localeCurrency = null;
        
        var resource = SKYSALES.Util.getResource();
        var currencyCultureInfo = resource.currencyCultureInfo;
        var integerPartNum = 0;
        var integerPartString = '';
        var decimalPartString = '';
        var number = '';
        var positive = true;
        
        var getCurrencyPattern = function ()
        {
            var pattern = currencyCultureInfo.positivePattern;
            if (!positive)
            {
                pattern =  currencyCultureInfo.negativePattern;
            }
            return pattern;
        };
        
        var getIntegerPart = function (numVal)
        {
            var groupSizes = currencyCultureInfo.groupSizes || [];
            var groupSeparator = currencyCultureInfo.groupSeparator;
            var groupSizesIndex = 0;
            var index = 0;
            var currentGroupSize = 3;
            if (groupSizesIndex > groupSizes.length)
            {
                currentGroupSize = groupSizes[groupSizesIndex];
            }
            var currentGroupEndIndex = currentGroupSize - 1;
            integerPartNum = Math.floor(numVal);
            var localString = integerPartNum.toString();
            var array = localString.split('');
            var reverseArray = array.reverse();
            var reverseArrayOutput = [];

            var getNextGroupSize = function ()
            {
                var nextGroupSize = 3;
                //Increment group sizes index if necessary
                if (groupSizesIndex <= groupSizes.length - 2)
                {
                    groupSizesIndex += 1;
                    nextGroupSize = groupSizes[groupSizesIndex];
                }
                else
                {
                    nextGroupSize = currentGroupSize;
                }
                currentGroupEndIndex += nextGroupSize;
                return nextGroupSize;
            };
            for (index = 0; index < reverseArray.length; index += 1)
            {
                if (index > currentGroupEndIndex)
                {
                    currentGroupSize = getNextGroupSize();
                    reverseArrayOutput.push(groupSeparator);
                }                
                reverseArrayOutput.push(reverseArray[index]);
            }
            
            array = reverseArrayOutput.reverse();
            var outputString = array.join('');
            return outputString;
        };
        
        var getDecimalPart = function (numVal)
        {
            var decimalPart = numVal - integerPartNum;
            var decimalPartTrimmed = decimalPart.toFixed(currencyCultureInfo.decimalDigits);
            var decimalPartString = decimalPartTrimmed.substring(2);
            return decimalPartString;
        };
        
        var applyPattern = function ()
        {
            var pattern = getCurrencyPattern() || '';
            var replaceNumber = pattern.replace('n', number);
            return replaceNumber;
        };
        
        var invariantNumberToLocaleCurrency = function ()
        {
            thisLocaleCurrency.currency = thisLocaleCurrency.num.toString();
            positive = thisLocaleCurrency.num >= 0;
            // Make the number positive. The applyPattern will reestablish the sign.
            thisLocaleCurrency.num = Math.abs(thisLocaleCurrency.num);
            integerPartString = getIntegerPart(thisLocaleCurrency.num);
            
            decimalPartString = getDecimalPart(thisLocaleCurrency.num);
            number = integerPartString;
            if (0 < currencyCultureInfo.decimalDigits)
            {
                number += currencyCultureInfo.decimalSeparator + decimalPartString;
            }
            thisLocaleCurrency.currency = applyPattern();
        };
        
        thisLocaleCurrency.init = function (json)
        {
            this.setSettingsByObject(json);
            if (null !== this.num)
            {
                invariantNumberToLocaleCurrency();
            }
        };
        return thisLocaleCurrency;
    };
}

/*
    Name: 
        Class Resource
    Param:
        None
    Return: 
        An instance of Resource
    Functionality:
        Used to hold any common data that multiple controls use such as
        CountryInfo, MacInfo, StationInfo, and BookingInfo
    Notes:
        Right now there is one resource object instance.
        It is accessed in the JavaScript by calling SKYSALES.Util.getResource()
        It is created in the common.xslt file, and populated by resource data
        that is written to JSON.
        The resources that come down to the browser are configured at a view level in the naml file.
        To get a list of stations in JSON you add the node of
        <bind link="StationResource" property="ResourceContainer"/>
        as a child node of the view node.
        
        This class also contains a way to access cookie data. 
        Such as the contact info that is stored in a cookie to populate the contact view.
    Class Hierarchy:
        SkySales -> Resource
*/
SKYSALES.Class.Resource = function ()
{
    var parent = new SKYSALES.Class.SkySales();
    var thisResource = SKYSALES.Util.extendObject(parent);
    
    thisResource.locationInfo = {};
    thisResource.countryInfo = {};
    thisResource.stationInfo = {};
    thisResource.macInfo = {};
    thisResource.marketInfo = {};
    thisResource.macHash = {};
    thisResource.stationHash = {};
    thisResource.marketHash = {};
    thisResource.sourceInfo = {};
    thisResource.clientHash = {};
    thisResource.dateCultureInfo = {};
    thisResource.currencyCultureInfo = {};
    
    /*
        Turns the macInfo into a hash for quick lookups.
        Keying into the macHash with the mac code you will get back 
        an object that contains an array of station codes that the mac code is associated with.
        macHash[macCode] = { "code": "stationCode", "stations": [ "stationCode1", "stationCode2" ] };
    */
    thisResource.populateMacHash = function ()
    {
        var i = 0;
        var macArray = [];
        var macHash = {};
        var mac = null;
        if (thisResource.macInfo && thisResource.macInfo.MacList)
        {
            macArray = thisResource.macInfo.MacList;
            for (i = 0; i < macArray.length; i += 1)
            {
                mac = macArray[i];
                macHash[mac.code] = mac;
            }
        }
        thisResource.macHash = macHash;
    };
    
    /*
        Turns the stationInfo into a hash for quick lookups.
        Keying into the stationHash with the station code you will get back a station object
        stationHash[stationCode] = { "macCode": "", "name":"", "code": "" };
    */
    thisResource.populateStationHash = function ()
    {
        var i = 0;
        var stationArray = [];
        var stationHash = {};
        var station = null;
        if (thisResource.stationInfo && thisResource.stationInfo.StationList)
        {
            stationArray = thisResource.stationInfo.StationList;
            for (i = 0; i < stationArray.length; i += 1)
            {
                station = stationArray[i];
                stationHash[station.code] = station;
            }
        }
        thisResource.stationHash = stationHash;
    };
    
    /*
        Turns the marketInfo into a hash for quick lookups.
        Keying into the marketHash with the orgin station code you will get back an array of objects.
        Each object contains a destination station code that can be mapped to a station object using the stationHash.
        marketHash[originStationCode] = [ { "code": "destinationStationCode1", "name": "destinationStationCode2" } ]
    */
    thisResource.populateMarketHash = function ()
    {
        var i = 0;
        var marketHash = {};
        var marketArray = [];
        var market = {};
        
        var destinationIndex = 0;
        var destinationArray = [];
        var destinationCode = '';
        var destination = {};
        var station = {};
        
        if (thisResource.marketInfo && thisResource.marketInfo.MarketList)
        {
            marketArray = thisResource.marketInfo.MarketList;
            for (i = 0; i < marketArray.length; i += 1)
            {
                market = marketArray[i];
                destinationArray = market.Value;
                if (destinationArray)
                {
                    marketHash[market.Key] = destinationArray;
                    for (destinationIndex = 0; destinationIndex < destinationArray.length; destinationIndex += 1)
                    {
                        destination = destinationArray[destinationIndex];
                        destinationCode = destination.code;
                        destination.name = '';
                        station = thisResource.stationHash[destinationCode];
                        if (station)
                        {
                            destination.name = station.name;
                        }
                    }
                }
            }
            thisResource.marketHash = marketHash;
        }
    };
    
    /*
        The clientHash is data that has been stored in a cookie
    */
    thisResource.populateClientHash = function ()
    {
        var cookie = window.document.cookie;
        var nameValueArray = [];
        var i = 0;
        var singleNameValue = '';
        var key = '';
        var value = '';
        var eqIndex = -1;
        if (cookie)
        {
            nameValueArray = document.cookie.split('; ');
            for (i = 0; i < nameValueArray.length; i += 1)
            {
                singleNameValue = nameValueArray[i];
                eqIndex = singleNameValue.indexOf('=');
                if (eqIndex > -1)
                {
                    key = singleNameValue.substring(0, eqIndex);
                    value = singleNameValue.substring(eqIndex + 1, singleNameValue.length);
                    if (key)
                    {
                        value = SKYSALES.Util.decodeUriComponent(value);
                        thisResource.clientHash[key] = value;
                    }
                }
            }
        }
    };
    
    /*
        Populate the object instance.
        This is accomplished by matching the name of the public menber 
        with the name of the key in the key: value pair of the JSON object that is passed in.
        It then turns the data into hash lists for quick lookups.
    */
    thisResource.setSettingsByObject = function (jsonObject)
    {
        parent.setSettingsByObject.call(this, jsonObject);
        thisResource.populateStationHash();
        thisResource.populateMacHash();
        thisResource.populateMarketHash();
        thisResource.populateClientHash();
    };
    return thisResource;
};

/*
    Name: 
        Class Util
    Param:
        None
    Return: 
        None
    Functionality:
        Represents a Static Util object
    Notes:
        Provides common methods.
        Used for inheritance - for example
            var parent = new SKYSALES.Class.SkySales();
            var theObject = SKYSALES.Util.extendObject(parent);
        This class reads in the JSON object tags and instantiates them into running JavaScript
    Class Hierarchy:
        SkySales -> Resource
*/

SKYSALES.Util.createObjectArray = [];
SKYSALES.Util.createObject = function (objNameBase, objType, json)
{
    var createObjectArray = SKYSALES.Util.createObjectArray;
    createObjectArray[createObjectArray.length] = {
        'objNameBase': objNameBase,
        'objType': objType,
        'json': json
    };
};

SKYSALES.Util.initObjects = function ()
{
    var i = 0;
    var createObjectArray = SKYSALES.Util.createObjectArray;
    var objName = '';
    var objectType = '';
    var json = null;
    var createObject = null;
    for (i = 0; i < createObjectArray.length; i += 1)
    {
        createObject = createObjectArray[i];
        objName = createObject.objNameBase + SKYSALES.Instance.getNextIndex();
        objectType = createObject.objType;
        json = createObject.json || {};
        if (SKYSALES.Class[objectType])
        {
            SKYSALES.Instance[objName] = new SKYSALES.Class[objectType]();
            SKYSALES.Instance[objName].init(json);
        }
    }
    SKYSALES.Util.createObjectArray = [];
};

//Replace characters that could not be stored in a cookie
SKYSALES.Util.decodeUriComponent = function (str)
{
    str = str || '';
    if (window.decodeURIComponent)
    {
        str = window.decodeURIComponent(str);
    }
    str = str.replace(/\+/g, ' ');
    return str;
};

//Replace characters for cookie storage
SKYSALES.Util.encodeUriComponent = function (str)
{
    str = str || '';
    if (window.encodeURIComponent)
    {
        str = window.encodeURIComponent(str);
    }
    return str;
};

//Return the main resource instance, this object is instantiated in the common.xslt
SKYSALES.Util.getResource = function ()
{
    return SKYSALES.Resource;
};

//Douglas Crockford's inheritance method
SKYSALES.Util.extendObject = function (o)
{
    var F = function () {};
    F.prototype = o;
    return new F();
};

//Instantiates an object from an html object tag
SKYSALES.Util.initializeNewObject = function (paramObject)
{
    var objName = "";
    
    var defaultSetting = {
        objNameBase: '',
        objType: '',
        selector: ''
    };
    var validateParamObject = function ()
    {
        var retVal = true;
        $().extend(defaultSetting, paramObject);
        var propName = null;
        for (propName in defaultSetting)
        {
            if (defaultSetting.hasOwnProperty(propName))
            {
                if (defaultSetting[propName] === undefined)
                {
                    retVal = false;
                    break;
                }
            }
        }
        return retVal;
    };
    var paramNodeFunction = function (index)
    {
        var paramNodeValue = $(this).val();
        var parsedJsonObject = SKYSALES.Json.parse(paramNodeValue);
        var funRef = null;
        var refName = '';
        var refArray = [];
        var i = 0;
        var refIndex = 0;
        var arrayRegex = /^([a-zA-Z0-9]+)\[(\d+)\]$/;
        var matchArray = [];
        if (parsedJsonObject.method !== undefined)
        {
            funRef = SKYSALES.Instance[objName];
            if (parsedJsonObject.method.name.indexOf('.') > -1)
            {
                refArray = parsedJsonObject.method.name.split('.');
                for (i = 0; i < refArray.length; i += 1)
                {
                    refName = refArray[i];
                    matchArray = refName.match(arrayRegex);
                    if ((matchArray) && (matchArray.length > 0))
                    {
                        refName = matchArray[1];
                        refIndex = matchArray[2];
                        refIndex = parseInt(refIndex, 10);
                        funRef = funRef[refName][refIndex];
                    }
                    else
                    {
                        funRef = funRef[refName];
                    }
                }
            }
            else
            {
                funRef = funRef[parsedJsonObject.method.name];
            }
    
            if (funRef)
            {
                funRef(parsedJsonObject.method.paramJsonObject);
            }
        }
    };
    var objectNodeFunction = function ()
    {
        objName = paramObject.objNameBase + SKYSALES.Instance.getNextIndex();
        if (SKYSALES.Class[paramObject.objType])
        {
            SKYSALES.Instance[objName] = new SKYSALES.Class[paramObject.objType]();
            $("object.jsObject > param", this).each(paramNodeFunction);
        }
        else
        {
            alert("Object Type Not Found: " + paramObject.objType);
        }
    };
    var containerFunction = function ()
    {
        var isValid = validateParamObject();
        if (isValid)
        {
            $(paramObject.selector).each(objectNodeFunction);
        }
        else
        {
            alert("\nthere has been an error");
        }
    };
    containerFunction();
    return false;
};

/*
    Populates a html select box
    An Option object should always be used instead of writing <option> nodes to the dom.
    Writing <option> nodes to the dom has issues in IE6
*/
SKYSALES.Util.populateSelect = function (paramObj)
{
    var selectedItem = paramObj.selectedItem || null;
    var objectArray = paramObj.objectArray || null;
    var selectBox = paramObj.selectBox || null;
    var showCode = paramObj.showCode || false;
    var clearOptions = paramObj.clearOptions || false;
    var text = '';
    var value = '';
    var selectBoxObj = null;
    var obj = null;
    var prop = '';
    
    if (selectBox)
    {
        selectBoxObj = selectBox.get(0);
        if (selectBoxObj && selectBoxObj.options)
        {
            if (clearOptions)
            {
                selectBoxObj.options.length = 0;
            }
            else
            {
                if (!selectBoxObj.originalOptionLength)
                {
                    selectBoxObj.originalOptionLength = selectBoxObj.options.length;
                }
                selectBoxObj.options.length = selectBoxObj.originalOptionLength;
            }
            if (objectArray)
            {
                for (prop in objectArray)
                {
                    if (objectArray.hasOwnProperty(prop))
                    {
                        obj = objectArray[prop];
                        if (showCode)
                        {
                            text = obj.name + ' (' + obj.code + ')';
                        }
                        else
                        {
                            text = obj.name;
                        }
                        value = obj.code;
                        selectBoxObj.options[selectBoxObj.options.length] = new window.Option(text, value, false, false);
                    }
                }
                if (selectedItem !== null)
                {
                    selectBox.val(selectedItem);
                }
            }
        }
    }
};

SKYSALES.Util.cloneArray = function (array)
{
    return array.concat();
};

SKYSALES.Util.convertToLocaleCurrency = function (num)
{
    var json = {
        'num': num
    };
    var localeCurrency = new SKYSALES.Class.LocaleCurrency();
    localeCurrency.init(json);
    return localeCurrency.currency;
};

/*
    Name: 
        Class SkySales
    Param:
        None
    Return: 
        An instance of SkySales
    Functionality:
        This is the SkySales base class that most objects inherit from
    Notes:
        This class provides the ability to show and hide objects based on their container.
    Class Hierarchy:
        SkySales
*/
if (!SKYSALES.Class.SkySales)
{
    SKYSALES.Class.SkySales = function ()
    {   
        var thisSkySales = this;
        
        thisSkySales.containerId = '';
        thisSkySales.container = null;
        
        thisSkySales.init = SKYSALES.Class.SkySales.prototype.init;
        thisSkySales.getById = SKYSALES.Class.SkySales.prototype.getById;
        thisSkySales.setSettingsByObject = SKYSALES.Class.SkySales.prototype.setSettingsByObject;
        thisSkySales.addEvents = SKYSALES.Class.SkySales.prototype.addEvents;
        thisSkySales.setVars = SKYSALES.Class.SkySales.prototype.setVars;
        thisSkySales.hide = SKYSALES.Class.SkySales.prototype.hide;
        thisSkySales.show = SKYSALES.Class.SkySales.prototype.show;
        
        return thisSkySales;
    };
    SKYSALES.Class.SkySales.prototype.init = function (json)
    {
        this.setSettingsByObject(json);
        this.setVars();
    };
    SKYSALES.Class.SkySales.prototype.getById = function (id, container)
    {
        var retVal = null;
        
        if (id && container)
        {
            retVal = $('#' + id, container);
        }
        else if (id)
        {
            retVal = window.document.getElementById(id);
            if (retVal)
            {
                retVal = $(retVal);
            }
        }

        if (!retVal)
        {
            retVal = $([]);
        }
        
        return retVal;
    };
    SKYSALES.Class.SkySales.prototype.setSettingsByObject = function (json)
    {
        var propName = '';
        for (propName in json)
        {
            if (json.hasOwnProperty(propName))
            {
                if (this[propName] !== undefined)
                {
                    this[propName] = json[propName];
                }
            }
        }
    };
    SKYSALES.Class.SkySales.prototype.addEvents = function () {};
    SKYSALES.Class.SkySales.prototype.setVars = function () 
    {
        this.container = this.getById(this.containerId);
    };
    SKYSALES.Class.SkySales.prototype.hide = function () 
    {
        this.container.hide('slow');
    };
    SKYSALES.Class.SkySales.prototype.show = function () 
    {
        this.container.show('slow');
    };
}

/*
    Name: 
        Class BaseToggleView
    Param:
        None
    Return: 
        An instance of BaseToggleView
    Functionality:
        This is the Base class for any class that can show or hide itself.
        The containerId is the id of the domelement that you wish to show and hide.
    Notes:
    Class Hierarchy:
        SkySales -> BaseToggleView
*/
if (!SKYSALES.Class.BaseToggleView)
{
    SKYSALES.Class.BaseToggleView = function ()
    {   
        var parent = SKYSALES.Class.SkySales();
        var thisBaseToggleView = SKYSALES.Util.extendObject(parent);
        
        thisBaseToggleView.toggleViewIdArray = [];
        thisBaseToggleView.toggleViewArray = [];
        
        thisBaseToggleView.addToggleView = function (json)
        {
            if (json.toggleViewIdArray)
            {
                json = json.toggleViewIdArray;
            }
            var toggleViewIdArray = json || [];
            var toggleViewIdObj = null;
            var i = 0;
            var toggleView = null;
            if (toggleViewIdArray.length === undefined)
            {
                toggleViewIdArray = [];
                toggleViewIdArray[0] = json;
            }
            for (i = 0; i < toggleViewIdArray.length; i += 1)
            {
                toggleViewIdObj = toggleViewIdArray[i];
                toggleView = new SKYSALES.Class.ToggleView();
                toggleView.init(toggleViewIdObj);
                thisBaseToggleView.toggleViewArray[thisBaseToggleView.toggleViewArray.length] = toggleView;
            }
        };
        return thisBaseToggleView;
    };
}

/*
    Name: 
        Class FlightSearch
    Param:
        None
    Return: 
        An instance of FlightSearch
    Functionality:
        The object that initializes the AvailabilitySearchInput control
    Notes:
        This class contains and creates all of the objects necessary to add functionality to the AvailabilitySearchInput control
    Class Hierarchy:
        SkySales -> FlightSearch
*/
if (!SKYSALES.Class.FlightSearch)
{ 
    SKYSALES.Class.FlightSearch = function ()
    {   
        var parent = new SKYSALES.Class.SkySales();
        var thisFlightSearch = SKYSALES.Util.extendObject(parent);
        
        thisFlightSearch.marketArray = null;
        thisFlightSearch.flightTypeInputIdArray = null;
        thisFlightSearch.countryInputIdArray = null;
        
        var countryInputArray = [];
        var flightTypeInputArray = [];
        
        thisFlightSearch.init = function (paramObject)
        {
            this.setSettingsByObject(paramObject);
            this.setVars();
            this.addEvents();
            this.initFlightTypeInputIdArray();
            this.initCountryInputIdArray();
            this.populateFlightType();
        };
        
        thisFlightSearch.setSettingsByObject = function (json)
        {
            parent.setSettingsByObject.call(this, json);
            
            var i = 0;
            var marketArray = this.marketArray || [];
            var market = null;
            for (i = 0; i < marketArray.length; i += 1)
            {
                market = new SKYSALES.Class.FlightSearchMarket();
                market.flightSearch = this;
                market.index = i;
                market.init(marketArray[i]);
                thisFlightSearch.marketArray[i] = market;
            }
        };

        thisFlightSearch.initCountryInputIdArray = function ()
        {
            var i = 0;
            var countryInputId = null;
            var countryInput = {};
            var countryInputIdArray = this.countryInputIdArray || [];
            for (i = 0; i < countryInputIdArray.length; i += 1)
            {
                countryInputId = countryInputIdArray[i];
                countryInput = new SKYSALES.Class.CountryInput();
                countryInput.init(countryInputId);
                countryInputArray[countryInputArray.length] = countryInput;
            }
        };
        
        thisFlightSearch.initFlightTypeInputIdArray = function ()
        {
            var i = 0;
            var flightTypeInputId = null;
            var flightTypeInput = {};
            var flightTypeInputIdArray = this.flightTypeInputIdArray || [];
            for (i = 0; i < flightTypeInputIdArray.length; i += 1)
            {
                flightTypeInputId = flightTypeInputIdArray[i];
                flightTypeInput = new SKYSALES.Class.FlightTypeInput();
                flightTypeInput.flightSearch = this;
                flightTypeInput.index = i;
                flightTypeInput.init(flightTypeInputId);
                flightTypeInputArray[flightTypeInputArray.length] = flightTypeInput;
            }
        };
        
        thisFlightSearch.populateFlightType = function ()
        {
            var flightTypeIndex = 0;
            var flightType = null,
            jFlightTypeInput = null;
            
            for (flightTypeIndex = 0; flightTypeIndex < flightTypeInputArray.length; flightTypeIndex += 1)
            {
                flightType = flightTypeInputArray[flightTypeIndex];
                jFlightTypeInput = $(flightType.input);
                if (jFlightTypeInput.attr('checked'))
                {
                    jFlightTypeInput.click();
                    break;
                }
            }
        };
        
        thisFlightSearch.updateFlightType = function (activeflightType)
        {
            var flightTypeIndex = 0,
            flightType = null,
            hideInput = null,
            hideInputIndex,
            hideInputArray = null;
            
            for (flightTypeIndex = 0; flightTypeIndex < flightTypeInputArray.length; flightTypeIndex += 1)
            {
                flightType = flightTypeInputArray[flightTypeIndex];
                hideInputArray = flightType.hideInputArray;
                for (hideInputIndex = 0; hideInputIndex < hideInputArray.length; hideInputIndex += 1)
                {
                    hideInput = $(hideInputArray[hideInputIndex]);
                    hideInput.show();
                }
            }
            hideInputArray = activeflightType.hideInputArray;
            for (hideInputIndex = 0; hideInputIndex < hideInputArray.length; hideInputIndex += 1)
            {
                hideInput = $(hideInputArray[hideInputIndex]);
                hideInput.hide();
            }
        };
        
        return thisFlightSearch;
    };
    SKYSALES.Class.FlightSearch.createObject = function (json)
    {
        SKYSALES.Util.createObject('flightSearch', 'FlightSearch', json);
    };
}


/*
    Name: 
        Class FlightSearchMarket
    Param:
        None
    Return: 
        An instance of FlightSearchMarket
    Functionality:
        The object that initializes the market data for the AvailabilitySearchInput control
    Notes:
        
    Class Hierarchy:
        SkySales -> FlightSearchMarket
*/
if (!SKYSALES.Class.FlightSearchMarket)
{ 
    SKYSALES.Class.FlightSearchMarket = function ()
    {   
        var parent = new SKYSALES.Class.SkySales();
        var thisFlightSearchMarket = SKYSALES.Util.extendObject(parent);
        
        thisFlightSearchMarket.flightSearch = null;
        thisFlightSearchMarket.index = -1;
        //thisFlightSearchMarket.validationInputId = '';
        thisFlightSearchMarket.validationMessageObject = {};
        
        thisFlightSearchMarket.validationObjectIdArray = [];
        thisFlightSearchMarket.stationInputIdArray = [];
        thisFlightSearchMarket.stationDropDownIdArray = [];
        thisFlightSearchMarket.marketInputIdArray = [];
        thisFlightSearchMarket.macInputIdArray = [];
        thisFlightSearchMarket.marketDateIdArray = [];
        
        //var validationInput = null;
        var marketInputArray = [];
        var stationInputArray = [];
        var stationDropDownArray = [];
        var macInputArray = [];
        var marketDateArray = [];
        
        thisFlightSearchMarket.init = function (json)
        {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();

            this.initMarketInputIdArray();
            this.initStationInputIdArray();
            this.initStationDropDownIdArray();
            this.initMacInputIdArray();
            this.initMarketDateIdArray();
            this.initValidationObjectRedirect();
        };
        
        thisFlightSearchMarket.initMacInputIdArray = function ()
        {
            var i = 0;
            var macInputId = null;
            var macInput = {};
            var macInputIdArray = this.macInputIdArray || [];
            for (i = 0; i < macInputIdArray.length; i += 1)
            {
                macInputId = macInputIdArray[i];
                macInput = new SKYSALES.Class.MacInput();
                macInput.init(macInputId);
                macInputArray[macInputArray.length] = macInput;
                macInput.showMac.call(macInput.stationInput);
            }
        };
        
        thisFlightSearchMarket.initMarketDateIdArray = function ()
        {
            var i = 0;
            var marketDateId = null;
            var marketDate = {};
            var marketDateIdArray = this.marketDateIdArray || [];
            for (i = 0; i < marketDateIdArray.length; i += 1)
            {
                marketDateId = marketDateIdArray[i];
                marketDate = new SKYSALES.Class.MarketDate();
                marketDate.init(marketDateId);
                marketDateArray[marketDateArray.length] = marketDate;
            }
        };
        
        thisFlightSearchMarket.initMarketInputIdArray = function ()
        {
            var i = 0;
            var marketInputId = null;
            var marketInput = {};
            var marketInputIdArray = this.marketInputIdArray || [];
            for (i = 0; i < marketInputIdArray.length; i += 1)
            {
                marketInputId = marketInputIdArray[i];
                marketInput = new SKYSALES.Class.MarketInput();
                marketInput.init(marketInputId);
                marketInputArray[marketInputArray.length] = marketInput;
            }
        };
        
        thisFlightSearchMarket.initStationInputIdArray = function ()
        {
            var i = 0;
            var stationInputId = null;
            var stationInput = {};
            var stationInputIdArray = this.stationInputIdArray;
            for (i = 0; i < stationInputIdArray.length; i += 1)
            {
                stationInputId = stationInputIdArray[i];
                stationInput = new SKYSALES.Class.StationInput();
                stationInput.init(stationInputId);
                stationInputArray[stationInputArray.length] = stationInput;
            }
        };
        
        thisFlightSearchMarket.initStationDropDownIdArray = function ()
        {
            var i = 0;
            var stationDropDownId = null;
            var stationDropDown = {};
            var stationDropDownIdArray = this.stationDropDownIdArray;
            for (i = 0; i < stationDropDownIdArray.length; i += 1)
            {
                stationDropDownId = stationDropDownIdArray[i];
                stationDropDown = new SKYSALES.Class.StationDropDown();
                stationDropDown.init(stationDropDownId);
                stationDropDownArray[stationDropDownArray.length] = stationDropDown;
            }
        };
        
        //This function will redirect validation to a new object if the view has
        //been configured to use drop down lists but will tolerate a misconfiguration
        //if the dropdownlist mapping is not removed from the view
        thisFlightSearchMarket.initValidationObjectRedirect = function ()
        {
            //find the metaobject used to validate the first item inthe hash
            var validationObjectIdArray = this.validationObjectIdArray || [];
            var i = 0;
            var validationObjectId = '';
            var key = '';
            var value = '';
            var metaObjectParamToModify = null;
            var dropDownListToValidate = null;
            var metaObjectParam = null;
            for (i = 0; i < validationObjectIdArray.length; i += 1)
            {
                validationObjectId = validationObjectIdArray[i];
                key = validationObjectId.key || '';
                value = validationObjectId.value || '';
                metaObjectParamToModify = $("object.metaobject>param[value*='" + key + "']");
                if (metaObjectParamToModify.length > 0)
                {
                    //before we do the work check to see if the validation target even exists                        
                    dropDownListToValidate = $(":input#" + value);
                    if (dropDownListToValidate.length > 0)
                    {
                        metaObjectParam = metaObjectParamToModify[0];
                        if ('value' in metaObjectParam)
                        {
                            var newStr = metaObjectParam.value;
                            newStr = newStr.replace(key, value);
                            metaObjectParam.value = newStr;
                        }
                    }
                }
            }
        };
        return thisFlightSearchMarket;
    };
}


/*
    Name: 
        Class FlightStatusSearchContainer
    Param:
        None
    Return: 
        An instance of FlightStatusSearchContainer
    Functionality:
        The object that initializes the FlightFollowing control
    Notes:
        A FlightStatusSearchContainer object is created every time a div appears in the dom that has a class of flightStatusSearchContainer
        <div class="flightStatusSearchContainer" ></div>
        There should be one instance of this object for every FlightFollowing control in the view.
    Class Hierarchy:
        SkySales -> FlightSearchContainer -> FlightStatusSearchContainer
*/
//if (!SKYSALES.Class.FlightStatusSearchContainer)
//{ 
//    SKYSALES.Class.FlightStatusSearchContainer = function ()
//    {   
//        var flightStatusSearchContainer = new SKYSALES.Class.FlightSearchContainer();
//        var thisFlightStatusSearchContainer = SKYSALES.Util.extendObject(flightStatusSearchContainer);
//        return thisFlightStatusSearchContainer;
//    };
//    SKYSALES.Class.FlightStatusSearchContainer.initializeFlightStatusSearchContainers = function ()
//    {
//        var paramObject = {
//            objNameBase: 'flightStatusSearchContainer',
//            objType: 'FlightStatusSearchContainer',
//            selector: 'div.flightStatusSearchContainer'
//        };
//        SKYSALES.Util.initializeNewObject(paramObject);
//    };
//}

/*
    Name: 
        Class MacInput
    Param:
        None
    Return: 
        An instance of MacInput
    Functionality:
        Handels the functionality of the macs on the AvailabilitySearchInput control
    Notes:
        This class controls the mac html input controls
    Class Hierarchy:
        SkySales -> MacInput
*/
if (!SKYSALES.Class.MacInput)
{
    SKYSALES.Class.MacInput = function ()
    {
        var macInputBase = new SKYSALES.Class.SkySales();
        var thisMacInput = SKYSALES.Util.extendObject(macInputBase);
        
        thisMacInput.macHash = SKYSALES.Util.getResource().macHash;
        thisMacInput.stationHash = SKYSALES.Util.getResource().stationHash;
        thisMacInput.stationInputId = '';
        thisMacInput.macContainerId = '';
        thisMacInput.macLabelId = '';
        thisMacInput.macInputId = '';
        thisMacInput.macContainer = {};
        thisMacInput.stationInput = {};
        thisMacInput.macInput = {};
        thisMacInput.macLabel = {};
        
        thisMacInput.showMac = function ()
        {
            var stationCode = $(this).val();
            stationCode = stationCode || '';
            stationCode = stationCode.toUpperCase();
            var station = null;
            var macCode = '';
            var macText = '';
            var mac = null;

            thisMacInput.macInput.removeAttr('checked');
            thisMacInput.macContainer.hide();
            station = thisMacInput.stationHash[stationCode];
            if (station)
            {
                macCode = station.macCode;
                mac = thisMacInput.macHash[macCode];
                if ((mac) && (mac.stations.length > 0))
                {
                    macText = mac.stations.join();
                    thisMacInput.macLabel.html(macText);
                    thisMacInput.macContainer.show();
                }
            }
        };
        
        thisMacInput.addEvents = function ()
        {
            thisMacInput.stationInput.change(thisMacInput.showMac);
        };
        
        thisMacInput.setVars = function ()
        {
            thisMacInput.stationInput = this.getById(thisMacInput.stationInputId);
            thisMacInput.macContainer = this.getById(thisMacInput.macContainerId);
            thisMacInput.macLabel = this.getById(thisMacInput.macLabelId);
            thisMacInput.macInput = this.getById(thisMacInput.macInputId);
        };
        
        thisMacInput.init = function (paramObject)
        {
            macInputBase.init.call(this, paramObject);
            thisMacInput.macContainer.hide();
            this.addEvents();
        };
        return thisMacInput;
    };
}

/*
    Name: 
        Class MarketDate
    Param:
        None
    Return: 
        An instance of MarketDate
    Functionality:
         Handels the functionality of the dates on the AvailabilitySearchInput control
    Notes:
        The dates also effect the date selection calendar
    Class Hierarchy:
        SkySales -> MarketDate
*/
if (!SKYSALES.Class.MarketDate)
{
    SKYSALES.Class.MarketDate = function ()
    {
        var marketDateBase = new SKYSALES.Class.SkySales();
        var thisMarketDate = SKYSALES.Util.extendObject(marketDateBase);
        
        thisMarketDate.dateFormat = SKYSALES.datepicker.datePickerFormat;
        thisMarketDate.dateDelimiter = SKYSALES.datepicker.datePickerDelimiter;
        thisMarketDate.marketDateId = '';
        thisMarketDate.marketDate = null;
        thisMarketDate.marketDayId = '';
        thisMarketDate.marketDay = null;
        thisMarketDate.marketMonthYearId = '';
        thisMarketDate.marketMonthYear = null;
        
        thisMarketDate.setSettingsByObject = function (jsonObject)
        {
            marketDateBase.setSettingsByObject.call(this, jsonObject);
            var propName = '';
            for (propName in jsonObject)
            {
                if (thisMarketDate.hasOwnProperty(propName))
                {
                    thisMarketDate[propName] = jsonObject[propName];
                }
            }
        };

        thisMarketDate.parseDate = function (dateStr)
        {
            var day = '';
            var month = '';
            var year = '';
            var date = new Date();
            var dateData = '';
            var formatChar = '';
            var datePickerArray = [];
            var i = 0;
            if (dateStr.indexOf(thisMarketDate.dateDelimiter) > -1)
            {
                datePickerArray = dateStr.split(thisMarketDate.dateDelimiter);
                for (i = 0; i < thisMarketDate.dateFormat.length; i += 1)
                {
                    dateData = datePickerArray[i];
                    if (dateData.charAt(0) === '0')
                    {
                        dateData = dateData.substring(1);
                    }
                    formatChar = thisMarketDate.dateFormat.charAt(i);
                    switch (formatChar)
                    {
                    case 'm':
                        month = dateData;
                        break;
                    case 'd':
                        day = dateData;
                        break;
                    case 'y':
                        year = dateData;
                        break;
                    }
                }
                date = new Date(year, month - 1, day);
            }
            return date;
        };
     
        thisMarketDate.addEvents = function ()
        {
            var datePickerManager = new SKYSALES.Class.DatePickerManager();
            datePickerManager.isAOS = false;
            datePickerManager.yearMonth = thisMarketDate.marketMonthYear;
            datePickerManager.day = thisMarketDate.marketDay;
            datePickerManager.linkedDate = thisMarketDate.marketDate;
            datePickerManager.init();
        };
        
        thisMarketDate.setVars = function ()
        {
            thisMarketDate.marketDate = this.getById(thisMarketDate.marketDateId);
            thisMarketDate.marketDay = this.getById(thisMarketDate.marketDayId);
            thisMarketDate.marketMonthYear = this.getById(thisMarketDate.marketMonthYearId);
        };
        
        thisMarketDate.init = function (paramObject)
        {
            marketDateBase.init.call(this, paramObject);
            this.addEvents();
        };

        // Checks if the 1st date is before the 2nd date.
        thisMarketDate.datesInOrder = function (dateArray)
        {
            var retVal = true;
            var dateA = null;
            var dateB = null;

            dateA = this.parseDate(dateArray[0]);
            dateB = this.parseDate(dateArray[1]);  
            
            if (dateA > dateB)
            {
                retVal = false;
            }
            return retVal;
        };

        return thisMarketDate;
    };
}

/*
    Name: 
        Class CountryInput
    Param:
        None
    Return: 
        An instance of CountryInput
    Functionality:
         Handels the functionality of the resident country on the AvailabilitySearchInput control
    Notes:
        The list of countries comes from the resource object
    Class Hierarchy:
        SkySales -> CountryInput
*/
if (!SKYSALES.Class.CountryInput)
{
    SKYSALES.Class.CountryInput = function ()
    {
        var countryInputBase = new SKYSALES.Class.SkySales();
        var thisCountryInput = SKYSALES.Util.extendObject(countryInputBase);
        
        thisCountryInput.countryInfo = SKYSALES.Util.getResource().countryInfo;
        thisCountryInput.countryInputId = '';
        thisCountryInput.input = {};
        thisCountryInput.defaultCountry = '';
        thisCountryInput.countryArray = [];
        
        thisCountryInput.populateCountryInput = function ()
        {
            var selectParamObj = {
                'selectBox': thisCountryInput.input,
                'objectArray': thisCountryInput.countryArray,
                'selectedItem': thisCountryInput.defaultCountry,
                'showCode': true
            };
            SKYSALES.Util.populateSelect(selectParamObj);
        };
        
        thisCountryInput.addEvents = function ()
        {
        };
        
        thisCountryInput.setVars = function ()
        {
            thisCountryInput.input = this.getById(thisCountryInput.countryInputId);
            var countryInfo = thisCountryInput.countryInfo;
            if (countryInfo)
            {
                if (countryInfo.CountryList)
                {
                    thisCountryInput.countryArray = countryInfo.CountryList;
                }
                if (countryInfo.DefaultValue)
                {
                    thisCountryInput.defaultCountry = countryInfo.DefaultValue;
                }
            }
        };
        
        thisCountryInput.init = function (paramObject)
        {
            countryInputBase.init.call(this, paramObject);
            thisCountryInput.populateCountryInput();
            this.addEvents();
        };
        return thisCountryInput;
    };
}

/*
    Name: 
        Class FlightTypeInput
    Param:
        None
    Return: 
        An instance of CountryInput
    Functionality:
         Handels the functionality of the flight type on the AvailabilitySearchInput control
    Notes:
        Flight type is the type of flight, as in Round Trip, One Way, or Open Jaw
        When you select a flight type the correct html fields are shown.
    Class Hierarchy:
        SkySales -> FlightTypeInput
*/
if (!SKYSALES.Class.FlightTypeInput)
{
    SKYSALES.Class.FlightTypeInput = function ()
    {
        var parent = new SKYSALES.Class.SkySales();
        var thisFlightTypeInput = SKYSALES.Util.extendObject(parent);
        
        thisFlightTypeInput.flightSearch = null;
        thisFlightTypeInput.index = -1;
        
        thisFlightTypeInput.flightTypeId = '';
        thisFlightTypeInput.hideInputIdArray = [];
        thisFlightTypeInput.hideInputArray = [];
        thisFlightTypeInput.input = {};
        
        thisFlightTypeInput.updateFlightTypeHandler = function ()
        {
            thisFlightTypeInput.flightSearch.updateFlightType(thisFlightTypeInput);
        };
        
        thisFlightTypeInput.addEvents = function ()
        {
            parent.addEvents.call(this);
            this.input.click(this.updateFlightTypeHandler);
        };
        
        thisFlightTypeInput.setVars = function ()
        {
            parent.setVars.call(this);
            
            var hideInputIndex = 0;
            var hideInput = null;
            var hideInputArray = [];

            thisFlightTypeInput.input = this.getById(this.flightTypeId);
            for (hideInputIndex = 0; hideInputIndex < this.hideInputIdArray.length; hideInputIndex += 1)
            {
                hideInput = thisFlightTypeInput.getById(this.hideInputIdArray[hideInputIndex]);
                if (hideInput)
                {
                    hideInputArray[hideInputArray.length] = hideInput;
                }
            }
            thisFlightTypeInput.hideInputArray = $(hideInputArray);
        };
        
        thisFlightTypeInput.init = function (json)
        {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };
        return thisFlightTypeInput;
    };
}

/*
    Name: 
        Class MarketInput
    Param:
        None
    Return: 
        An instance of MarketInput
    Functionality:
         Handels the functionality of the markets on the AvailabilitySearchInput control
    Notes:
        Markets are a link between stations. 
        When you select an orgin station only the valid destionation stations should be available for selection.
    Class Hierarchy:
        SkySales -> MarketInput
*/
if (!SKYSALES.Class.MarketInput)
{
    SKYSALES.Class.MarketInput = function ()
    {
        var marketInputBase = new SKYSALES.Class.SkySales();
        var thisMarketInput = SKYSALES.Util.extendObject(marketInputBase);
        
        thisMarketInput.marketHash = SKYSALES.Util.getResource().marketHash;
        thisMarketInput.stationHash = SKYSALES.Util.getResource().stationHash;
        
        thisMarketInput.containerId = '';
        thisMarketInput.container = null;
        thisMarketInput.disableInputId = '';
        thisMarketInput.disableInput = null;
        thisMarketInput.originId = '';
        thisMarketInput.origin = null;
        thisMarketInput.destinationId = '';
        thisMarketInput.destination = null;
        thisMarketInput.toggleMarketCount = 0;
        
        thisMarketInput.toggleMarket = function ()
        {
            if ((thisMarketInput.toggleMarketCount % 2) === 0)
            {
                $(':input', thisMarketInput.container).attr('disabled', 'disabled');
            }
            else
            {
                $(':input', thisMarketInput.container).removeAttr('disabled');
            }
            thisMarketInput.toggleMarketCount += 1;
        };
        
        thisMarketInput.useComboBox = function (input)
        {
            var retVal = true;
            if (input && input.get(0) && input.get(0).options)
            {
                retVal = false;
            }
            return retVal;
        };
        
        thisMarketInput.updateMarketOrigin = function ()
        {
            var origin = $(this).val();
            origin = origin.toUpperCase();
            var destinationArray = thisMarketInput.marketHash[origin];
            destinationArray = destinationArray || [];
            var selectParamObj = null;
            var useCombo = true;

            useCombo = thisMarketInput.useComboBox(thisMarketInput.destination);
            if (useCombo)
            {
                selectParamObj = {
                    'input': thisMarketInput.destination,
                    'options': destinationArray
                };
                SKYSALES.Class.DropDown.getDropDown(selectParamObj);
            }
            else
            {
                selectParamObj = {
                    'selectBox': thisMarketInput.destination,
                    'objectArray': destinationArray,
                    'showCode': true
                };
                SKYSALES.Util.populateSelect(selectParamObj);
            }
        };
        
        thisMarketInput.addEvents = function ()
        {
            thisMarketInput.origin.change(thisMarketInput.updateMarketOrigin);
            thisMarketInput.disableInput.click(thisMarketInput.toggleMarket);
        };
        
        thisMarketInput.setVars = function ()
        {
            thisMarketInput.container = this.getById(thisMarketInput.containerId);
            thisMarketInput.disableInput = this.getById(thisMarketInput.disableInputId);
            thisMarketInput.origin = this.getById(thisMarketInput.originId);
            thisMarketInput.destination = this.getById(thisMarketInput.destinationId);
        };
        
        thisMarketInput.populateMarketInput = function (input)
        {
            var useCombo = true;
            var selectParamObj = {};
            if ((input) && (input.length > 0))
            {
                useCombo = thisMarketInput.useComboBox(input);
                if (useCombo)
                {
                    selectParamObj = {
                        'input': input,
                        'options': thisMarketInput.stationHash
                    };
                    SKYSALES.Class.DropDown.getDropDown(selectParamObj);
                }
                else
                {
                    selectParamObj = {
                        'selectBox':  input,
                        'objectArray': thisMarketInput.stationHash,
                        'showCode': true
                    };
                    SKYSALES.Util.populateSelect(selectParamObj);
                }
            }
        };
        
        thisMarketInput.init = function (paramObject)
        {
            marketInputBase.init.call(this, paramObject);
            this.addEvents();
            
            thisMarketInput.populateMarketInput(thisMarketInput.origin);
            thisMarketInput.populateMarketInput(thisMarketInput.destination);
            
            thisMarketInput.disableInput.click();
            thisMarketInput.disableInput.removeAttr('checked');
        };
        return thisMarketInput;
    };
}


/*
    Name: 
        Class StationInput
    Param:
        None
    Return: 
        An instance of StationInput
    Functionality:
         Handels the functionality of the stations on the AvailabilitySearchInput control
    Notes:
        StationInput is the html form element where you type the orgin or destination station
    Class Hierarchy:
        SkySales -> StationInput
*/
if (!SKYSALES.Class.StationInput)
{
    SKYSALES.Class.StationInput = function ()
    {
        var parent = new SKYSALES.Class.SkySales();
        var thisStationInput = SKYSALES.Util.extendObject(parent);
        
        thisStationInput.stationInputId = '';
        thisStationInput.stationInput = null;
        
        thisStationInput.setVars = function ()
        {
            parent.setVars.call(this);
            thisStationInput.stationInput = this.getById(this.stationInputId);
        };
        
        thisStationInput.init = function (json)
        {
            parent.init.call(this, json);
            this.addEvents();
        };
        return thisStationInput;
    };
}

/*
    Name: 
        Class StationDropDown
    Param:
        None
    Return: 
        An instance of StationDropDown
    Functionality:
         Handels the functionality of the stations on the AvailabilitySearchInput control
    Notes:
        StationDropDown is the html form element where you select the orgin or destination station
    Class Hierarchy:
        SkySales -> StationDropDown
*/
if (!SKYSALES.Class.StationDropDown)
{
    SKYSALES.Class.StationDropDown = function ()
    {
        var stationDropDownBase = new SKYSALES.Class.SkySales();
        var thisStationDropDown = SKYSALES.Util.extendObject(stationDropDownBase);
        
        thisStationDropDown.selectBoxId = '';
        thisStationDropDown.selectBox = null;
        thisStationDropDown.inputId = '';
        thisStationDropDown.input = null;
        
        thisStationDropDown.updateStationDropDown = function ()
        {
            var stationCode = $(this).val();
            thisStationDropDown.selectBox.val(stationCode);
        };
        
        thisStationDropDown.updateStationInput = function ()
        {
            var stationCode = $(this).val();
            thisStationDropDown.input.val(stationCode);
            thisStationDropDown.input.change();
        };
        
        thisStationDropDown.addEvents = function ()
        {
            thisStationDropDown.input.change(thisStationDropDown.updateStationDropDown);
            thisStationDropDown.selectBox.change(thisStationDropDown.updateStationInput);
        };
        
        thisStationDropDown.setVars = function ()
        {
            thisStationDropDown.selectBox = this.getById(thisStationDropDown.selectBoxId);
            thisStationDropDown.input = this.getById(thisStationDropDown.inputId);
        };
        
        thisStationDropDown.init = function (paramObject)
        {
            stationDropDownBase.init.call(this, paramObject);
            this.addEvents();
            thisStationDropDown.input.change();
        };
        return thisStationDropDown;
    };
}

/*global $ SKYSALES window */

/*
Name: 
    TravelDocumentInput
Param:
    None
Return: 
    An instance of TravelDocumentInput
Functionality:
    The object that sets the travel document information of the TravelDocumentInput control for registration
Class Hierarchy:
    TravelDocumentInput
*/
if (!SKYSALES.Class.TravelDocumentInput)
{
    SKYSALES.Class.TravelDocumentInput = function () 
    {
        var parent = new SKYSALES.Class.SkySales();
        var thisTravelDocumentInput = SKYSALES.Util.extendObject(parent);

        thisTravelDocumentInput.instanceName = '';
        thisTravelDocumentInput.delimiter = '_';

        thisTravelDocumentInput.travelDocumentInfoId = '';
        thisTravelDocumentInput.travelDocumentInfo = null;
        thisTravelDocumentInput.documentNumberId = '';
        thisTravelDocumentInput.documentNumber = null;
        thisTravelDocumentInput.documentTypeId = '';
        thisTravelDocumentInput.documentType = null;
        thisTravelDocumentInput.documentIssuingCountryId = '';
        thisTravelDocumentInput.documentIssuingCountry = null;
        thisTravelDocumentInput.documentExpYearId = '';
        thisTravelDocumentInput.documentExpYear = null;
        thisTravelDocumentInput.documentExpMonthId = '';
        thisTravelDocumentInput.documentExpMonth = null;
        thisTravelDocumentInput.documentExpDayId = '';
        thisTravelDocumentInput.documentExpDay = null;
        thisTravelDocumentInput.actionId = '';
        thisTravelDocumentInput.action = null;
        thisTravelDocumentInput.travelDocumentKey = '';
        
        thisTravelDocumentInput.missingDocumentText = '';
        thisTravelDocumentInput.missingDocumentTypeText = '';
        thisTravelDocumentInput.invalidExpDateText = '';
        thisTravelDocumentInput.emptyExpDateText = '';
        thisTravelDocumentInput.invalidDaysOfMonthTextPre = '';
        thisTravelDocumentInput.invalidDaysOfMonthTextMid = '';
        thisTravelDocumentInput.invalidDaysOfMonthTextPost = '';
        thisTravelDocumentInput.missingDocumentNumberText = '';
        thisTravelDocumentInput.missingDocumentCountryText = '';

        thisTravelDocumentInput.init = function (json) 
        {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };

        thisTravelDocumentInput.setVars = function () 
        {
            thisTravelDocumentInput.travelDocumentInfo = this.getById(this.travelDocumentInfoId);
            thisTravelDocumentInput.documentType = this.getById(this.documentTypeId);
            thisTravelDocumentInput.documentNumber = this.getById(this.documentNumberId);
            thisTravelDocumentInput.documentIssuingCountry = this.getById(this.documentIssuingCountryId);
            thisTravelDocumentInput.documentExpYear = this.getById(this.documentExpYearId);
            thisTravelDocumentInput.documentExpMonth = this.getById(this.documentExpMonthId);
            thisTravelDocumentInput.documentExpDay = this.getById(this.documentExpDayId);
            thisTravelDocumentInput.action = this.getById(this.actionId);
        };
        
        thisTravelDocumentInput.setTravelDocumentInfo = function ()
        {
            var travelDocumentKey = '';
            var documentType = this.documentType.val();
            var documentNumber = this.documentNumber.val();
            var documentIssuingCountry = this.documentIssuingCountry.val();

            if (documentType && documentNumber && documentIssuingCountry) {
                //travelDocumentKey should always start with the delimiter.
                //travelDocumentKey format is as follows: _<DOC TYPE>_<DOC NUMBER>_<ISSUING COUNTRY>
                travelDocumentKey = this.delimiter + documentType + this.delimiter + documentNumber + this.delimiter + documentIssuingCountry;
                this.travelDocumentInfo.val(travelDocumentKey);
            }
            return true;
        };
        
        thisTravelDocumentInput.validateTravelDocumentHandler = function ()
        {
            var result = thisTravelDocumentInput.validateTravelDocument();
            return result;
        };
        
        thisTravelDocumentInput.validateTravelDocument = function ()
        {
            this.setTravelDocumentInfo();
            var action = this.action.get(0);
            var result = window.validate(action) && this.validateInput();
            return result;
        };

        thisTravelDocumentInput.addEvents = function () 
        {
            this.action.click(this.validateTravelDocumentHandler);
        };

        thisTravelDocumentInput.validateInput = function () 
        {
            var retVal = true;
            var msg = '';
            var invalidDateMsg = '';
            var documentNumberValue = this.documentNumber.val() || '';
            var documentExpYearValue = this.documentExpYear.val() || '';
            var documentExpMonthValue = this.documentExpMonth.val() || '';
            var documentExpDayValue = this.documentExpDay.val() || '';
            var documentTypeValue = this.documentType.val() || '';
            var documentIssuingCountryValue = this.documentIssuingCountry.val() || '';     
            var isPassedDate = false;
            var isValidDate = false;
            var documentExpMonthText = '';
            
            if (documentNumberValue || documentTypeValue || documentIssuingCountryValue || documentExpYearValue || documentExpMonthValue || documentExpDayValue)
            {
                if (!documentNumberValue) 
                {
                    msg = msg + this.missingDocumentNumberText + "\n";
                }
                if (!documentTypeValue) 
                {
                    msg = msg + this.missingDocumentTypeText + "\n";
                }
                if (!documentIssuingCountryValue) 
                {
                    msg = msg + this.missingDocumentCountryText + "\n";
                }
                
                isValidDate = this.checkDaysOfMonth(documentExpDayValue, documentExpMonthValue, documentExpYearValue);
                isPassedDate = this.isPastDate(documentExpDayValue, documentExpMonthValue, documentExpYearValue);
                if (documentExpDayValue && documentExpMonthValue && documentExpYearValue)
                {
                    if (!isValidDate)
                    {
                        documentExpMonthText = this.documentExpMonth.find(':selected').text();
                        invalidDateMsg = this.invalidDaysOfMonthTextPre + documentExpDayValue;
                        invalidDateMsg += this.invalidDaysOfMonthTextMid + documentExpMonthText + this.invalidDaysOfMonthTextPost;
                        msg = msg + invalidDateMsg + "\n";
                    }
                    else if (!isPassedDate)
                    {
                        msg = msg + this.invalidExpDateText + "\n";
                    }
                }
                else
                {
                    msg = msg + this.emptyExpDateText + "\n";
                }
                
                if (msg) 
                {
                    window.alert(this.missingDocumentText + "\n" + msg);
                    retVal = false;
                }
            }
            return retVal;
        };
        
        thisTravelDocumentInput.checkDaysOfMonth = function (day, month, year) 
        {
            year = window.parseInt(year, 10);
            month = window.parseInt(month, 10);
            day = window.parseInt(day, 10);
            var retVal = false;
            var lastDayInFeb = null;
            var daysInFeb = -1;
            var daysInMonth = null;
            if (year && month && day)
            {
                month -= 1;
                lastDayInFeb = new Date();
                lastDayInFeb.setMonth(2);
                lastDayInFeb.setDate(1);
                lastDayInFeb.setDate(lastDayInFeb.getDate() - 1);
                daysInFeb = lastDayInFeb.getDate();
                daysInMonth = [31, daysInFeb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                if (day <= daysInMonth[month]) 
                {
                    retVal = true;
                }
            }
            return retVal;
        };

        thisTravelDocumentInput.isPastDate = function (day, month, year)
        {
            year = window.parseInt(year, 10);
            month = window.parseInt(month, 10);
            day = window.parseInt(day, 10);
            var retVal = false;
            var today = null;
            var compareDate = null;
            if (year && month && day)
            {
                month -= 1;
                today = new Date();
                compareDate = new Date(year, month, day);
                if (compareDate > today)
                {
                    retVal = true;
                }
            }
            return retVal;
        };
        
        return thisTravelDocumentInput;
    };
}

/*
    Name: 
        Class ControlGroup
    Param:
        None
    Return: 
        An instance of ControlGroup
    Functionality:
        Handels a ControlGroup validation
    Notes:
        
    Class Hierarchy:
        SkySales -> ControlGroup
*/
if (!SKYSALES.Class.ControlGroup)
{
    SKYSALES.Class.ControlGroup = function ()
    {   
        var parent = new SKYSALES.Class.SkySales();
        var thisControlGroup = SKYSALES.Util.extendObject(parent);
        
        thisControlGroup.actionId = 'SkySales';
        thisControlGroup.action = null;
        
        thisControlGroup.init = function (json)
        {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };
        thisControlGroup.setVars = function ()
        {
            parent.setVars.call(this);
            thisControlGroup.action = this.getById(this.actionId);
        };
        thisControlGroup.addEvents = function ()
        {
            parent.addEvents.call(this);
            this.action.click(this.validateHandler);
        };
        thisControlGroup.validateHandler = function ()
        {
            var retVal = thisControlGroup.validate();
            return retVal;
        };
        thisControlGroup.validate = function ()
        {
            var actionDom = this.action.get(0);
            var retVal = window.validate(actionDom);
            return retVal;
        };
        return thisControlGroup;
    };
    SKYSALES.Class.ControlGroup.createObject = function (json)
    {
        SKYSALES.Util.createObject('controlGroup', 'ControlGroup', json);
    };
}

/*
    Name: 
        Class ControlGroupRegister
    Param:
        None
    Return: 
        An instance of ControlGroupRegister
    Functionality:
        Handels a ControlGroupRegister validation
    Notes:
        
    Class Hierarchy:
        SkySales -> ControlGroupRegister
*/
if (!SKYSALES.Class.ControlGroupRegister)
{
    SKYSALES.Class.ControlGroupRegister = function ()
    {
        var parent = new SKYSALES.Class.ControlGroup();
        var thisControlGroupRegister = SKYSALES.Util.extendObject(parent);

        thisControlGroupRegister.travelDocumentInput = null;

        thisControlGroupRegister.setSettingsByObject = function (json)
        {
            parent.setSettingsByObject.call(this, json);
            var travelDocumentInput = new SKYSALES.Class.TravelDocumentInput();
            travelDocumentInput.init(this.travelDocumentInput);
            thisControlGroupRegister.travelDocumentInput = travelDocumentInput;
        };
        thisControlGroupRegister.validateHandler = function ()
        {
            var retVal = thisControlGroupRegister.validate();
            return retVal;
        };
        thisControlGroupRegister.validate = function ()
        {
            var retVal = false;
            retVal = (this.travelDocumentInput.setTravelDocumentInfo() && this.travelDocumentInput.validateExpDate());
            if (retVal)
            {
                retVal = parent.validate.call(this);
            }
            return retVal;
        };
        return thisControlGroupRegister;
    };
    SKYSALES.Class.ControlGroupRegister.createObject = function (json)
    {
        SKYSALES.Util.createObject('controlGroupRegister', 'ControlGroupRegister', json);
    };
}

/*
    Name: 
        Class ContactInput
    Param:
        None
    Return: 
        An instance of ContactInput
    Functionality:
        Handels the ContactInput control
    Notes:
        Auto populates from the clientHash cookie
        when you enter in a name that matches the one on the cookie.
    Class Hierarchy:
        SkySales -> ContactInput
*/
if (!SKYSALES.Class.ContactInput)
{
    SKYSALES.Class.ContactInput = function ()
    {
        var contactInput = new SKYSALES.Class.SkySales();
        var thisContactInput = SKYSALES.Util.extendObject(contactInput);

        thisContactInput.clientId = '';
        thisContactInput.keyIdArray = [];
        thisContactInput.keyArray = [];
        thisContactInput.clientStoreIdHash = null;
        thisContactInput.countryInputId = '';
        thisContactInput.countryInput = null;
        thisContactInput.stateInputId = '';
        thisContactInput.stateInput = null;
        thisContactInput.countryStateHash = null;
        thisContactInput.imContactId = '';
        thisContactInput.imContact = null;
        thisContactInput.currentContactData = {};
        thisContactInput.logOutButton = null;

        thisContactInput.clientHash = SKYSALES.Util.getResource().clientHash;

        thisContactInput.setSettingsByObject = function (jsonObject)
        {
            contactInput.setSettingsByObject.call(this, jsonObject);
            var propName = '';
            for (propName in jsonObject)
            {
                if (thisContactInput.hasOwnProperty(propName))
                {
                    thisContactInput[propName] = jsonObject[propName];
                }
            }
        };

	    thisContactInput.clearCurrentContactHandler = function ()
        {
            thisContactInput.clearCurrentContact();        
        };
        
        thisContactInput.clearCurrentContact = function ()
        {
            this.getById(thisContactInput.clientId + '_DropDownListTitle').val('');
            this.getById(thisContactInput.clientId + '_TextBoxFirstName').val('');
            this.getById(thisContactInput.clientId + '_TextBoxMiddleName').val('');
            this.getById(thisContactInput.clientId + '_TextBoxLastName').val('');
            this.getById(thisContactInput.clientId + '_TextBoxAddressLine1').val('');
            this.getById(thisContactInput.clientId + '_TextBoxAddressLine2').val('');
            this.getById(thisContactInput.clientId + '_TextBoxAddressLine3').val('');
            this.getById(thisContactInput.clientId + '_TextBoxCity').val('');
            this.getById(thisContactInput.clientId + '_DropDownListStateProvince').val('');
            this.getById(thisContactInput.clientId + '_DropDownListCountry').val('');
            this.getById(thisContactInput.clientId + '_TextBoxPostalCode').val('');
            this.getById(thisContactInput.clientId + '_TextBoxHomePhone').val('');
            this.getById(thisContactInput.clientId + '_TextBoxWorkPhone').val('');
            this.getById(thisContactInput.clientId + '_TextBoxOtherPhone').val('');
            this.getById(thisContactInput.clientId + '_TextBoxFax').val('');
            this.getById(thisContactInput.clientId + '_TextBoxEmailAddress').val('');
        };

        thisContactInput.populateCurrentContactHandler = function ()
        {
            thisContactInput.populateCurrentContact();        
        };
        
        thisContactInput.populateCurrentContact = function ()
        {
            if (this.currentContactData)
            {
                if (this.imContact.attr("checked") === true)
                {
                    this.getById(thisContactInput.clientId + '_DropDownListTitle').val(thisContactInput.currentContactData.title);
                    this.getById(thisContactInput.clientId + '_TextBoxFirstName').val(thisContactInput.currentContactData.firstName);
                    this.getById(thisContactInput.clientId + '_TextBoxMiddleName').val(thisContactInput.currentContactData.middleName);
                    this.getById(thisContactInput.clientId + '_TextBoxLastName').val(thisContactInput.currentContactData.lastName);
                    this.getById(thisContactInput.clientId + '_TextBoxAddressLine1').val(thisContactInput.currentContactData.streetAddressOne);
                    this.getById(thisContactInput.clientId + '_TextBoxAddressLine2').val(thisContactInput.currentContactData.streetAddressTwo);
                    this.getById(thisContactInput.clientId + '_TextBoxAddressLine3').val(thisContactInput.currentContactData.streetAddressThree);
                    this.getById(thisContactInput.clientId + '_TextBoxCity').val(thisContactInput.currentContactData.city);
                    this.getById(thisContactInput.clientId + '_DropDownListStateProvince').val(thisContactInput.currentContactData.country + "|" + thisContactInput.currentContactData.stateProvince);
                    this.getById(thisContactInput.clientId + '_DropDownListCountry').val(thisContactInput.currentContactData.country);
                    this.getById(thisContactInput.clientId + '_TextBoxPostalCode').val(thisContactInput.currentContactData.postalCode);
                    this.getById(thisContactInput.clientId + '_TextBoxHomePhone').val(thisContactInput.currentContactData.eveningPhone);
                    this.getById(thisContactInput.clientId + '_TextBoxWorkPhone').val(thisContactInput.currentContactData.dayPhone);
                    this.getById(thisContactInput.clientId + '_TextBoxOtherPhone').val(thisContactInput.currentContactData.mobilePhone);
                    this.getById(thisContactInput.clientId + '_TextBoxFax').val(thisContactInput.currentContactData.faxPhone);
                    this.getById(thisContactInput.clientId + '_TextBoxEmailAddress').val(thisContactInput.currentContactData.email);
                }
                else
                {
                    thisContactInput.clearCurrentContact();
                }
            }
        };

        thisContactInput.populateCountryStateHash = function ()
        {
            var i = 0;
            var selectBox = thisContactInput.stateInput.get(0);
            var country = '';
            var stateArray = [];
            var countryStateArray = [];
            var option = null;
            var state = '';
            var stateName = '';
            var stateObject = {};
            var countryStateHash = {};
            if (selectBox && selectBox.options)
            {
                thisContactInput.countryStateHash = {};
                countryStateHash.customStates = [];
                countryStateHash.allStates = [];
                for (i = 0; i < selectBox.options.length; i += 1)
                {
                    option = selectBox.options[i];
                    state = option.value;
                    stateName = option.text;
                    stateObject = {
                        'name': stateName,
                        'code': state
                    };
                    countryStateArray = option.value.split('|');
                    if (countryStateArray.length === 2)
                    {
                        country = countryStateArray[0];
                        stateArray = countryStateHash[country];
                        stateArray = stateArray || [];
                        stateArray[stateArray.length] = stateObject;
                        countryStateHash[country] = stateArray;

                        countryStateHash.allStates[countryStateHash.allStates.length] = stateObject;
                    }
                    else
                    {
                        countryStateHash.customStates[countryStateHash.customStates.length] = stateObject;
                    }
                }
                thisContactInput.countryStateHash = countryStateHash;
            }
        };

        thisContactInput.updateCountry = function ()
        {
            var countryState = thisContactInput.stateInput.val();
            var countryStateArray = countryState.split('|');
            var country = '';
            if (countryStateArray.length === 2)
            {
                country = countryStateArray[0];
                thisContactInput.countryInput.val(country);
            }
        };

        thisContactInput.updateState = function ()
        {
            var country = thisContactInput.countryInput.val();
            var stateArray = [];
            var stateObject = {};
            var stateObjectArray = [];
            var i = 0;
            if (!thisContactInput.countryStateHash)
            {
                thisContactInput.populateCountryStateHash();
            }
            stateArray = thisContactInput.countryStateHash[country];
            stateArray = stateArray || [];
            if (stateArray.length === 0)
            {
                stateArray = thisContactInput.countryStateHash.allStates;
            }
            for (i = 0; i < thisContactInput.countryStateHash.customStates.length; i += 1)
            {
                stateObject = thisContactInput.countryStateHash.customStates[i];
                stateObjectArray[stateObjectArray.length] = stateObject;
            }
            for (i = 0; i < stateArray.length; i += 1)
            {
                stateObject = stateArray[i];
                stateObjectArray[stateObjectArray.length] = stateObject;
            }
            var paramObject = {
                'objectArray': stateObjectArray,
                'selectBox': thisContactInput.stateInput,
                'showCode': false,
                'clearOptions': true
            };
            SKYSALES.Util.populateSelect(paramObject);
        };

        thisContactInput.getKey = function ()
        {
            var i = 0;
            var keyArray = thisContactInput.keyArray;
            var keyObject = null;
            var key = '';
            for (i = 0; i < keyArray.length; i += 1)
            {
                keyObject = keyArray[i];
                key += keyObject.val();
            }
            key = thisContactInput.clientId + '_' + (key.toLowerCase());
            return key;
        };

        thisContactInput.populateClientStoreIdHash = function ()
        {
            var clientHash = thisContactInput.clientHash;
            var i = 0;
            var keyValueStr = '';
            var keyValueArray = [];
            var singleKeyValueStr = '';
            var eqIndex = -1;
            var key = thisContactInput.getKey();

            var value = null;
            thisContactInput.clientStoreIdHash = {};
            if (key && clientHash && clientHash[key])
            {
                thisContactInput.clientStoreIdHash = thisContactInput.clientStoreIdHash || {};
                keyValueStr = clientHash[key];
                keyValueArray = keyValueStr.split('&');
                for (i = 0; i < keyValueArray.length; i += 1)
                {
                    singleKeyValueStr = keyValueArray[i];
                    eqIndex = singleKeyValueStr.indexOf('=');
                    if (eqIndex > -1)
                    {
                        key = singleKeyValueStr.substring(0, eqIndex);
                        value = singleKeyValueStr.substring(eqIndex + 1, singleKeyValueStr.length);
                        if (key)
                        {
                            thisContactInput.clientStoreIdHash[key] = value;
                        }
                    }
                }
            }
        };

        thisContactInput.autoPopulateFormHandler = function ()
        {
            thisContactInput.autoPopulateForm();
        };

        thisContactInput.autoPopulateForm = function ()
        {
            this.populateClientStoreIdHash();
            var clientStoreIdHash = this.clientStoreIdHash;
            var key = '';
            var value = '';
            for (key in clientStoreIdHash)
            {
                if (clientStoreIdHash.hasOwnProperty(key))
                {
                    value = clientStoreIdHash[key];
                    this.getById(key).val(value);
                }
            }
        };

        thisContactInput.addEvents = function ()
        {
            contactInput.addEvents.call(this);
            var i = 0;
            var keyArray = thisContactInput.keyArray;
            var key = null;
            for (i = 0; i < keyArray.length; i += 1)
            {
                key = keyArray[i];
                key.change(thisContactInput.autoPopulateFormHandler);
            }
            thisContactInput.countryInput.change(thisContactInput.updateState);
            thisContactInput.stateInput.change(thisContactInput.updateCountry);
            thisContactInput.imContact.click(thisContactInput.populateCurrentContactHandler);
            thisContactInput.logOutButton.click(thisContactInput.clearCurrentContactHandler);
        };

        thisContactInput.setVars = function ()
        {
            contactInput.setVars.call(this);
            var i = 0;
            var keyIdArray = thisContactInput.keyIdArray;
            var keyArray = thisContactInput.keyArray;
            var keyId = '';
            for (i = 0; i < keyIdArray.length; i += 1)
            {
                keyId = keyIdArray[i];
                keyArray[keyArray.length] = this.getById(keyId);
            }
            thisContactInput.countryInput = this.getById(thisContactInput.countryInputId);
            thisContactInput.stateInput = this.getById(thisContactInput.stateInputId);
            thisContactInput.imContact = this.getById(thisContactInput.imContactId);
            thisContactInput.logOutButton = this.getById('MemberLoginContactView_ButtonLogOut');

        };

        thisContactInput.init = function (paramObj)
        {
            this.setSettingsByObject(paramObj);
            this.setVars();
            this.addEvents();
        };
        return thisContactInput;
    };
    SKYSALES.Class.ContactInput.createObject = function (json)
    {
        SKYSALES.Util.createObject('contactInput', 'ContactInput', json);
    };
}

/*
    Name: 
        Class ToggleView
    Param:
        None
    Return: 
        An instance of ToggleView
    Functionality:
        The ToggleView class is used to show and hide dom elements.
    Notes:
        It is set up so that you can click different elements to show and hide the dom object.
        You can have a link that you click to show the element, and anothe that you click to hide it.
        showId is the id of the html element that you click to show the element
        hideId is the id of the html element that you click to hide the element
        elementId is the id of the element you are showing and hiding
    Class Hierarchy:
        SkySales -> ToggleView
*/
SKYSALES.Class.ToggleView = function ()
{
    var toggleView = new SKYSALES.Class.SkySales();
    var thisToggleView = SKYSALES.Util.extendObject(toggleView);
    
    thisToggleView.showId = '';
    thisToggleView.hideId = '';
    thisToggleView.elementId = '';
    
    thisToggleView.show = null;
    thisToggleView.hide = null;
    thisToggleView.element = null;
    
    thisToggleView.setVars = function ()
    {
        toggleView.setVars.call(this);
        thisToggleView.show = this.getById(this.showId);
        thisToggleView.hide = this.getById(this.hideId);
        thisToggleView.element = this.getById(this.elementId);
    };
    
    thisToggleView.init = function (paramObj)
    {
        this.setSettingsByObject(paramObj);
        this.setVars();
        this.addEvents();
    };
    
    thisToggleView.updateShowHandler = function ()
    {
        thisToggleView.updateShow();
    };
    
    thisToggleView.updateHideHandler = function ()
    {
        thisToggleView.updateHide();
    };

    thisToggleView.updateShow = function () 
    {
        // IE 8 does not show the HotelDescription when the slow parameter is passed
        this.element.show();
    };

    thisToggleView.updateHide = function ()
    {
        this.element.hide();
    };
    
    thisToggleView.addEvents = function ()
    {
        toggleView.addEvents.call(this);
        if (this.showId === this.hideId)
        {
			this.show.toggle_deprecated(this.updateShowHandler, this.updateHideHandler);
        }
        else
        {
            this.show.click(this.updateShowHandler);
            this.hide.click(this.updateHideHandler);
        }
    };
    return thisToggleView;
};


/*
    Name: 
        Class PaymentInput
    Param:
        None
    Return: 
        An instance of PaymentInput
    Functionality:
        This class represents a PaymentInput
    Notes:
    Class Hierarchy:
        SkySales -> PaymentInput
*/
if (!SKYSALES.Class.PaymentInput)
{
    SKYSALES.Class.PaymentInput = function ()
    {
        var parent = SKYSALES.Class.SkySales();
        var thisPaymentInput = SKYSALES.Util.extendObject(parent);
        
        thisPaymentInput.dccOfferInfoId = '';
        thisPaymentInput.foreignAmountId = '';
        thisPaymentInput.foreignCurrencyId = '';
        thisPaymentInput.foreignCurrencySymbolId = '';
        thisPaymentInput.ownCurrencyAmountId = '';
        thisPaymentInput.ownCurrencyId = '';
        thisPaymentInput.ownCurrencySymbolId = '';
        thisPaymentInput.rejectRadioBtnIdId = '';
        thisPaymentInput.acceptRadioBtnIdId = '';
        thisPaymentInput.doubleOptOutId = '';
        thisPaymentInput.inlineDCCAjaxSucceededId = '';
        thisPaymentInput.dccId = '';
        thisPaymentInput.inlineDCCConversionLabelId = '';
        thisPaymentInput.amountInputId = '';
        thisPaymentInput.accountNumberInputId = '';
        thisPaymentInput.inlineDCCOffer = null;
        thisPaymentInput.currencyCode = null;
        thisPaymentInput.feeAmt = null;

        thisPaymentInput.setSettingsByObject = function (json)
        {
            parent.setSettingsByObject.call(this, json);
        };

        thisPaymentInput.setVars = function ()
        {
            thisPaymentInput.dcc = this.getById(this.dccId);
            thisPaymentInput.inlineDCCConversionLabel = this.getById(this.inlineDCCConversionLabelId);
            thisPaymentInput.accountNoTextBox = this.getById(this.accountNumberInputId);
            thisPaymentInput.amountTextBox = this.getById(this.amountInputId);
            thisPaymentInput.inlineDCCAjaxSucceeded = this.getById(this.inlineDCCAjaxSucceededId);
        };

        thisPaymentInput.inlineDCCAjaxRequestHandler = function ()
        {
            thisPaymentInput.getInlineDCC();
        };

        thisPaymentInput.addEvents = function ()
        {
            this.amountTextBox.change(this.inlineDCCAjaxRequestHandler);
            this.accountNoTextBox.change(this.inlineDCCAjaxRequestHandler);
        };

        thisPaymentInput.init = function (json)
        {
            this.setSettingsByObject(json);
            this.setVars();
            this.addEvents();
        };

        thisPaymentInput.getInlineDCC = function (amount, acctNumber)
        {
            var params = {};
            if ('True' === this.inlineDCCOffer)
            {
                if (!acctNumber)
                {
                    //get the account number
                    acctNumber = this.accountNoTextBox.val();
                }
                if (!amount)
                {
                    //get the amount
                    amount = this.amountTextBox.val();
                }
                params = {  'amount': amount, 
                            'paymentFee': this.feeAmt,
                            'currencyCode': this.currencyCode, 
                            'accountNumber': acctNumber };
                if (this.currencyCode && amount && acctNumber && (0 < parseFloat(amount)) && (12 <= acctNumber.length)) 
                {
                    this.inlineDCCAjaxSucceeded.val('false');
                    $.get('DCCOfferAjax-Resource.aspx', params, this.inlineDCCResponseHandler);
                }
            }
        };

        thisPaymentInput.setVarsAfterAjaxResponse = function (jData)
        {
            var offerInfo = this.getById(this.dccOfferInfoId, jData);
            thisPaymentInput.foreignAmount = this.getById(this.foreignAmountId, offerInfo).text();
            thisPaymentInput.foreignCurrency = this.getById(this.foreignCurrencyId, offerInfo).text();
            thisPaymentInput.foreignCurrencySymbol = this.getById(this.foreignCurrencySymbolId, offerInfo).text();
            thisPaymentInput.ownCurrencyAmount = this.getById(this.ownCurrencyAmountId, offerInfo).text();
            thisPaymentInput.ownCurrency = this.getById(this.ownCurrencyId, offerInfo).text();
            thisPaymentInput.ownCurrencySymbol = this.getById(this.ownCurrencySymbolId, offerInfo).text();
            thisPaymentInput.acceptRadioBtnID = this.getById(this.acceptRadioBtnIdId, offerInfo).text();
            thisPaymentInput.rejectRadioBtnID = this.getById(this.rejectRadioBtnIdId, offerInfo).text();
            thisPaymentInput.acceptRadioBtn = this.getById(this.acceptRadioBtnID);
            thisPaymentInput.doubleOptOut = this.getById(this.doubleOptOutId, offerInfo).text();
            thisPaymentInput.radioButtonInlineDccStatusOfferAccept = this.getById(this.acceptRadioBtnID);
            thisPaymentInput.radioButtonInlineDccStatusOfferReject = this.getById(this.rejectRadioBtnID);
        };
        
        thisPaymentInput.foreignUpdateConversionLabel = function ()
        {
            this.inlineDCCConversionLabel.text('(' + ' ' + this.foreignAmount + ' ' + this.foreignCurrency + ')');
        };

        thisPaymentInput.ownUpdateConversionLabel = function ()
        {
            this.inlineDCCConversionLabel.text('');
        };
        
        thisPaymentInput.noThanks = function ()
        {
            this.getById('dccCont').show('slow');
        };

        thisPaymentInput.noShowThanks = function ()
        {
            this.getById('dccCont').hide('slow');
        };
        
        thisPaymentInput.inlineDccStatusOfferAccept = function ()
        {
            this.foreignUpdateConversionLabel();
            this.noShowThanks();
        };
        
        thisPaymentInput.inlineDccStatusOfferReject = function ()
        {
            this.ownUpdateConversionLabel();
            this.noThanks();
        };
        
        thisPaymentInput.inlineDccStatusOfferAcceptHandler = function ()
        {
            thisPaymentInput.inlineDccStatusOfferAccept();
        };
        
        thisPaymentInput.inlineDccStatusOfferRejectHandler = function ()
        {
            thisPaymentInput.inlineDccStatusOfferReject();
        };
        
        thisPaymentInput.addEventsAfterAjaxResponse = function ()
        {
            this.radioButtonInlineDccStatusOfferAccept.click(this.inlineDccStatusOfferAcceptHandler);
            this.radioButtonInlineDccStatusOfferReject.click(this.inlineDccStatusOfferRejectHandler);
        };

        thisPaymentInput.updateAcceptRadioBtn = function ()
        {
            var acceptChecked = this.acceptRadioBtn.attr('checked');
            if (acceptChecked)
            {
                this.foreignUpdateConversionLabel();
            }
        };

        thisPaymentInput.updateInlineDCCOffer = function (data)
        {
            this.inlineDCCAjaxSucceeded.val('true');
            var responseDCCElement = null;
            if (data) 
            {
                this.dcc.empty();
                var jData = $(data);
                responseDCCElement = this.getById(this.dccId, jData);
                if (responseDCCElement && responseDCCElement.length)
                {
                    this.dcc.prepend(responseDCCElement.children());
                }
                this.setVarsAfterAjaxResponse(jData);
                this.addEventsAfterAjaxResponse();
                this.updateAcceptRadioBtn();
            }
        };
        
        thisPaymentInput.inlineDCCResponseHandler = function (data)
        {
            thisPaymentInput.updateInlineDCCOffer(data);
        };
        return thisPaymentInput;
    };
    
    SKYSALES.Class.PaymentInput.createObject = function (json)
    {
        SKYSALES.Util.createObject('paymentInput', 'PaymentInput', json);
    };
}


/*
    Name: 
        Class PriceDisplay
    Param:
        None
    Return: 
        An instance of PriceDisplay
    Functionality:
        Handels the PriceDisplay control
    Notes:
        All functionality is inherited from the SkySales Class
    Class Hierarchy:
        SkySales -> PriceDisplay
*/
if (!SKYSALES.Class.PriceDisplay)
{
    SKYSALES.Class.PriceDisplay = function ()
    {   
        var parent = new SKYSALES.Class.SkySales();
        var thisPriceDisplay = SKYSALES.Util.extendObject(parent);
        
        thisPriceDisplay.toggleViewIdArray = null;
        
        thisPriceDisplay.init = function (json)
        {
            this.setSettingsByObject(json);
            
            var toggleViewIdArray = this.toggleViewIdArray || [];
            var i = 0;
            var toggleView = null;
            for (i = 0; i < toggleViewIdArray.length; i += 1)
            {
                toggleView = new SKYSALES.Class.ToggleView();
                toggleView.init(toggleViewIdArray[i]);
                thisPriceDisplay.toggleViewIdArray[i] = toggleView;
            }
        };
        return thisPriceDisplay;
    };
    SKYSALES.Class.PriceDisplay.createObject = function (json)
    {
        SKYSALES.Util.createObject('priceDisplay', 'PriceDisplay', json);
    };
}

/*
    Name: 
        Class FlightDisplay
    Param:
        None
    Return: 
        An instance of FlightDisplay
    Functionality:
        Handels the FlightDisplay control
    Notes:
        All functionality is inherited from the SkySales Class
    Class Hierarchy:
        SkySales -> FlightDisplay
*/
if (!SKYSALES.Class.FlightDisplay)
{
    SKYSALES.Class.FlightDisplay = function ()
    {   
        var parent = new SKYSALES.Class.SkySales();
        var thisFlightDisplay = SKYSALES.Util.extendObject(parent);
        
        thisFlightDisplay.toggleViewIdArray = null;
        
        thisFlightDisplay.init = function (json)
        {
            this.setSettingsByObject(json);
            
            var toggleViewIdArray = this.toggleViewIdArray || [];
            var i = 0;
            var toggleView = null;
            for (i = 0; i < toggleViewIdArray.length; i += 1)
            {
                toggleView = new SKYSALES.Class.ToggleView();
                toggleView.init(toggleViewIdArray[i]);
                thisFlightDisplay.toggleViewIdArray[i] = toggleView;
            }
        };
        return thisFlightDisplay;
    };
    SKYSALES.Class.FlightDisplay.createObject = function (json)
    {
        SKYSALES.Util.createObject('flightDisplay', 'FlightDisplay', json);
    };
}

/*
    Name: 
        Class RandomImage
    Param:
        None
    Return: 
        An instance of RandomImage
    Functionality:
        Handels the RandomImage on the search view
    Notes:
        This class can be used to display a random image,
        provided it has a list of uri that point to images,
        and a dom node to place the image.
    Class Hierarchy:
        SkySales -> RandomImage
*/
if (!SKYSALES.Class.RandomImage)
{
    SKYSALES.Class.RandomImage = function ()
    {   
        var parent = new SKYSALES.Class.SkySales();
        var thisRandomImage = SKYSALES.Util.extendObject(parent);
        
        thisRandomImage.imageUriArray = [];
        
        thisRandomImage.init = function (json)
        {
            this.setSettingsByObject(json);
            this.setVars();
            this.setAsBackground();
        };
        
        thisRandomImage.getRandomNumber = function ()
        {
            var randomNumberMax = this.imageUriArray.length;
            var randomNumber = Math.floor(Math.random() * randomNumberMax);
            return randomNumber;
        };
        
        thisRandomImage.setAsBackground = function ()
        {
            var randomNumber = this.getRandomNumber();
            var uri = 'url(' + this.imageUriArray[randomNumber] + ')';
            this.container.css('background-image', uri);
        };
        return thisRandomImage;
    };
    SKYSALES.Class.RandomImage.createObject = function (json)
    {
        SKYSALES.Util.createObject('randomImage', 'RandomImage', json);
    };
}

/*
    Name: 
        Class DropDown
    Param:
        None
    Return: 
        An instance of DropDown
    Functionality:
        The DropDown class is a combo box.
    Notes:
        Provided with an input box, and an array of objects that have a code and name property
        it will turn the text box into a combo box that attemps to help you auto complete what you are typing
        given the data provided.
        The way to turn an input box into a combo box is
        var selectParamObj = {
                    'input': $(inputBox),
                    'options': [ { "code": "", "name": name } ]
         };
         SKYSALES.Class.DropDown.getDropDown(selectParamObj);
    Class Hierarchy:
        DropDown
*/
SKYSALES.Class.DropDown = function (paramObject)
{
    paramObject = paramObject || {};
    var thisDrop = this;
    
    thisDrop.container = {};
    thisDrop.name = '';
    thisDrop.options = [];
    thisDrop.dropDownContainer = null;
    thisDrop.dropDownContainerInput = null;
    thisDrop.document = null;
    thisDrop.optionList = null;
    thisDrop.optionActiveClass = 'optionActive';
    thisDrop.timeOutObj = null;
    thisDrop.timeOut = 225;
    thisDrop.minCharLength = 2;
    thisDrop.optionMax = 100;
    thisDrop.html = '<div></div><div class="dropDownContainer"></div>';
    thisDrop.autoComplete = true;
    
    thisDrop.setSettingsByObject = function (jsonObject)
    {
        var prop = null;
        for (prop in jsonObject)
        {
            if (thisDrop.hasOwnProperty(prop))
            {
                thisDrop[prop] = jsonObject[prop];
            }
        }
    };
    
    thisDrop.getOptionHtml = function (search)
    {
        search = search || '';
        var option = {};
        var prop = '';
        var optionHtml = '';
        var optionCount = 0;
        var optionHash = thisDrop.options;
        var re = new RegExp('^' + search, 'i');
        if (search.length < thisDrop.minCharLength)
        {
            optionHtml = '';
        }
        else
        {
            for (prop in optionHash)
            {
                if (optionHash.hasOwnProperty(prop))
                {
                    option = optionHash[prop];
                    option.name = option.name || '';
                    option.code = option.code || '';
                    if (option.name.match(re) || option.code.match(re))
                    {
                        optionHtml += '<div><span>' + option.code + '</span>' + option.name + ' (' + option.code + ')' + '</div>';
                        optionCount += 1;
                    }
                    if (optionCount >= thisDrop.optionMax)
                    {
                        break;
                    }
                }
            }
        }
        return optionHtml;
    };
    
    thisDrop.close = function ()
    {
        if (thisDrop.timeOutObj)
        {
            window.clearTimeout(thisDrop.timeOutObj);
        }
        thisDrop.document.unbind('click', thisDrop.close);
        if (thisDrop.optionList)
        {
            thisDrop.optionList.unbind('hover');
            thisDrop.optionList.unbind('click');
        }
        thisDrop.optionList = null;
        thisDrop.dropDownContainer.html('');
    };
    
    
    thisDrop.getActiveOptionIndex = function ()
    {
        var activeOptionIndex = -1;
        var activeOption = $('.' + thisDrop.optionActiveClass, thisDrop.dropDownContainer);
        if (thisDrop.optionList && (activeOption.length > 0))
        {
            activeOptionIndex = thisDrop.optionList.index(activeOption[0]);
        }
        return activeOptionIndex;
    };
    
    thisDrop.arrowDown = function ()
    {
        var activeOptionIndex = thisDrop.getActiveOptionIndex();
        if (thisDrop.optionList)
        {
            if ((activeOptionIndex === -1) && (thisDrop.optionList.length > 0))
            {
                thisDrop.optionActive.call(thisDrop.optionList[0]);
            }
            else if (thisDrop.optionList.length > activeOptionIndex + 1)
            {
                thisDrop.optionInActive.call(thisDrop.optionList[activeOptionIndex]);
                thisDrop.optionActive.call(thisDrop.optionList[activeOptionIndex + 1]);
            }
            else
            {
                thisDrop.arrowDownOpen();
            }
        }
        else
        {
            thisDrop.arrowDownOpen();
        }
    };
    
    thisDrop.arrowDownOpen = function ()
    {
        var oldMinCharLength = thisDrop.minCharLength;
        thisDrop.minCharLength = 0;
        thisDrop.open();
        thisDrop.minCharLength = oldMinCharLength;
    };
    
    thisDrop.arrowUp = function ()
    {
        var activeOptionIndex = thisDrop.getActiveOptionIndex();
        if (thisDrop.optionList)
        {
            if ((activeOptionIndex === -1) && (thisDrop.optionList.length > 0))
            {
                thisDrop.optionActive.call(thisDrop.optionList[0]);
            }
            else if ((activeOptionIndex > 0) && (thisDrop.optionList.length > 0))
            {
                thisDrop.optionInActive.call(thisDrop.optionList[activeOptionIndex]);
                thisDrop.optionActive.call(thisDrop.optionList[activeOptionIndex - 1]);       
            }
        }
    };
    
    thisDrop.selectButton = function ()
    {
        var activeOptionIndex = thisDrop.getActiveOptionIndex();
        var oldOptionMax = thisDrop.optionMax;
        if (activeOptionIndex > -1)
        {
            thisDrop.selectOption.call(thisDrop.optionList[activeOptionIndex]);
        }
        else if (thisDrop.autoComplete === true)
        {
            thisDrop.optionMax = 1;
            thisDrop.open();
            if (thisDrop.optionList && (thisDrop.optionList.length > 0))
            {
                thisDrop.selectOption.call(thisDrop.optionList[0]);
            }
            thisDrop.optionMax = oldOptionMax;
        }
    };
    
    /*
        40: down arrow
        38: up arrow
        32: space
        9: tab
        13: enter
    */
    
    thisDrop.keyEvent = function (key)
    {
        var retVal = true;
        var keyNum = key.which;
        if (keyNum === 40)
        {
            thisDrop.arrowDown();
            thisDrop.autoComplete = true;
            retVal = false;
        }
        else if (keyNum === 38)
        {
            thisDrop.arrowUp();
            thisDrop.autoComplete = true;
            retVal = false;
        }
        else if (keyNum === 9)
        {
            thisDrop.selectButton();
            thisDrop.inputBlur();
        }
        else if (keyNum === 13)
        {
            thisDrop.selectButton();
            thisDrop.autoComplete = false;
            retVal = false;
        }
        else
        {
            thisDrop.autoComplete = true;
        }
        return retVal;
    };
    
    thisDrop.inputKeyEvent = function (key)
    {
        var retVal = true;
        var keyNum = key.which;
        if ((keyNum !== 40) && (keyNum !== 38) && (keyNum !== 9) && (keyNum !== 13))
        {
            if (thisDrop.timeOutObj)
            {
                window.clearTimeout(thisDrop.timeOutObj);
            }
            thisDrop.timeOutObj = window.setTimeout(thisDrop.open, thisDrop.timeOut);
            retVal = false;
        }
        return retVal;
    };
    
    thisDrop.catchEvent = function ()
    {
        return false;
    };
    
    thisDrop.open = function ()
    {
        var iframeHtml = '';
        var iframe = null;
        var search = thisDrop.dropDownContainerInput.val();
        var optionHtml = thisDrop.getOptionHtml(search);
        var height = 0;
        var containerWidth = 0;
        thisDrop.dropDownContainer.html(optionHtml);
        thisDrop.addOptionEvents();
        thisDrop.dropDownContainer.click(thisDrop.catchEvent);
        thisDrop.document.click(thisDrop.close);
        
        thisDrop.dropDownContainer.show();
        if (thisDrop.optionList && (thisDrop.optionList.length > 0) && thisDrop.optionActive)
        {
            thisDrop.optionActive.call(thisDrop.optionList[0]);
        }
        containerWidth = thisDrop.dropDownContainer.width();
        
        if ($.browser.msie)
        {
            height = thisDrop.dropDownContainer.height();
            iframeHtml = '<iframe src="#"></iframe>';
            thisDrop.dropDownContainer.prepend(iframeHtml);
            iframe = $('iframe', thisDrop.dropDownContainer);
            iframe.width(containerWidth);
            iframe.height(height);
        }
    };
    
    thisDrop.optionActive = function ()
    {
        var option = $(this);
        thisDrop.optionList.removeClass(thisDrop.optionActiveClass);
        option.addClass(thisDrop.optionActiveClass);
    };
    
    thisDrop.optionInActive = function ()
    {
        var option = $(this);
        option.removeClass(thisDrop.optionActiveClass);
    };
    
    thisDrop.selectOption = function ()
    {
        var text = $('span', this).text();
        thisDrop.dropDownContainerInput.val(text);
        thisDrop.close();
        thisDrop.dropDownContainerInput.change();
    };
    
    thisDrop.addOptionEvents = function ()
    {
        thisDrop.optionList = $('div', thisDrop.dropDownContainer);
        thisDrop.optionList.hover(thisDrop.optionActive, thisDrop.optionInActive);
        thisDrop.optionList.click(thisDrop.selectOption);
    };
    
    thisDrop.inputBlur = function ()
    {
        thisDrop.close();
    };
    
    thisDrop.addEvents = function (paramObject)
    {
        thisDrop.dropDownContainerInput = paramObject.input;
        thisDrop.dropDownContainer = $('div.dropDownContainer', thisDrop.container);
        thisDrop.document = $(document);
        thisDrop.dropDownContainerInput.keyup(thisDrop.inputKeyEvent);
        thisDrop.dropDownContainerInput.keydown(thisDrop.keyEvent);
    };
    
    thisDrop.init = function (paramObject)
    {
        thisDrop.setSettingsByObject(paramObject);
        var html = thisDrop.html;
        paramObject.input.attr('autocomplete', 'off');
        paramObject.input.wrap('<span class="dropDownOuterContainer"></span>');
        paramObject.input.after(html);
        thisDrop.container = paramObject.input.parent('span.dropDownOuterContainer');
        thisDrop.addEvents(paramObject);
        SKYSALES.Class.DropDown.dropDownArray[SKYSALES.Class.DropDown.dropDownArray.length] = thisDrop;
    };
    thisDrop.init(paramObject);
    return thisDrop;
};

SKYSALES.Class.DropDown.dropDownArray = [];

SKYSALES.Class.DropDown.getDropDown = function (selectParamObj)
{
    var retVal = null;
    var i = 0;
    var dropDown = null;
    var dropDownArray = SKYSALES.Class.DropDown.dropDownArray;
    var input = null;
    var inputCompare = selectParamObj.input.get(0);
    for (i = 0; i < dropDownArray.length; i += 1)
    {
        dropDown = dropDownArray[i];
        input = dropDown.dropDownContainerInput.get(0);
        if ((input) && (inputCompare) && (input === inputCompare))
        {
            retVal = dropDownArray[i];
            if (selectParamObj.options)
            {
                retVal.options = selectParamObj.options;
            }
        }
    }
    if (!retVal)
    {
        retVal = new SKYSALES.Class.DropDown(selectParamObj);
    }
    return retVal;
};

if (!SKYSALES.Class.DatePickerManager)
{
    SKYSALES.Class.DatePickerManager = function () 
    {
        var thisDatePickerManager = this;
        thisDatePickerManager.isAOS = false;
        thisDatePickerManager.yearMonth = null;
        thisDatePickerManager.day = null;
        thisDatePickerManager.linkedDate = null;

        var allDayOptionArray = [];
        var yearMonthDelimiter = '-';
        var yearMonthFormatString = 'yy-mm';
        var firstDateOption = 'first';
        var fullDateFormatString = 'mm/dd/yy';

        var validateYearMonthRegExp = new RegExp('\\d{4}-\\d{2}');

        // Accepts a date object to return the number of days in the month
        var getDaysInMonth = function (dateParam) 
        {
            var daysNotInMonthDate = new Date(dateParam.getFullYear(), dateParam.getMonth(), 32);
            var daysNotInMonth = daysNotInMonthDate.getDate();
            return 32 - daysNotInMonth;
        };

        // Checks if the day is in the correct format (2 digit numeric)
        var validateDay = function (dayParam) 
        {
            return dayParam.match(/\d{2}/);
        };

        // Checks if the year-month is in the correct format
        var validateYearMonth = function (yearMonthParam) 
        {
            yearMonthParam = yearMonthParam || '';
            return yearMonthParam.match(validateYearMonthRegExp);
        };

        var getDate = function (yearMonthParam, dayParam) 
        {
            var retDate = new Date();
            var yearMonthArray = yearMonthParam.split(yearMonthDelimiter);
            var yearIndex = 0;
            var monthIndex = 1;
            if (true === thisDatePickerManager.isAOS) 
            {
                yearIndex = 1;
                monthIndex = 0;
            }
            var yearVal = yearMonthArray[yearIndex];
            var monthVal = yearMonthArray[monthIndex] - 1;
            retDate = new Date(yearVal, monthVal, dayParam);
            return retDate;
        };

        // Accepts a year-month and day parameters and returns it as a date object.
        var parseDate = function (yearMonthParam, dayParam) 
        {
            var retDate = new Date();
            var validateDayVal = validateDay(dayParam);
            var validateYearMonthVal = validateYearMonth(yearMonthParam);

            if (validateDayVal && validateYearMonthVal) 
            {
                var date = getDate(yearMonthParam, dayParam);
                var daysInMonth = getDaysInMonth(date);

                var dayVal = dayParam;
                if (dayParam > daysInMonth) 
                {
                    dayVal = daysInMonth;
                }
                retDate = new Date(date.getFullYear(), date.getMonth(), dayVal);
            }
            else 
            {
                retDate = new Date();
            }
            return retDate;
        };

        // Update the selected value of the datepicker to be the same as the value of the dropdown fields when clicked. 
        var readLinked = function () 
        {
            var date = parseDate(thisDatePickerManager.yearMonth.val(), thisDatePickerManager.day.val());
            var dateString = $.datepicker.formatDate(fullDateFormatString, date);
            thisDatePickerManager.linkedDate.val(dateString);
            return {};
        };

        var dayResizeAndSet = function (dateParam) 
        {
            var todayDate = new Date();
            var todayDay = todayDate.getDate();
            var todayYearMonth = todayDate.getYear() + todayDate.getMonth();
            var dateParamYearMonth = dateParam.getYear() + dateParam.getMonth();
            var monthYearIsCurrent = (todayYearMonth === dateParamYearMonth);
            var todayIsPastSecond = (2 < todayDay);
            var trimInvalidDays = todayIsPastSecond && monthYearIsCurrent;
            var day = dateParam.getDate();
            var daysInMonth = getDaysInMonth(dateParam);
            var daysInMonthDifference = 31 - daysInMonth;
            var dayOptionArray = SKYSALES.Util.cloneArray(allDayOptionArray);
            var removeDaysAfterThisIndex = 31;
            if (daysInMonthDifference > 0) 
            {
                removeDaysAfterThisIndex = 31 - daysInMonthDifference;
                dayOptionArray.splice(removeDaysAfterThisIndex, daysInMonthDifference);
            }
            if (trimInvalidDays) 
            {
                dayOptionArray.splice(0, todayDay - 2);
            }
            var daySelectParams = 
            {
                'selectedItem': day,
                'objectArray': dayOptionArray,
                'selectBox': thisDatePickerManager.day,
                'clearOptions': true
            };
            SKYSALES.Util.populateSelect(daySelectParams);
        };

        // Ensures that the datepicker and the date fields are in sync when an update was done to the year
        var yearMonthUpdate = function () 
        {
            var dayVal = thisDatePickerManager.day.val();
            var date = getDate(thisDatePickerManager.yearMonth.val(), 1);
            var daysInMonth = getDaysInMonth(date);
            if (dayVal > daysInMonth) 
            {
                dayVal = daysInMonth;
            }
            date = new Date(date.getFullYear(), date.getMonth(), dayVal);
            dayResizeAndSet(date);
            thisDatePickerManager.linkedDate.val($.datepicker.formatDate(fullDateFormatString, date));
        };

        // Ensures that the datepicker and the date fields are in sync when an update was done to the day
        var dateUpdate = function () 
        {
            var yearMonthVal = thisDatePickerManager.yearMonth.val();
            var dayVal = thisDatePickerManager.day.val();
            var date = parseDate(yearMonthVal, dayVal);
            var dateVal = $.datepicker.formatDate(fullDateFormatString, date);
            thisDatePickerManager.linkedDate.val(dateVal);
        };

        // Create an array of day objects.
        var createAllDayOptionArray = function () 
        {
            var retArray = [];
            var optionIterator = 1;
            var option = {};
            for (optionIterator = 1; optionIterator <= 31; optionIterator += 1) 
            {
                option = {};
                option.name = optionIterator;
                if (optionIterator <= 9) 
                {
                    option.code = '0' + optionIterator;
                }
                else 
                {
                    option.code = optionIterator;
                }
                retArray[optionIterator - 1] = option;
            }
            return retArray;
        };

        // Update select controls to match the date picker selection
        var updateLinked = function (dateString) 
        {
            var match = dateString.match(/\d{2}\/\d{2}\/\d{4}/);
            var date = new Date();
            var yearMonthString = '';
            if (match) 
            {
                date = new Date(dateString);
                yearMonthString = $.datepicker.formatDate(yearMonthFormatString, date);
                thisDatePickerManager.yearMonth.val(yearMonthString);
                dayResizeAndSet(date);
            }
        };

        thisDatePickerManager.setSettingsByObject = function (paramObject) 
        {
            var propName = '';
            for (propName in paramObject) 
            {
                if (thisDatePickerManager.hasOwnProperty(propName)) 
                {
                    thisDatePickerManager[propName] = paramObject[propName];
                }
            }
        };

        thisDatePickerManager.setVars = function () 
        {
            if (true === thisDatePickerManager.isAOS) 
            {
                yearMonthDelimiter = '/';
                yearMonthFormatString = 'm/yy';
                validateYearMonthRegExp = new RegExp('\\d{1,2}\\/\\d{4}');
                firstDateOption = 'eq(1)';
            }
        };

        var initFlight = function () 
        {
            if (!thisDatePickerManager.isAOS) 
            {
                dateUpdate();
            }
        };

        thisDatePickerManager.addEvents = function () 
        {
            thisDatePickerManager.yearMonth.change(yearMonthUpdate);
            thisDatePickerManager.day.change(dateUpdate);

            var minDate = new Date();
            var maxDate = new Date();
            var setDayDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() + 1);

            // Get the first and last option in the year-month select
            var yearMonthFirst = $('option:' + firstDateOption, thisDatePickerManager.yearMonth).val();
            var yearMonthLast = $('option:last', thisDatePickerManager.yearMonth).val();
            
            // Create an array of day objects
            allDayOptionArray = createAllDayOptionArray();

            // Get the input where the datepicker is to be linked
            var linkedDate = thisDatePickerManager.linkedDate;

            if (validateYearMonth(yearMonthFirst)) 
            {
                minDate.setDate(minDate.getDate() - 1);
                // Get the default selected date
                if (thisDatePickerManager.isAOS) 
                {
                    setDayDate = new Date(thisDatePickerManager.linkedDate.val());
                }
                else 
                {
                    setDayDate = getDate(thisDatePickerManager.yearMonth.val(), thisDatePickerManager.day.val());
                }
                dayResizeAndSet(setDayDate);
            }

            if (validateYearMonth(yearMonthLast)) 
            {
                maxDate = getDate(yearMonthLast, 1);
                var daysInMonth = getDaysInMonth(maxDate);
                maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), daysInMonth);
            }

            var resource = SKYSALES.Util.getResource();
            var dateCultureInfo = resource.dateCultureInfo;
            var datePickerSettings = SKYSALES.datepicker;

            initFlight();

            var datePickerParams = 
            {
                'beforeShow': readLinked,
                'onSelect': updateLinked,
                'minDate': minDate,
                'maxDate': maxDate,
                'showOn': 'both',
                'buttonImageOnly': true,
                'buttonImage': 'images/Base/calendar-up.gif',
                'buttonText': 'Calendar',
                'numberOfMonths': 1,
                'mandatory': true,
                'monthNames': dateCultureInfo.monthNames,
                'monthNamesShort': dateCultureInfo.monthNamesShort,
                'dayNames': dateCultureInfo.dayNames,
                'dayNamesShort': dateCultureInfo.dayNamesShort,
                'dayNamesMin': dateCultureInfo.dayNamesMin,
                'closeText': datePickerSettings.closeText,
                'prevText': datePickerSettings.prevText,
                'nextText': datePickerSettings.nextText,
                'currentText': datePickerSettings.currentText
            };
            
            // Attach the input to the datepicker
            linkedDate.datepicker(datePickerParams);
        };

        thisDatePickerManager.init = function (paramObject) 
        {
            this.setSettingsByObject(paramObject);
            this.setVars();
            this.addEvents();
        };
    };
}
//Code to deal with the old way of getting the form on the page
SKYSALES.initializeSkySalesForm = function ()
{
    document.SkySales = document.forms.SkySales;
};

//Returns the skysales html form
SKYSALES.getSkySalesForm = function ()
{
    var skySalesForm = $('SkySales').get(0);
    return skySalesForm;
};

/*
    Name: 
        Class Common
    Param:
        None
    Return: 
        An instance of Common
    Functionality:
        Provide common functionality and events on every view.
    Notes:
        This should be put in the SKYSALES.Class namespace.
    Class Hierarchy:
        Common
*/
SKYSALES.Common = function ()
{
    var thisCommon = this;
    var countryInfo = null;
    
    thisCommon.allInputObjects = null;
    
    thisCommon.initializeCommon = function ()
    {
        var hint = new SKYSALES.Hint();
        var inputLabel = new SKYSALES.InputLabel();
        thisCommon.addKeyDownEvents();
        thisCommon.addSetAndEraseEvents();
        thisCommon.setValues();
        hint.addHintEvents();
        inputLabel.formatInputLabel();
        thisCommon.stripeTables();
    };
    
    thisCommon.setValues = function ()
    {
        var setValue = function (index)
        {
            if ((this.jsvalue !== null) && (this.jsvalue !== undefined))
            {
                this.value = this.jsvalue;
            }
        };
        thisCommon.getAllInputObjects().each(setValue);
    };
    
    thisCommon.stopSubmit = function ()
    {
        // Remove the submit event so that you can click the submit button
        $('form').unbind('submit', thisCommon.stopSubmit);
        return false;
    };
    
    thisCommon.addKeyDownEvents = function ()
    {
        var keyFunction = function (e)
        {
            if (e.keyCode === 13)
            {
                // Stop the enter key in opera
                $('form').submit(thisCommon.stopSubmit);
                return false;
            }
            return true;
        };
        //use get all inputs cache instead of requerying inputs
        thisCommon.getAllInputObjects().keydown(keyFunction);
    };
    
    thisCommon.getAllInputObjects = function ()
    {
        if (thisCommon.allInputObjects === null)
        {
            thisCommon.allInputObjects = $(':input');
        }
        return thisCommon.allInputObjects;
    };
    
    thisCommon.addSetAndEraseEvents = function ()
    {
        var focusFunction = function ()
        {
            thisCommon.eraseElement(this, this.requiredempty);
        };
        var blurFunction = function ()
        {
            thisCommon.setElement(this, this.requiredempty);
            $(this).change();
        };
        var eventFunction = function (index)
        {   
            var input = $(this);
            if ((this.requiredempty !== null) && (this.requiredempty !== undefined))
            {
                //hack prevent focus on hidden elements in IE (which will throw an exception)
                if (input.is(':text') && (input.is(':hidden') === false))
                {
                    input.focus(focusFunction);
                    input.blur(blurFunction);
                }
            }
        };
        thisCommon.getAllInputObjects().each(eventFunction);
    };
    
    thisCommon.eraseElement = function (element, defaultValue)
    {
        if (element.value === defaultValue)
        {
            element.value = "";
        }
    };
    
    thisCommon.setElement = function (element, defaultValue)
    {
        if (element.value === "")
        {
            element.value = defaultValue;
        }
    };
    
    thisCommon.getCountryInfo = function ()
    {
        if (countryInfo === null)
        {
            countryInfo = window.countryInfo;
        }
        return countryInfo;
    };
    thisCommon.setCountryInfo = function (arg)
    {
        countryInfo = arg;
        return thisCommon;
    };
    
    thisCommon.isEmpty = function (element, defaultValue)
    {
        var val = null;
        var retVal = false;
        
        if ((element) && (defaultValue === undefined))
        {
            if (element.requiredempty)
            {
                defaultValue = element.requiredempty;
            }
            else
            {
                defaultValue = '';
            }
        }
        
        val = SKYSALES.Common.getValue(element);
        if ((val === null) || (val === undefined) || (val.length === 0) || (val === defaultValue))
        {
            retVal = true;
        }
        return retVal;
    };
    
    thisCommon.stripeTables = function ()
    {
        $(".stripeMe tr:even").addClass("alt");
        return thisCommon;
    };
};

//Adds an event to the dom, and sets a function handler
SKYSALES.Common.addEvent = function (obj, eventString, functionRef)
{
    $(obj).bind(eventString, functionRef);
};

//Returns the value of an html form element
SKYSALES.Common.getValue = function (e)
{
    var val = null;
    if (e)
    {
        val = $(e).val();
        return val;
    }
    return null;
};

/*
    Name: 
        Class InputLabel
    Param:
        None
    Return: 
        An instance of InputLabel
    Functionality:
        Adds the * to required fields, and : to the end of labels for input boxes
    Notes:
        This should be put in the SKYSALES.Class namespace.
    Class Hierarchy:
        InputLabel
*/
SKYSALES.InputLabel = function () {
    var thisInputLabel = this;
    thisInputLabel.getInputLabelRequiredFlag = function () {
        return '*';
    };

    thisInputLabel.getInputLabelSuffix = function () {
        return '';
    };

    thisInputLabel.formatInputLabel = function () {
        return;
        var requiredFlag = thisInputLabel.getInputLabelRequiredFlag();
        var suffix = thisInputLabel.getInputLabelSuffix();
        var eventFunction = function (index) {
            
            if ('' !== this.id) {
                var label = $("label[for=" + this.id + "]").eq(0);
                var labelText = $(label).text();
                var inputType = '';
                var required = null;
                if (labelText !== '') {
                    inputType = $(this).attr("type");
                    if ((inputType !== 'checkbox') && (inputType !== 'radio')) {
                        labelText = labelText + suffix;
                    }
                    //safari support for some reason saffari this.required was always true
                    //var attrReq = $(this).attr('required');
                    // if (attrReq == '') {
                    //     this.required = false;
                    // }
                    required = this.required;
                    if (required === undefined) {
                        required = null;
                    }
                    if (required === null || required == '') {
                        required = this.getAttribute('required');
                    }
                    if (required !== null) {
                        required = required.toString().toLowerCase();
                        if (required === 'true') {
                        //gps hack to not display input label with $ in them required/ on modify itinerary
                            if (labelText.indexOf("$") !== 0) {
                                labelText = requiredFlag + labelText;
                            }
                        }
                    }
                    $(label).text(labelText);
                }
            }
        };
        SKYSALES.common.getAllInputObjects().each(eventFunction);
    };
};

/*
    Name: 
        Class Dhtml
    Param:
        None
    Return: 
        An instance of Dhtml
    Functionality:
        Provides methods that return the x and y position of an element on the dom
    Notes:
        This should be put in the SKYSALES.Class namespace.
    Class Hierarchy:
        Dhtml
*/
SKYSALES.Dhtml = function ()
{
    var thisDhtml = this;
    thisDhtml.getX = function (obj)
    {
        var pos = 0;
        try{
        if (obj.x)
        {
            pos += obj.x;
        }
        else if (obj.offsetParent)
        {
            while (obj.offsetParent)
            {
                pos += obj.offsetLeft;
                obj = obj.offsetParent;
            }
        }
        } catch (errs ) {

        }
        return pos;
    };
    
    thisDhtml.getY = function (obj)
    {
        var pos = 0;
        if (obj.y)
        {
            pos += obj.y;
        }
        else if (obj)
        {
            while (obj)
            {       
                pos += obj.offsetTop;
                try {
                obj = obj.offsetParent;
                } catch (errs) {
                obj=null;
                }
            }
        }
        return pos;
    };
    return thisDhtml;
};

/*
    Name: 
        Class Hint
    Param:
        None
    Return: 
        An instance of Hint
    Functionality:
        A hint is shown as a helpful tip to the user about a html form field.
        Such as showing the user what the valid characters are for their password, 
        when they are registering as a new user
    Notes:
        This should be put in the SKYSALES.Class namespace.
    Class Hierarchy:
        Hint
*/
SKYSALES.Hint = function ()
{
    var parent = new SKYSALES.Class.SkySales();
    var thisHint = SKYSALES.Util.extendObject(parent);
    thisHint.addHintEvents = function ()
    {
        var eventFunction = function (index)
        {
            if ((this.hint !== null) && (this.hint !== undefined))
            {
                if (this.tagName && (this.tagName.toString().toLowerCase() === 'input'))
                {
                    thisHint.addHintFocusEvents(this);
                }
                else
                {
                    thisHint.addHintHoverEvents(this);
                }
            }
        };
        SKYSALES.common.getAllInputObjects().each(eventFunction);
    };

    thisHint.addHintFocusEvents = function (obj, hintText)
    {
        var focusFunction = function ()
        {
            thisHint.showHint(obj, hintText);
        };
        var blurFunction = function ()
        {
            thisHint.hideHint(obj, hintText);
        };
        if ($(obj).is(':hidden') === false)
        {
            $(obj).focus(focusFunction);
            $(obj).blur(blurFunction);
        }
    };

    thisHint.addHintHoverEvents = function (obj, hintText)
    {
        var showFunction = function ()
        {
            thisHint.showHint(obj, hintText);
        };
        var hideFunction = function ()
        {
            thisHint.hideHint(obj, hintText);
        };
        $(obj).hover(showFunction, hideFunction);
    };

    thisHint.getHintDivId = function ()
    {
        return "cssHint";
    };

    thisHint.showHint = function (obj, hintHtml, xOffset, yOffset, referenceId)
    {
        var hintDivId = thisHint.getHintDivId();
        var jQueryHintDiv = this.getById(hintDivId);
        var x = 0;
        var y = 0;
        var defaultXOffset = 0;
        var defaultYOffset = 0;
        
        if (xOffset === undefined)
        {
            xOffset = obj.hintxoffset;
        }
        if (yOffset === undefined)
        {
            yOffset = obj.hintyoffset;
        }
        
        if (referenceId === undefined)
        {
            referenceId = obj.hintReferenceid;
        }
        var referenceObject = this.getById(referenceId).get(0);
        
        var dhtml = new SKYSALES.Dhtml();
        if (!referenceObject)
        {
            x = dhtml.getX(obj);
            y = dhtml.getY(obj);
            if (xOffset === undefined)
            {
                x += obj.offsetWidth + 5;
            }
        }
        else
        {
            x = dhtml.getX(referenceObject);
            y = dhtml.getY(referenceObject);
            if (xOffset === undefined)
            {
                x += referenceObject.offsetWidth + 5;
            }
        }
        
        if (hintHtml === undefined)
        {
            if (obj.hint !== undefined)
            {
                hintHtml = obj.hint;
            }
        }
        jQueryHintDiv.html(hintHtml);
        jQueryHintDiv.show();
        xOffset    = (xOffset !== undefined) ? xOffset : defaultXOffset;
        yOffset    = (yOffset !== undefined) ? yOffset : defaultYOffset;
        var leftX = parseInt(xOffset, 10) + parseInt(x, 10);
        var leftY = parseInt(yOffset, 10) + parseInt(y, 10);
        jQueryHintDiv.css('left', leftX + 'px');
        jQueryHintDiv.css('top', leftY + 'px');
    };

    thisHint.hideHint = function (obj)
    {
        var hintDivId = thisHint.getHintDivId();
        this.getById(hintDivId).hide();
    };
    
    return thisHint;
};

/*
    Name: 
        Class ValidationErrorReadAlong
    Param:
        None
    Return: 
        An instance of ValidationErrorReadAlong
    Functionality:
        To provide a way of showing the user validation error messages so that they can fix them in a user friendly way 
    Notes:
        This should be put in the SKYSALES.Class namespace.
    Class Hierarchy:
        ValidationErrorReadAlong
*/
SKYSALES.ValidationErrorReadAlong = function ()
{
    var parent = new SKYSALES.Class.SkySales();
    var thisReadAlong = SKYSALES.Util.extendObject(parent);

    thisReadAlong.objId = '';
    thisReadAlong.obj = null;
    thisReadAlong.errorMessage = '';
    thisReadAlong.isError = false;
    thisReadAlong.hasBeenFixed = false;
    thisReadAlong.hasValidationEvents = false;
    
    thisReadAlong.getValidationErrorHtml = function ()
    {
        var validatonErrorHtml = '<iframe id="validationErrorContainerReadAlongIFrame" class="hidden" ><\/iframe> <div id="validationErrorContainerReadAlong" > <p class="close"> <input id="validationErrorContainerReadAlongCloseButton" type="button" class="closeBtn" value="Close" \/> <\/p> <div id="validationErrorContainerReadAlongContent" > <h3 class="error">ERROR<\/h3> <div id="validationErrorContainerReadAlongList" > <\/div> <\/div> <\/div>';
        return validatonErrorHtml;
    };
    thisReadAlong.getValidationErrorCloseId = function ()
    {
        return 'validationErrorContainerReadAlongCloseButton';
    };
    thisReadAlong.getValidationErrorListId = function ()
    {
        return 'validationErrorContainerReadAlongList';
    };
    thisReadAlong.getValidationErrorIFrameId = function ()
    {
        return 'validationErrorContainerReadAlongIFrame';
    };
    thisReadAlong.getValidationErrorDivId = function ()
    {
        return 'validationErrorContainerReadAlong';
    };
    thisReadAlong.getFixedClass = function ()
    {
        return 'fixedValidationError';
    };
    thisReadAlong.addCloseEvent = function ()
    {
        var closeId = thisReadAlong.getValidationErrorCloseId();
        var closeFunction = function ()
        {
            thisReadAlong.hide();
        };
        this.getById(closeId).click(closeFunction);  
    };
    thisReadAlong.addValidationErrorDiv = function ()
    {
        this.getById('mainContent').append(thisReadAlong.getValidationErrorHtml());
    };
    thisReadAlong.hide = function ()
    {
        var iFrameId = thisReadAlong.getValidationErrorIFrameId();
        var divId =  thisReadAlong.getValidationErrorDivId();
        this.getById(iFrameId).hide();
        this.getById(divId).hide();
    };
    thisReadAlong.addFocusEvent = function (index)
    {
        var data = {obj: this};
        var eventFunction = function (event)
        {
            var obj = event.data.obj;
            var hint = null;
            var readAlongDivObj = null;
            var readAlongDivWidth = 0;
            var readAlongDivHeight = 0;
            var x = 0;
            var y = 0;
            var dhtml = null;
            var iFrameObj = null;
            if (obj.isError === true)
            {
                hint = new SKYSALES.Hint();
                hint.hideHint();
                readAlongDivObj = thisReadAlong.getById(thisReadAlong.getValidationErrorDivId());
                readAlongDivWidth = parseInt(readAlongDivObj.width(), 10) + 5;
                readAlongDivHeight = parseInt(readAlongDivObj.height(), 10) + 5;
                dhtml = new SKYSALES.Dhtml();
                x = dhtml.getX(obj.obj);
                y = dhtml.getY(obj.obj);
                x = x + this.offsetWidth + 5;
                y = y - 72;
                /* Start IE 6 Hack */
                if ($.browser.msie)
                {
                    iFrameObj = thisReadAlong.getById(thisReadAlong.getValidationErrorIFrameId());
                    iFrameObj.css('position', 'absolute');
                    iFrameObj.show();
                    iFrameObj.width(readAlongDivWidth - 25);
                    iFrameObj.height(readAlongDivHeight - 5);
                    iFrameObj.css('left', x + 16);
                    iFrameObj.css('top', y);
                }
                /* End IE 6 Hack */
                readAlongDivObj.css('left', x);
                readAlongDivObj.css('top', y);
                readAlongDivObj.css('position', 'absolute');
                readAlongDivObj.show('slow');
                return false;
            }
        };
        
        if ($(this.obj).is(':hidden') === false)
        {
            $(this.obj).bind("focus", data, eventFunction);
        }
    };
    
    thisReadAlong.addBlurEvent = function (index)
    {
        var data = {obj: this};
        var eventFunction = function (event)
        {
            var obj = event.data.obj;
            var validateObj = new SKYSALES.Validate(null, '', '', null);
            validateObj.validateSingleElement(this);
            var errorMessage = validateObj.errors;
            var isFixed = false;
            var allFixed = true;
            if (validateObj.validationErrorArray.length > 0)
            {
                if (validateObj.validationErrorArray[0].isError === false)
                {
                    isFixed = true;
                }
            }
            var listId = obj.getValidationErrorListId();
            var listObj = thisReadAlong.getById(listId).find('li').eq(index);
            var fixedClass = obj.getFixedClass();
            var fixedFunction = function ()
            {
                if (
                        (allFixed === true) && 
                        ($(this).attr("class").indexOf('hidden') === -1) && 
                        ($(this).attr("class").indexOf(fixedClass) === -1)
                        )
                {
                    allFixed = false;
                }
            };
            if (isFixed === true)
            {
                obj.hasBeenFixed = true;
                listObj.addClass(fixedClass);
                allFixed = true;
                thisReadAlong.getById(listId).find('li').each(fixedFunction);
                if (allFixed === true)
                {
                    thisReadAlong.hide();
                }
            }
            else
            {
                obj.hasBeenFixed = false;
                listObj.removeClass(fixedClass);
                listObj.removeClass('hidden');
                obj.isError = true;
                obj.errorMessage = errorMessage;
                listObj.text(errorMessage);
            }
            return false;
        };
        $(this.obj).bind("blur", data, eventFunction);
    };
    return thisReadAlong;
};

SKYSALES.errorsHeader = 'Please correct the following.\n\n';

/*
    Name: 
        Class Validate
    Param:
        None
    Return: 
        An instance of Validate
    Functionality:
        Provides a way of validating html form elements before they are submitted to the server
    Notes:
        This should be put in the SKYSALES.Class namespace.
    Class Hierarchy:
        Validate
*/
SKYSALES.Validate = function (form, controlID, errorsHeader, regexElementIdFilter) {
    var parent = new SKYSALES.Class.SkySales();
    var thisValidate = SKYSALES.Util.extendObject(parent);
    if (errorsHeader === undefined) {
        errorsHeader = SKYSALES.errorsHeader;
    }
    // set up properties
    thisValidate.form = form;
    thisValidate.namespace = controlID;
    thisValidate.errors = '';
    thisValidate.validationErrorArray = [];
    thisValidate.setfocus = null;
    thisValidate.clickedObj = null;
    thisValidate.errorDisplayMethod = 'read_along';
    thisValidate.errorsHeader = errorsHeader;
    thisValidate.namedErrors = [];

    //array of date strings
    thisValidate.dateRangeArray = [];

    if (regexElementIdFilter) {
        thisValidate.regexElementIdFilter = regexElementIdFilter;
    }
    // set up attributes
    thisValidate.requiredAttribute = 'required';
    thisValidate.requiredEmptyAttribute = 'requiredempty';
    thisValidate.validationTypeAttribute = 'validationtype';
    thisValidate.regexAttribute = 'regex';
    thisValidate.minLengthAttribute = 'minlength';
    thisValidate.numericMinLengthAttribute = 'numericminlength';
    thisValidate.maxLengthAttribute = 'maxlength';
    thisValidate.numericMaxLengthAttribute = 'numericmaxlength';
    thisValidate.minValueAttribute = 'minvalue';
    thisValidate.maxValueAttribute = 'maxvalue';
    thisValidate.equalsAttribute = 'equals';
    thisValidate.dateRangeAttribute = 'daterange';
    thisValidate.dateRange1HiddenIdAttribute = 'date1hiddenid';
    thisValidate.dateRange2HiddenIdAttribute = 'date2hiddenid';

    // set up error handling attributes
    thisValidate.defaultErrorAttribute = 'error';
    thisValidate.requiredErrorAttribute = 'requirederror';
    thisValidate.validationTypeErrorAttribute = 'validationtypeerror';
    thisValidate.regexErrorAttribute = 'regexerror';
    thisValidate.minLengthErrorAttribute = 'minlengtherror';
    thisValidate.maxLengthErrorAttribute = 'maxlengtherror';
    thisValidate.minValueErrorAttribute = 'minvalueerror';
    thisValidate.maxValueErrorAttribute = 'maxvalueerror';
    thisValidate.equalsErrorAttribute = 'equalserror';
    thisValidate.dateRangeErrorAttribute = 'daterangeerror';

    // set up error handling default errors
    thisValidate.defaultError = '{label} is invalid.';
    thisValidate.defaultRequiredError = '{label} is required.';
    thisValidate.defaultValidationTypeError = '{label} is invalid.';
    thisValidate.defaultRegexError = '{label} is invalid.';
    thisValidate.defaultMinLengthError = '{label} is too short in length.';
    thisValidate.defaultMaxLengthError = '{label} is too long in length.';
    thisValidate.defaultMinValueError = '{label} must be greater than {minValue}.';
    thisValidate.defaultMaxValueError = '{label} must be less than {maxValue}.';
    thisValidate.defaultEqualsError = '{label} is not equal to {equals}';
    thisValidate.defaultNotEqualsError = '{label} cannot equal {equals}';

    thisValidate.defaultValidationErrorClass = 'validationError';
    thisValidate.defaultValidationErrorLabelClass = 'validationErrorLabel';

    // add methods to object
    thisValidate.run = function (prefix) {
        var nodeArray = $(':input', SKYSALES.getSkySalesForm()).get();
        var e = null;
        // run validation on the form elements
        for (var i = 0; i < nodeArray.length; i += 1) {
            e = nodeArray[i];
            if (!this.isExemptFromValidation(e)) {
                thisValidate.validateSingleElement(e);
            }
        }
        return thisValidate.outputErrors(prefix);
    };
    thisValidate.runBySelector = function (selectorString) {
        var nodeArray = $(selectorString).find(':input').get();
        var node = null;
        var i = 0;
        // run validation on the form elements
        for (i = 0; i < nodeArray.length; i += 1) {
            node = nodeArray[i];
            thisValidate.validateSingleElement(node);
        }
        return false;
    };
    thisValidate.validateSingleElement = function (e) {
        $(e).removeClass(thisValidate.defaultValidationErrorClass);
        $("label[for=" + e.id + "]").eq(0).removeClass(this.defaultValidationErrorLabelClass);

        var validationError = new SKYSALES.ValidationErrorReadAlong();
        validationError.objId = e.id;
        validationError.obj = e;
        this.validationErrorArray[thisValidate.validationErrorArray.length] = validationError;

        this.validateRequired(e);
        // only validate the rest if they actually have something
        var value = thisValidate.getValue(e);
        if ((thisValidate.errors.length < 1) && (value !== null) && (value !== "")) {
            thisValidate.validateType(e);
            thisValidate.validateRegex(e);
            thisValidate.validateMinLength(e);
            thisValidate.validateMaxLength(e);
            thisValidate.validateMinValue(e);
            thisValidate.validateMaxValue(e);
            thisValidate.validateEquals(e);
            thisValidate.validateDateRange(e);
        }
    };
    thisValidate.outputErrors = function (prefix) {
        // if there is an error output it
        if (this.errors) {
            //alert(this.errorsHeader + this.errors);
            if ($('#' + prefix + '_error').length)
                $('#' + prefix + '_error').html(this.errors + "<br/>");

            else if ($("#error-wrapper").length) {
                $("#error-wrapper").html("<br/>" + this.errors);
                // $("#error-wrapper").show();
            }
            else {
                var img = "<img width='21' height='18' style='float: left; padding-left: 50px;' src='images/alert.gif' alt='Error!'>";
                var list = this.errors.split("<br/>");
                var newList = "";
                if (list.length > 1) {
                    var item = "";
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].length > 0) {
                            newList += "<p>" + img + list[i] + "</p><br/>"
                        }
                    }
                }
                else {
                    newList = this.errors;
                }
                $("#errorDiv").html(newList);
                $("#errorDiv").show();
            }

            if (this.setfocus) {
                if ($('#' + prefix + '_error').length) {
                    var topPos = document.getElementById(prefix + '_error').offsetTop;
                    window.scrollTo(0, topPos);
                } else if ($("#error-wrapper").length) {
                    var topPos = document.getElementById("error-wrapper").offsetTop;
                    window.scrollTo(0, topPos);
                } else if ($("#errorDiv").length) {
                    var topPos = document.getElementById("errorDiv").offsetTop;
                    window.scrollTo(0, topPos);
                }  else {
                    this.setfocus.focus();
                }
            }
            return false;
        }
        else {
            if ($('#' + prefix + '_error').length) {
                $('#' + prefix + '_error').html("");
            }
            else if ($("#error-wrapper").length) {
                $("#error-wrapper").html("");
            }
            else {
                $("#errorDiv p").remove();
                $("#errorDiv").hide();
            }

        }

        return true;
    };
    thisValidate.outputErrorsReadAlong = function (errorHtml) {
        var i = 0;
        var errorHtmlLocal = '';
        var validationError = null;
        var validateObject = this;
        var addErrorEventFunction = function (index) {
            this.hasValidationEvents = true;
            this.addFocusEvent(index);
            this.addBlurEvent(index);
        };

        validateObject.validationErrorReadAlong = new SKYSALES.ValidationErrorReadAlong();
        validateObject.readAlongDivId = this.getById(this.validationErrorReadAlong.getValidationErrorDivId()).attr('id');
        if (validateObject.readAlongDivId === undefined) {
            validateObject.validationErrorReadAlong.addValidationErrorDiv();
            validateObject.validationErrorReadAlong.addCloseEvent();
        }
        errorHtmlLocal += '<ul class="validationErrorList" >';
        for (i = 0; i < validateObject.validationErrorArray.length; i += 1) {
            validationError = this.validationErrorArray[i];
            if (validationError.isError === true) {
                errorHtmlLocal += '<li class="validationErrorListItem" >' + validationError.errorMessage + '<\/li>';
            }
            else {
                errorHtmlLocal += '<li class="validationErrorListItem hidden" >' + validationError.errorMessage + '<\/li>';
            }
        }
        this.getById(validateObject.validationErrorReadAlong.getValidationErrorListId()).html(errorHtmlLocal);

        $(validateObject.validationErrorArray).each(addErrorEventFunction);
    };
    thisValidate.checkFocus = function (e) {
        if (!thisValidate.setfocus) {
            thisValidate.setfocus = e;
        }
    };
    thisValidate.setError = function (e, errorAttribute, defaultTypeError) {
        var nameStr = '';
        var error = '';
        var dollarOne = '';
        var i = 0;
        var validationError = null;

        if (e.type === 'radio') {
            nameStr = e.getAttribute('name');
            if (nameStr.length > 0) {
                if (thisValidate.namedErrors[nameStr] !== undefined) {
                    return;
                }
                thisValidate.namedErrors[nameStr] = nameStr;
            }
        }

        error = $(e).attr(errorAttribute);
        //var error = e.getAttribute(errorAttribute);
        if (!error) {
            if ($(e).attr(thisValidate.defaultErrorAttribute)) {
                error = $(e).attr(thisValidate.defaultErrorAttribute);
            }
            else if (defaultTypeError) {
                error = defaultTypeError;
            }
            else {
                error = thisValidate.defaultError;
            }
        }
        //alert(errorAttribute + "\n" + error + "\n" + e.requiredError);

        // this would make more sense but it doesn't work
        // so i'll do each explicitly while i make this work
        var results = error.match(/\{\s*(\w+)\s*\}/g);
        if (results) {
            for (i = 0; i < results.length; i += 1) {
                dollarOne = results[i].replace(/\{\s*(\w+)\s*\}/, '$1');
                error = error.replace(/\{\s*\w+\s*\}/, thisValidate.cleanAttributeForErrorDisplay(e, dollarOne));
            }
        }

        $(e).addClass(this.defaultValidationErrorClass);
        $("label[for=" + e.id + "]").eq(0).addClass(thisValidate.defaultValidationErrorLabelClass);
        this.errors += error + '<br/>';

        var errorObjId = e.id;
        for (i = 0; i < thisValidate.validationErrorArray.length; i += 1) {
            validationError = thisValidate.validationErrorArray[i];
            if (validationError.objId === errorObjId) {
                validationError.errorMessage = error;
                validationError.isError = true;
                break;
            }
        }
        this.checkFocus(e);

    };
    thisValidate.cleanAttributeForErrorDisplay = function (e, attributeName) {
        var inputLabelObj = null;
        var requiredString = '';
        if (attributeName === undefined) {
            attributeName = '';
        }
        attributeName = attributeName.toLowerCase();
        var attribute = "";
        if (attributeName === 'label') {
            attribute = $("label[for=" + e.id + "]").eq(0).text();
            inputLabelObj = new SKYSALES.InputLabel();
            requiredString = inputLabelObj.getInputLabelRequiredFlag();
            attribute = attribute.replace(requiredString, '');
        }
        if (!attribute) {
            attribute = e.id;
        }

        if (!attribute) {
            return attributeName;
        }

        if (attributeName.match(/^(minvalue|maxvalue)$/i)) {
            var regexp = new RegExp('[^\\d.,]', 'g');
            return attribute.replace(regexp, '');
        }

        return attribute;
    };
    thisValidate.validateRequired = function (e) {

        var requiredAttribute = thisValidate.requiredAttribute;
        var requiredEmptyAttribute = thisValidate.requiredEmptyAttribute;

        var required = $(e).attr(requiredAttribute);
        //    required = e.getAttribute(requiredAttribute);

        //   var requiredEmptyString = e[requiredEmptyAttribute];
        var requiredEmptyString = $(e).attr(requiredEmptyAttribute);
        //  requiredEmptyString = e.getAttribute(this.requiredEmptyAttribute);

        var value = null;
        thisValidate.radioGroupHash = {};
        var radioName = '';
        var isRadioGroupChecked = false;
        if (required !== undefined) {
            required = required.toString().toLowerCase();
            if (requiredEmptyString) {
                requiredEmptyString = requiredEmptyString.toString().toLowerCase();
            }
            if (required === 'true') {
                value = thisValidate.getValue(e);
                if ((e.type === 'checkbox') && (e.checked === false)) {
                    value = '';
                }
                else if (e.type === 'radio') {
                    radioName = e.getAttribute('name');
                    if (thisValidate.radioGroupHash[radioName] === undefined) {
                        thisValidate.radioGroupHash[radioName] = $("input[name='" + radioName + "']");
                    }
                    isRadioGroupChecked = thisValidate.radioGroupHash[radioName].is(':checked');
                    if (!isRadioGroupChecked) {
                        value = '';
                    }
                }
                // this will not produce an error if value === 0
                if (
                    (value === undefined) ||
                    (value === null) ||
                    (value === '') ||
                    (value.toLowerCase() === requiredEmptyString)
                    ) {
                    thisValidate.setError(e, thisValidate.requiredErrorAttribute, thisValidate.defaultRequiredError);
                }
            }
        }
    };
    thisValidate.validateType = function (e) {

        var type = $(e).attr(this.validationTypeAttribute);

        var value = this.getValue(e);

        if ((type) && (value !== null)) {
            type = type.toLowerCase();
            if ((type === 'address') && (!value.match(thisValidate.stringPattern))) {
                thisValidate.setValidateTypeError(e);
            }
            else if ((type === 'alphanumeric') && (!value.match(thisValidate.alphaNumericPattern))) {
                thisValidate.setValidateTypeError(e);
            }
            else if ((type === 'amount') && (!thisValidate.validateAmount(value))) {
                thisValidate.setValidateTypeError(e);
            }
            else if ((type === 'country') && (!value.match(thisValidate.stringPattern))) {
                thisValidate.setValidateTypeError(e);
            }
            else if ((type === 'email') && (!value.match(thisValidate.emailPattern))) {
                thisValidate.setValidateTypeError(e);
            }
            else if ((type === 'mod10') && (!thisValidate.validateMod10(value))) {
                thisValidate.setValidateTypeError(e);
            }
            else if ((type === 'name') && (!value.match(thisValidate.stringPattern))) {
                thisValidate.setValidateTypeError(e);
            }
            else if ((type === 'numeric') && (!thisValidate.validateNumeric(value))) {
                thisValidate.setValidateTypeError(e);
            }
            else if ((type.indexOf('date') === 0) && (!thisValidate.validateDate(e, type, value))) {
                thisValidate.setValidateTypeError(e);
            }
            else if ((type === 'state') && (!value.match(thisValidate.stringPattern))) {
                thisValidate.setValidateTypeError(e);
            }
            else if ((type === 'string') && (!value.match(thisValidate.stringPattern))) {
                thisValidate.setValidateTypeError(e);
            }
            else if ((type === 'uppercasestring') && (!value.match(thisValidate.upperCaseStringPattern))) {
                thisValidate.setValidateTypeError(e);
            }
            else if ((type === 'zip') && (!value.match(thisValidate.stringPattern))) {
                thisValidate.setValidateTypeError(e);
            }
        }
    };
    thisValidate.validateRegex = function (e) {
        var regex = $(e).attr(this.regexAttribute);
        //var regex = e.getAttribute(this.regexAttribute);
        var value = thisValidate.getValue(e);
        if ((value !== null) && (regex) && (!value.match(regex))) {
            this.setError(e, thisValidate.regexErrorAttribute, thisValidate.defaultRegexError);
        }
    };
    thisValidate.validateMinLength = function (e) {
        //      var length = e[thisValidate.minLengthAttribute];
        //        var numericLength = e[thisValidate.numericMinLengthAttribute];
        var length = $(e).attr(this.minLengthAttribute);
        var numericLength = $(e).attr(this.numericMinLengthAttribute);
        var value = this.getValue(e);

        if ((0 < length) && (value !== null) && (value.length < length)) {
            thisValidate.setError(e, thisValidate.minLengthErrorAttribute, thisValidate.defaultMinLengthError);
        }
        else if ((0 < numericLength) && (0 < value.length) && (value.replace(thisValidate.numericStripper, '').length < numericLength)) {
            thisValidate.setError(e, thisValidate.minLengthErrorAttribute, thisValidate.defaultMinLengthError);
        }
    };
    thisValidate.validateMaxLength = function (e) {
        //  var length = e[thisValidate.maxLengthAttribute];
        //  var numericLength = e[thisValidate.numericMaxLengthAttribute];
        var length = $(e).attr(this.maxLengthAttribute);
        var numericLength = $(e).attr(this.numericMaxLengthAttribute);
        var value = this.getValue(e);

        if ((0 < length) && (value !== null) && (length < value.length)) {
            thisValidate.setError(e, thisValidate.maxLengthErrorAttribute, thisValidate.defaultMaxLengthError);
        }
        else if ((0 < numericLength) && (0 < value.length) && (numericLength < value.replace(thisValidate.numericStripper, '').length)) {
            thisValidate.setError(e, thisValidate.maxLengthErrorAttribute, thisValidate.defaultMaxLengthError);
        }
    };
    thisValidate.validateMinValue = function (e) {
        //        var min = e[thisValidate.minValueAttribute];
        var min = $(e).attr(thisValidate.minValueAttribute);
        var value = thisValidate.getValue(e);

        if ((value !== null) && (min !== undefined) && (0 < min.length)) {
            if ((5 < min.length) && (min.substring(0, 5) === '&gt;=')) {
                if (value < parseFloat(min.substring(5, min.length))) {
                    thisValidate.setError(e, thisValidate.minValueErrorAttribute, thisValidate.defaultMinValueError);
                }
            }
            else if ((4 < min.length) && (min.substring(0, 4) === '&gt;')) {
                if (value <= parseFloat(min.substring(4, min.length))) {
                    thisValidate.setError(e, thisValidate.minValueErrorAttribute, thisValidate.defaultMinValueError);
                }
            }
            else if (value < parseFloat(min)) {
                thisValidate.setError(e, thisValidate.minValueErrorAttribute, thisValidate.defaultMinValueError);
            }
        }
    };
    thisValidate.validateMaxValue = function (e) {
        //   var max = e[this.maxValueAttribute];
        var max = $(e).attr(this.maxValueAttribute);
        var value = this.getValue(e);

        if ((value !== null) && (max !== undefined) && (0 < max.length)) {
            if ((5 < max.length) && (max.substring(0, 5) === '&lt;=')) {
                if (value > parseFloat(max.substring(5, max.length))) {
                    thisValidate.setError(e, thisValidate.maxValueErrorAttribute, thisValidate.defaultMaxValueError);
                }
            }
            else if ((4 < max.length) && (max.substring(0, 4) === '&lt;')) {
                if (value >= parseFloat(max.substring(4, max.length))) {
                    thisValidate.setError(e, thisValidate.maxValueErrorAttribute, thisValidate.defaultMaxValueError);
                }
            }
            else if (parseFloat(value) > max) {
                thisValidate.setError(e, thisValidate.maxValueErrorAttribute, thisValidate.defaultMaxValueError);
            }
        }
    };

    thisValidate.validateEquals = function validateEquals(e) {
        // eventually this should be equipped to do string
        // comparison as well as other element comparisons

        // var equal = e[thisValidate.equalsAttribute];
        var equal = $(e).attr(thisValidate.equalsAttribute);
        var value = thisValidate.getValue(e);

        if ((value !== null) && (equal !== undefined) && (0 < equal.length)) {
            if ((2 < equal.length) && (equal.substring(0, 2) === '!=')) {
                if (value === equal.substring(2, equal.length)) {
                    thisValidate.setError(e, thisValidate.equalsErrorAttribute, thisValidate.defaultEqualsError);
                }
            }
            else if ((2 < equal.length) && (equal.substring(0, 2) === '==')) {
                if (value !== equal.substring(2, equal.length)) {
                    thisValidate.setError(e, thisValidate.equalsErrorAttribute, thisValidate.defaultEqualsError);
                }
            }
            else if (equal.charAt(0) === '=') {
                if (value !== equal.substring(1, equal.length)) {
                    thisValidate.setError(e, thisValidate.equalsErrorAttribute, thisValidate.defaultEqualsError);
                }
            }
            else if (value !== equal) {
                thisValidate.setError(e, thisValidate.equalsErrorAttribute, thisValidate.defaultEqualsError);
            }
        }
    };

    var checkDateRangeExists = function (dateHidden2) {
        var parent = dateHidden2.parent();
        var parent2 = parent.parent();
        var noDateRangeIE = parent.is(':hidden');
        var noDateRangeNonIE = parent2.is(':hidden');
        var retVal = !(noDateRangeIE || noDateRangeNonIE);
        return retVal;
    };
    thisValidate.checkIfValidateDateRangeNeeded = function (e) {
        //  var date = e[thisValidate.dateRangeAttribute];
        //  var date1HiddenId = e[thisValidate.dateRange1HiddenIdAttribute];
        //   var date2HiddenId = e[thisValidate.dateRange2HiddenIdAttribute];

        var date = $(e).attr(thisValidate.dateRangeAttribute);
        var date1HiddenId = $(e).attr(thisValidate.dateRange1HiddenIdAttribute);
        var date2HiddenId = $(e).attr(thisValidate.dateRange2HiddenIdAttribute);

        var idLastChar = '';
        var idSuffix = '';
        var id = e.id;
        var startValidate = false;
        var dateRangeExists = false;
        var dateHidden1 = null;
        var dateHidden2 = null;

        if ((date !== undefined) && (0 < date.length)) {
            //parse from the id the trailing "count" value
            //e.g. DROPDOWNLISTMARKETDAY2 -> extract 2
            idLastChar = id.charAt(id.length - 1);
            if (this.validateNumeric(idLastChar)) {
                idSuffix = idLastChar;
            }

            //for flight search page only run check on the first month in the range
            if (('1' === idSuffix) || ('' === idSuffix)) {
                // If one of the date range items is hidden then it's one way and the validation shouldn't check a pair of dates.
                dateHidden2 = this.getById(date2HiddenId);
                dateRangeExists = checkDateRangeExists(dateHidden2);
                if (dateRangeExists) {
                    startValidate = true;
                    dateHidden1 = this.getById(date1HiddenId);
                    thisValidate.dateRangeArray[0] = dateHidden1.val();
                    thisValidate.dateRangeArray[1] = dateHidden2.val();
                }
            }
        }
        return startValidate;
    };
    thisValidate.validateDateRange = function (e) {
        var marketDate = null;
        var datesInOrder = false;

        // Determine if date range needs to be validated. If "startValidate" is
        // true, it means that we need to check if the date range is valid.
        //
        var startValidate = thisValidate.checkIfValidateDateRangeNeeded(e);

        if (startValidate) {
            marketDate = new SKYSALES.Class.MarketDate();
            datesInOrder = marketDate.datesInOrder(this.dateRangeArray);
            if (!datesInOrder) {
                this.setError(e, this.dateRangeErrorAttribute, this.defaultError);
            }
        }
    };
    thisValidate.isExemptFromValidation = function (e) {
        if (e.id.indexOf(this.namespace) !== 0) {
            return true;
        }

        if (this.regexElementIdFilter && (!e.id.match(this.regexElementIdFilter))) {
            return true;
        }

        return false;
    };

    // add validation type methods
    thisValidate.setValidateTypeError = function (e) {
        this.setError(e, this.validationTypeErrorAttribute, this.defaultValidationTypeError);
    };
    thisValidate.validateAmount = function (amount) {
        if ((!amount.match(this.amountPattern)) || (amount === 0)) {
            return false;
        }

        return true;
    };
    thisValidate.validateDate = function (e, type, value) {
        var lowerCaseType = '';
        var today = new Date();
        if (type) {
            lowerCaseType = type.toLowerCase();
        }

        if ((lowerCaseType === 'dateyear') && ((value < today.getYear()) || (!value.match(thisValidate.dateYearPattern)))) {
            return false;
        }
        //just make sure it is two digits for now
        else if ((lowerCaseType === 'datemonth') && (!value.match(thisValidate.dateMonthPattern))) {
            return false;
        }
        //just make sure it is two digits for now
        else if ((lowerCaseType === 'dateday') && (!value.match(thisValidate.DateDayPattern))) {
            return false;
        }

        return true;
    };
    thisValidate.validateMod10 = function (cardNumber) {
        var ccCheckRegExp = /\D/;
        var cardNumbersOnly = cardNumber.replace(/ /g, "");
        var numberProduct;
        var checkSumTotal = 0;
        var productDigitCounter = 0;
        var digitCounter = 0;

        if (!ccCheckRegExp.test(cardNumbersOnly)) {
            while (cardNumbersOnly.length < 16) {
                cardNumbersOnly = '0' + cardNumbersOnly;
            }

            for (digitCounter = cardNumbersOnly.length - 1; 0 <= digitCounter; digitCounter -= 2) {
                checkSumTotal += parseInt(cardNumbersOnly.charAt(digitCounter), 10);
                numberProduct = String((cardNumbersOnly.charAt(digitCounter - 1) * 2));
                for (productDigitCounter = 0; productDigitCounter < numberProduct.length; productDigitCounter += 1) {
                    checkSumTotal += parseInt(numberProduct.charAt(productDigitCounter), 10);
                }
            }

            return (checkSumTotal % 10 === 0);
        }
        return false;
    };

    // Validates if the data passed is numeric
    thisValidate.validateNumeric = function (number) {
        number = number.replace(/\s/g, '');

        if (!number.match(thisValidate.numericPattern)) {
            return false;
        }

        return true;
    };

    thisValidate.getValue = function (e) {
        return SKYSALES.Common.getValue(e);
    };

    //this.nonePattern = '^\.*$';
    thisValidate.stringPattern = new RegExp('^.+$');
    thisValidate.upperCaseStringPattern = /^[A-Z]([A-Z|\s])*$/;
    thisValidate.numericPattern = /^\d+$/;
    thisValidate.numericStripper = /\D/g;
    thisValidate.alphaNumericPattern = /^\w+$/;

    //accepts a period, a comma, a space or a nonbreaking space as delimiter
    thisValidate.amountPattern = /^(\d+((\.|,|\s|\xA0)\d+)*)$/;

    thisValidate.dateYearPattern = /^\d{4}$/;
    thisValidate.dateMonthPattern = /^\d{2}$/;
    thisValidate.dateDayPattern = /^\d{2}$/;

    thisValidate.emailPattern = /^\w+([\.\-\']?\w+)*@\w+([\.\-\']?\w+)*(\.\w{1,8})$/;
    return thisValidate;
};

var validateBySelector = function (selectorString)
{
    var validate = null;
    var clickedObj = null;
    if (selectorString !== undefined)
    {
        // run validation on the form elements
        validate = new SKYSALES.Validate(null, '', SKYSALES.errorsHeader, null);
        validate.clickedObj = clickedObj;
        validate.runBySelector(selectorString);
        return validate.outputErrors();
    }
    return true;
};

var validate = function (controlID, elementName, filter)
{
    var clickedObj = null;
    var validate = null;
    var e = null;
    //make sure we can run this javascript
    if (document.getElementById && document.createTextNode)
    {
        // check if you can getAttribute if you can it is an element use the id.
        if (controlID.getAttribute)
        {
            clickedObj = controlID;
            controlID = controlID.getAttribute("id").replace(/_\w+$/, "");
        }
        validate = new SKYSALES.Validate(SKYSALES.getSkySalesForm(), controlID + '_', SKYSALES.errorsHeader, filter);
        validate.clickedObj = clickedObj;
        
        if (elementName)
        {
            e = elementName;
            if (!elementName.getAttribute)
            {
                e = document.getElementById(controlID + "_" + elementName);
            }
            validate.validateSingleElement(e);
            return validate.outputErrors();
        }

        return validate.run(controlID);
    }
    // could not use javascript rely on server validation
    return true;
};


var preventDoubleClick = function ()
{
    return true;
};


var events = [];

var register = function (eventName, functionName)
{
    if (events[eventName] === undefined)
    {
        events[eventName] = [];
    }
    events[eventName][events[eventName].length]    = functionName;
};

var raise = function (eventName, eventArgs) 
{
    var eventArray = window.events || [],
    index = 0,
    eventHandlerArray = null,
    eventHandlerName = null,
    returnValue = true,
    length = 0,
    eventHandler = null;
    
    eventHandlerArray = eventArray[eventName] || [];
    length = eventHandlerArray.length;
    while (index < length && returnValue)
    {
        eventHandlerName = eventHandlerArray[index];
        eventHandler = window[eventHandlerName];
        returnValue = eventHandler(eventArgs);
        index += 1;
    }
    return returnValue;
};

var WindowInitialize = function ()
{
    var originalOnLoad = window.onload;
    //fix this up so initialize is synched with everything else
    var windowLoadFunction = function ()
    {
        raise('WindowLoad', {});
        if (originalOnLoad)
        {
            originalOnLoad();
        }
    };
    $(window).ready(windowLoadFunction);
};

SKYSALES.Util.displayPopUpConverter = function ()
{
    var url = 'CurrencyConverter.aspx';
    var converterWindow = window.converterWindow;
    if (!window.converterWindow || converterWindow.closed)
    {
        converterWindow = window.open(url, 'converter', 'width=360,height=220,toolbar=0,status=0,location=0,menubar=0,scrollbars=0,resizable=0');
    }
    else
    {
        converterWindow.open(url, 'converter', 'width=360,height=220,toolbar=0,status=0,location=0,menubar=0,scrollbars=0,resizable=0');
        if ($(converterWindow).is(':hidden') === false)        
        {
            converterWindow.focus();
        }
    }
};

//Function to hide/show controls. Inputs are the control you want to hide and the dependent control 
//or which control is interacted with to trigger the hide/show of the other control.
var hideShow = function (hideControl, depControl)
{
    var controlHide = hideControl;
    var controlDepend = depControl;
     
    if (document.getElementById && document.getElementById(hideControl))
    {
        if (document.getElementById(controlDepend).checked === true)
        {
            document.getElementById(controlHide).style.display = "inline";
        }
        else
        {
            document.getElementById(controlHide).style.display = "none";
        }
    }
};
var jsLoadedCommon = true;

/* Page Behaviors */

SKYSALES.toggleAtAGlanceEvent = function ()
{
    $(this).next().toggle();
};
SKYSALES.toggleAtAGlance = function ()
{
    $("div.atAGlanceDivHeader").click(SKYSALES.toggleAtAGlanceEvent);
};

SKYSALES.initializeTime = function ()
{
    var i = 0;
    var timeOptions = "";
    for (i = 0; i < 23; i += 1)
    {
        timeOptions += "<option value=" + i + ">" + i + "</option>";
    }
    if (timeOptions !== "")
    {
        $("select.Time").append(timeOptions);
    }
};

$("a.animateMe").animate({
    height: 'toggle', 
    opacity: 'toggle'
}, "slow");


SKYSALES.aosAvailabilityShow = function ()
{
    $(this).parent().find('div.hideShow').show('slow');
    return false;
};

SKYSALES.aosAvailabilityHide = function ()
{
    $(this).parent().parent('.hideShow').hide('slow');
    return false;
};

SKYSALES.dropDownMenuEvent = function ()
{
    $("div.slideDownUp").toggle('fast');
    return false;
};

SKYSALES.faqHideShow = function () 
{
    $(this).parent('dt').next('.accordianSlideContent').slideToggle("slow");
};

SKYSALES.equipHideShow = function () 
{
    $('div#moreSearchOptions').slideToggle("slow");
    return false;
};

SKYSALES.initializeAosAvailability = function ()
{
    /* AOS Availability */
    $('.hideShow').hide();
    $('a.showContent').click(SKYSALES.aosAvailabilityShow);
    $('a.hideContent').click(SKYSALES.aosAvailabilityHide);
    /* Drop-down menus */
    $('a.toggleSlideContent').click(SKYSALES.dropDownMenuEvent);
    
    $('a.accordian').click(SKYSALES.faqHideShow);
    
    
    $('a.showEquipOpt').click(SKYSALES.equipHideShow);
    $('a.hideEquipOpt').click(SKYSALES.equipHideShow);
};



//load metaobjects (used for validation)
SKYSALES.initializeMetaObjects = function ()
{
    //$.metaobjects({clean: false});
};

SKYSALES.common = new SKYSALES.Common();


function formatCurrency(value) 
{
	var cents = 0;
	value = value.toString();	
	if (isNaN(value))
	{
		value = '0';
	}
	if (value.indexOf('.') > -1)
	{
		cents = value.substring(value.indexOf('.') + 1, value.length);
		
		value = value * 100;
	}	
	cents = value % 100;	
	if (cents > 0)
	{
		value = Math.floor(value / 100).toString();
	}	
	if (cents < 10)
	{
		cents = '0' + cents;
	}	
	for (var i = 0; i < Math.floor((value.length - (1 + i)) / 3); i += 1)	
	{
		value = value.substring(0, value.length - (4 * i + 3)) + ',' + value.substring(value.length - (4 * i + 3));
	}	
	return (value + '.' + cents);
}


SKYSALES.Util.sendAspFormFields = function ()
{   
    var clearAllValidity = null;
    var eventTargetElement = window.document.getElementById('eventTarget');
    var eventArgumentElement = window.document.getElementById('eventArgument');
    var viewStateElement = window.document.getElementById('viewState');
    var theForm = window.theForm;
    if (!theForm.onsubmit || (theForm.onsubmit() !== false))
    {
        eventTargetElement.name = '__EVENTTARGET';
        eventArgumentElement.name = '__EVENTARGUMENT';
        viewStateElement.name = '__VIEWSTATE';
        if (theForm.checkValidity)
        {
            clearAllValidity = function ()
            {
                $(this).removeAttr("required");
            };
            SKYSALES.common.getAllInputObjects().each(clearAllValidity);
        }
    }
    return true;
};

SKYSALES.Util.initStripeTable = function ()
{
    $('.hotelResult').hide();

    var stripeMeInputHandler = function ()
    {
        $('.stripeMe tr').removeClass("over");
        $(this).parent().parent().addClass("over");
    };
    $('.stripeMe input').click(stripeMeInputHandler);
};

SKYSALES.Util.ready = function ()
{
    $('form').submit(SKYSALES.Util.sendAspFormFields);

    //Turn validation object tags into javascript, this must run before initializeCommon
    SKYSALES.initializeMetaObjects();

    //Initialize Common
    SKYSALES.common.initializeCommon();

    //Initialize objects
    SKYSALES.Util.initObjects();
    
    SKYSALES.initializeSkySalesForm();
    SKYSALES.toggleAtAGlance();
    SKYSALES.Util.initStripeTable();
    SKYSALES.initializeAosAvailability();
    
};

/*
    Name: 
        Class CalendarAvailabilityInput
    Param:
        None
    Return: 
        An instance of CalendarAvailabilityInput
    Functionality:
        Displays the low fare calendar
    Notes:
        This is the container object that has an array of markets
    Class Hierarchy:
        SkySales -> CalendarAvailabilityInput
*/
SKYSALES.Class.CalendarAvailabilityInput = function ()
{
    var parent = new SKYSALES.Class.SkySales(),
    thisCalendarAvailabilityInput = SKYSALES.Util.extendObject(parent);
    
    thisCalendarAvailabilityInput.containerId = 'availabilityInputContainerId';
    thisCalendarAvailabilityInput.container = null;
    
    thisCalendarAvailabilityInput.templateId = 'availabilityInputTemplateId';
    thisCalendarAvailabilityInput.template = null;
    
    thisCalendarAvailabilityInput.totalTemplateId = 'totalTemplateId';
    thisCalendarAvailabilityInput.totalTemplate = null;
    
    thisCalendarAvailabilityInput.totalId = 'totalId';
    thisCalendarAvailabilityInput.total = null;
    
    thisCalendarAvailabilityInput.marketArray = [];
    
    thisCalendarAvailabilityInput.init = function (json)
    {
        this.setSettingsByObject(json);
        this.initMarketArray();
        this.setVars();
        this.draw();
        this.setVarsAfterDraw();
        this.addEvents();
        this.selectInitialDateMarkets();
    };
    
    thisCalendarAvailabilityInput.setVars = function ()
    {
        thisCalendarAvailabilityInput.container = this.getById(this.containerId);
        thisCalendarAvailabilityInput.template = this.getById(this.templateId);
        thisCalendarAvailabilityInput.totalTemplate = this.getById(this.totalTemplateId);
    };
    
    thisCalendarAvailabilityInput.initMarketArray = function ()
    {
        var i = 0,
        marketArray = this.marketArray || [],
        len = marketArray.length,
        market = null;
        for (i = 0; i < len; i += 1)
        {
            market = new SKYSALES.Class.CalendarAvailabilityMarket();
            market.availabilityInput = this;
            market.marketIndex = i;
            market.containerId = 'market_' + i;
            market.selectedDateContainerId = 'selectedDate_' + i;
            market.init(marketArray[i]);
            marketArray[i] = market;
        }
    };
    
    thisCalendarAvailabilityInput.setVarsAfterDraw = function ()
    {
        thisCalendarAvailabilityInput.total = this.getById(this.totalId);
    
        var i = 0,
        marketArray = this.marketArray || [],
        len = marketArray.length,
        market = null;
        for (i = 0; i < len; i += 1)
        {
            market = marketArray[i];
            market.setVarsAfterDraw();
        }
    };
    
    thisCalendarAvailabilityInput.addEvents = function ()
    {
        var i = 0,
        marketArray = this.marketArray || [],
        len = marketArray.length,
        market = null;
        for (i = 0; i < len; i += 1)
        {
            market = marketArray[i];
            market.addEvents();
        }
    };
    
    thisCalendarAvailabilityInput.selectInitialDateMarkets = function ()
    {
        var i = 0,
        marketArray = this.marketArray || [],
        len = marketArray.length,
        market = null;
        for (i = 0; i < len; i += 1)
        {
            market = marketArray[i];
            market.selectInitialDateMarket();
        }
    };
    
    thisCalendarAvailabilityInput.getHtml = function ()
    {
        var html = this.template.text(),
        marketHtml = '',
        i = 0,
        marketArray = this.marketArray || [],
        len = marketArray.length,
        market = null;
        
        for (i = 0; i < len; i += 1)
        {
            market = marketArray[i];
            marketHtml += market.getHtml();
        }
        html = html.replace(/\[marketArray\]/, marketHtml);
        return html;
    };
    
    thisCalendarAvailabilityInput.draw = function ()
    {
        var html = this.getHtml();
        this.container.html(html);
    };
    
    thisCalendarAvailabilityInput.updateTotalPrice = function ()
    {
        var totalPrice = this.getTotalPrice(),
        totalhtml = this.totalTemplate.text();
        
        totalPrice = SKYSALES.Util.convertToLocaleCurrency(totalPrice);
        totalhtml = totalhtml.replace(/\[totalPrice\]/, totalPrice);
        this.total.html(totalhtml);
    };
    
    thisCalendarAvailabilityInput.getTotalPrice = function ()
    {
        var i = 0,
        marketArray = this.marketArray || [],
        len = marketArray.length,
        market = null,
        dateMarket = null,
        dateMarketPrice = 0,
        total = 0;
        
        for (i = 0; i < len; i += 1)
        {
            market = marketArray[i];
            dateMarket = market.selectedDateMarket || {};
            dateMarketPrice = dateMarket.price || 0;
            total += dateMarketPrice;
        }
        return total;
    };
    
    return thisCalendarAvailabilityInput;
};
SKYSALES.Class.CalendarAvailabilityInput.createObject = function (json)
{
    SKYSALES.Util.createObject('calendarAvailabilityInput', 'CalendarAvailabilityInput', json);
};

/*
    Name: 
        Class CalendarAvailabilityMarket
    Param:
        None
    Return: 
        An instance of CalendarAvailabilityMarket
    Functionality:
        Represents a single calendar in the low fare calendar view
    Notes:
        
    Class Hierarchy:
        SkySales -> CalendarAvailabilityMarket
*/
SKYSALES.Class.CalendarAvailabilityMarket = function ()
{
    var parent = new SKYSALES.Class.SkySales(),
    thisCalendarAvailabilityMarket = SKYSALES.Util.extendObject(parent);
    
    thisCalendarAvailabilityMarket.containerId = '';
    thisCalendarAvailabilityMarket.container = null;
    thisCalendarAvailabilityMarket.selectedDateContainerId = '';
    thisCalendarAvailabilityMarket.selectedDateContainer = null;
    thisCalendarAvailabilityMarket.templateId = 'marketTemplateId';
    thisCalendarAvailabilityMarket.template = null;
    thisCalendarAvailabilityMarket.selectedDateTemplateId = 'selectedDateTemplateId';
    thisCalendarAvailabilityMarket.selectedDateTemplate = null;
    
    thisCalendarAvailabilityMarket.availabilityInput = null;
    thisCalendarAvailabilityMarket.dateMarketHash = {};
    thisCalendarAvailabilityMarket.marketIndex = -1;
    thisCalendarAvailabilityMarket.departureStation = '';
    thisCalendarAvailabilityMarket.arrivalStation = '';
    thisCalendarAvailabilityMarket.selectedDateMarket = null;
    thisCalendarAvailabilityMarket.selectedDate = '';
    thisCalendarAvailabilityMarket.selectedClass = 'selected';
    thisCalendarAvailabilityMarket.dateMarketPrefix = 'date_';
    
    thisCalendarAvailabilityMarket.inputDayId = '';
    thisCalendarAvailabilityMarket.inputDay = null;
    thisCalendarAvailabilityMarket.inputMonthId = '';
    thisCalendarAvailabilityMarket.inputMonth = null;
    
    thisCalendarAvailabilityMarket.startYear = '';
    thisCalendarAvailabilityMarket.startMonth = '';
    thisCalendarAvailabilityMarket.startDay = '';
    thisCalendarAvailabilityMarket.startDate = '';
    thisCalendarAvailabilityMarket.firstBlockDate = '';
    
    thisCalendarAvailabilityMarket.endYear = '';
    thisCalendarAvailabilityMarket.endMonth = '';
    thisCalendarAvailabilityMarket.endDay = '';
    thisCalendarAvailabilityMarket.endDate = '';
    thisCalendarAvailabilityMarket.lastBlockDate = '';
    
    thisCalendarAvailabilityMarket.init = function (json)
    {
        this.setSettingsByObject(json);
        this.setVars();
        this.initStartDate();
        this.initEndDate();
        this.initFirstBlockDate();
        this.initLastBlockDate();
        this.initDateMarketHash();
    };
    
    thisCalendarAvailabilityMarket.setVars = function ()
    {
        thisCalendarAvailabilityMarket.template = this.getById(this.templateId);
        thisCalendarAvailabilityMarket.inputDay = this.getById(this.inputDayId);
        thisCalendarAvailabilityMarket.inputMonth = this.getById(this.inputMonthId);
    };
    
    thisCalendarAvailabilityMarket.setVarsAfterDraw = function ()
    {
        thisCalendarAvailabilityMarket.container = this.getById(this.containerId);
        thisCalendarAvailabilityMarket.selectedDateContainer = this.getById(this.selectedDateContainerId);
        thisCalendarAvailabilityMarket.selectedDateTemplate = this.getById(this.selectedDateTemplateId);
        
        var dateMarketHash = this.dateMarketHash || {},
        key = '',
        dateMarket = null;
        
        for (key in dateMarketHash)
        {
            if (dateMarketHash.hasOwnProperty(key))
            {
                dateMarket = dateMarketHash[key];
                dateMarket.setVarsAfterDraw();
            }
        }
    };
    
    thisCalendarAvailabilityMarket.addEvents = function ()
    {
        this.container.click(this.updateFareHandler);
    };
    
    thisCalendarAvailabilityMarket.updateFareHandler = function (eventInfo)
    {
        var target = eventInfo.target,
        dateMarketKey = target.id;
        if (dateMarketKey === "")
        {
            dateMarketKey = $(target).parent('div.day').attr('id') || '';
        }
        thisCalendarAvailabilityMarket.updateFare(dateMarketKey);
    };
    
    thisCalendarAvailabilityMarket.updateFare = function (dateMarketKey)
    {
        var dateMarket = this.dateMarketHash[dateMarketKey],
        html = '',
        price = ',',
        day = -1,
        month = -1;
        
        if (dateMarket && dateMarket.price > 0)
        {
            this.deactivateAllDateMarkets();
            dateMarket.activate();
            thisCalendarAvailabilityMarket.selectedDateMarket = dateMarket;
            html = this.selectedDateTemplate.text();
            html = html.replace(/\[formattedDate\]/, dateMarket.formattedDate);
            price = dateMarket.getFormattedPrice();
            html = html.replace(/\[price\]/, price);
            this.selectedDateContainer.html(html);
            month = parseInt(dateMarket.month, 10) + 1;
            this.inputMonth.val(month);
            day = parseInt(dateMarket.day, 10);
            this.inputDay.val(day);
            this.availabilityInput.updateTotalPrice();
        }
    };
    
    thisCalendarAvailabilityMarket.selectInitialDateMarket = function ()
    {
        var key = this.dateMarketPrefix + this.marketIndex + '_' + this.selectedDate;
        this.updateFare(key);
    };
    
    thisCalendarAvailabilityMarket.deactivateAllDateMarkets = function ()
    {
        var selectedClass = this.selectedClass,
        dateMarketHash = this.dateMarketHash || {},
        key = '',
        dateMarket = null;
        
        for (key in dateMarketHash)
        {
            if (dateMarketHash.hasOwnProperty(key))
            {
                dateMarket = dateMarketHash[key];
                dateMarket.deactivate(selectedClass);
            }
        }
    };
    
    thisCalendarAvailabilityMarket.initStartDate = function ()
    {
        thisCalendarAvailabilityMarket.startDate = new Date(this.startYear, this.startMonth, this.startDay);
    };
    
    thisCalendarAvailabilityMarket.initEndDate = function ()
    {
        thisCalendarAvailabilityMarket.endDate = new Date(this.endYear, this.endMonth, this.endDay);
    };
    
    thisCalendarAvailabilityMarket.initFirstBlockDate = function ()
    {
        var startDate = this.startDate,
        dayOfWeek = startDate.getDay(),
        firstBlockDate = this.addDays(startDate, dayOfWeek * -1);
        
        thisCalendarAvailabilityMarket.firstBlockDate = firstBlockDate;
    };
    
    thisCalendarAvailabilityMarket.initLastBlockDate = function ()
    {
        var daysInWeek = 7,
        endDate = this.endDate,
        dayOfWeek = endDate.getDay(),
        daysToAdd = daysInWeek - dayOfWeek,
        lastBlockDate = this.addDays(endDate, daysToAdd);

        thisCalendarAvailabilityMarket.lastBlockDate = lastBlockDate;
    };
    
    thisCalendarAvailabilityMarket.getMarketHashKey = function (date)
    {
        date = date || new Date();
        var key = this.dateMarketPrefix + this.marketIndex + '_' + date.getFullYear() + '_' + date.getMonth() + '_' + date.getDate();
        return key;
    };
    
    thisCalendarAvailabilityMarket.initDateMarketHash = function ()
    {
        var date = new Date(),
        stopDate = this.lastBlockDate,
        dateMarketHash = this.dateMarketHash || {},
        key = '',
        dateMarket = null;
        date.setTime(this.firstBlockDate.getTime());

        while (date < stopDate)
        {
            key = this.getMarketHashKey(date);
            dateMarket = new SKYSALES.Class.CalendarAvailabilityDateMarket();
            dateMarket.market = this;
            dateMarketHash[key] = dateMarketHash[key] || {};
            dateMarket.init(dateMarketHash[key]);
            dateMarket.date = new Date();
            dateMarket.date.setTime(date.getTime());
            dateMarketHash[key] = dateMarket;
            date = this.addDays(date, 1);
        }
    };
    
    thisCalendarAvailabilityMarket.getMonthName = function (month)
    {
        month = parseInt(month, 10);
        var monthName = '',
        resource = null,
        monthNames = null;
        resource = SKYSALES.Util.getResource();
        monthNames = resource.dateCultureInfo.monthNames;
        if (monthNames.length > month)
        {
            monthName = monthNames[month];
        }
        return monthName;
    };
    
    thisCalendarAvailabilityMarket.getDayNameArray = function ()
    {
        var resource = null,
        dayNames = null;
        resource = SKYSALES.Util.getResource();
        dayNames = resource.dateCultureInfo.dayNamesShort || [];
        return dayNames;
    };
    
    thisCalendarAvailabilityMarket.supplantDayNames = function (html)
    {
        var dayNameArray = this.getDayNameArray(),
        i = 0,
        len = dayNameArray.length,
        dayNameRegex = null,
        dayNameStr = '',
        dayName = '';
        for (i = 0; i < len; i += 1)
        {
            dayName = dayNameArray[i];
            dayNameStr = '\\[daysOfWeek' + i + '\\]';
            dayNameRegex = new RegExp(dayNameStr);
            html = html.replace(dayNameRegex, dayName);
        }
        return html;
    };
    
    thisCalendarAvailabilityMarket.getHtml = function ()
    {
        var html = this.template.text();
        html = this.supplant(html);
        return html;
    };
    
    thisCalendarAvailabilityMarket.supplant = function (html)
    {
        html = html || '';
        var monthName = this.getMonthName(this.startMonth),
        marketHtml = '';
    
        html = html.replace(/\[startDateMonth\]/, monthName);
        html = html.replace(/\[startDateYear\]/, this.startYear);
        html = html.replace(/\[marketIndex\]/g, this.marketIndex);
        html = html.replace(/\[departureStation\]/, this.departureStation);
        html = html.replace(/\[arrivalStation\]/, this.arrivalStation);
        html = this.supplantDayNames(html);
        
        marketHtml = this.getMarketHtml();
        html = html.replace(/\[dateMarketHash\]/, marketHtml);
        return html;
    };
    
    thisCalendarAvailabilityMarket.getMarketHtml = function ()
    {
        var html = '',
        htmlArray = [],
        date = new Date(),
        stopDate = this.lastBlockDate,
        dateMarketHash = this.dateMarketHash || {},
        key = '',
        dateMarket = null;
        date.setTime(this.firstBlockDate.getTime());
        
        while (date < stopDate)
        {
            key = this.getMarketHashKey(date);
            dateMarket = dateMarketHash[key];
            htmlArray.push(dateMarket.getHtml());
            date = this.addDays(date, 1);
        }
        html = htmlArray.join('');
        return html;
    };
    
    thisCalendarAvailabilityMarket.addDays = function (origDate, numDays)
    {
        var date = new Date(origDate.getTime());
        date.setDate(origDate.getDate() + numDays);
        return date;
    };
    
    thisCalendarAvailabilityMarket.getDateMarketArray = function ()
    {
        var dateMarketHash = this.dateMarketHash || {},
        key = '',
        dateMarket = null,
        dateMarketArray = [];
        
        for (key in dateMarketHash)
        {
            if (dateMarketHash.hasOwnProperty(key))
            {
                dateMarket = dateMarketHash[key];
                dateMarketArray.push(dateMarket);
            }
        }
        return dateMarketArray;
    };
    
    return thisCalendarAvailabilityMarket;
};

/*
    Name: 
        Class CalendarAvailabilityDateMarket
    Param:
        None
    Return: 
        An instance of CalendarAvailabilityDateMarket
    Functionality:
        Represents a single day of a calendar in the low fare calendar view
    Notes:
        
    Class Hierarchy:
        SkySales -> CalendarAvailabilityDateMarket
*/
SKYSALES.Class.CalendarAvailabilityDateMarket = function ()
{
    var parent = new SKYSALES.Class.SkySales();
    var thisCalendarAvailabilityDateMarket = SKYSALES.Util.extendObject(parent);
    
    thisCalendarAvailabilityDateMarket.market = null;
    thisCalendarAvailabilityDateMarket.date = null;
    
    thisCalendarAvailabilityDateMarket.containerId = '';
    thisCalendarAvailabilityDateMarket.container = null;
    thisCalendarAvailabilityDateMarket.templateId = 'dateMarketTemplateId';
    thisCalendarAvailabilityDateMarket.template = null;
    thisCalendarAvailabilityDateMarket.defaultJourneyTemplateId = 'dateMarketJourneyDefaultTemplateId';
    thisCalendarAvailabilityDateMarket.defaultJourneyTemplate = null;
    
    thisCalendarAvailabilityDateMarket.price = 0;
    thisCalendarAvailabilityDateMarket.formattedDate = '';
    thisCalendarAvailabilityDateMarket.year = -1;
    thisCalendarAvailabilityDateMarket.month = -1;
    thisCalendarAvailabilityDateMarket.day = -1;
    
    thisCalendarAvailabilityDateMarket.init = function (json)
    {
        this.setSettingsByObject(json);
        this.setVars();
    };
    
    thisCalendarAvailabilityDateMarket.setVars = function ()
    {
        thisCalendarAvailabilityDateMarket.template = this.getById(this.templateId);
    };
    
    thisCalendarAvailabilityDateMarket.setVarsAfterDraw = function ()
    {
        thisCalendarAvailabilityDateMarket.container = this.getById(this.containerId);
    };
    
    thisCalendarAvailabilityDateMarket.getFormattedPrice = function ()
    {
        var price = '';
        if (this.price > 0)
        {
            price = SKYSALES.Util.convertToLocaleCurrency(this.price);
        }
        return price;
    };
    
    thisCalendarAvailabilityDateMarket.getHtml = function ()
    {
        var html = this.template.text();
        html = this.supplant(html);
        return html;
    };
    
    thisCalendarAvailabilityDateMarket.supplant = function (html)
    {
        var price = '',
        year = this.date.getFullYear().toString(),
        twoDigitYear = '',
        month = this.date.getMonth(),
        showMonth = 0,
        day = this.date.getDate(),
        market = this.market;
        
        showMonth = month + 1;
        twoDigitYear = year.charAt(2) + year.charAt(3);
        
        html = html.replace(/\[day\]/g, day);
        html = html.replace(/\[month\]/g, month);
        html = html.replace(/\[showMonth\]/g, showMonth);
        html = html.replace(/\[year\]/g, year);
        html = html.replace(/\[twoDigitYear\]/g, twoDigitYear);
        price = this.getFormattedPrice();
        html = html.replace(/\[price\]/, price);
        html = html.replace(/\[marketIndex\]/g, market.marketIndex);
        return html;
    };
    
    thisCalendarAvailabilityDateMarket.activate = function ()
    {
        var selectedClass = this.market.selectedClass;
        this.container.addClass(selectedClass);
    };
    
    thisCalendarAvailabilityDateMarket.deactivate = function ()
    {
        var selectedClass = this.market.selectedClass;
        this.container.removeClass(selectedClass);
    };
    
    return thisCalendarAvailabilityDateMarket;
};

SKYSALES.Class.HotelDescriptions = function ()
{   //container
    var parent = new SKYSALES.Class.SkySales(),
    thisHotelDescriptions = SKYSALES.Util.extendObject(parent);

    thisHotelDescriptions.hotelDescriptionsArray = [];

    thisHotelDescriptions.addLongDescriptions = function (longDescriptionParamObj)
    {
        var hotelLongdescription = new SKYSALES.Class.ToggleView();
        hotelLongdescription.init(longDescriptionParamObj);
    };

    thisHotelDescriptions.init = function (json)
    {
        this.setSettingsByObject(json);
        this.setVars();
        this.addEvents();
        this.initHotelDescriptionsArray();
    };

    thisHotelDescriptions.initHotelDescriptionsArray = function ()
    {
        var i = 0,
        hotelDescriptionsArray = this.hotelDescriptionsArray || [],
        len = hotelDescriptionsArray.length,
        hotelDescription = null;
        for (i = 0; i < len; i += 1)
        {
            hotelDescription = new SKYSALES.Class.HotelDescription();
            hotelDescription.init(hotelDescriptionsArray[i]);
            hotelDescriptionsArray[i] = hotelDescription;
        }
    };

    return thisHotelDescriptions;
};

SKYSALES.Class.HotelDescription = function ()
{
    var parent = new SKYSALES.Class.ToggleView(),
    thisHotelDescription = SKYSALES.Util.extendObject(parent);

    thisHotelDescription.contentType = "";
    thisHotelDescription.detailsAvailable = false;
    thisHotelDescription.longDescription = "";
    thisHotelDescription.noDescriptionAvailableMessage = "";
    thisHotelDescription.messageDivId = "";
    thisHotelDescription.messageDiv = null;
    thisHotelDescription.hotelKey = "";
    thisHotelDescription.getHotelDescriptionUri = "GetHotelDescriptionAjax-resource.aspx";
    thisHotelDescription.ajaxParams = "";
    thisHotelDescription.addressId = '';
    thisHotelDescription.addressDom = null;

    thisHotelDescription.init = function (json)
    {
        this.setSettingsByObject(json);
        this.setVars();
        this.addEvents();
    };

    thisHotelDescription.setVars = function ()
    {
        parent.setVars.call(this);
        thisHotelDescription.messageDiv = this.getById(this.messageDivId);
        thisHotelDescription.ajaxParams = { "hotelKey": this.hotelKey };
        thisHotelDescription.longDescription = SKYSALES.Util.decodeUriComponent(thisHotelDescription.longDescription);
        thisHotelDescription.addressDom = this.getById(this.addressId);
    };

    thisHotelDescription.updateShowHandler = function ()
    {
        thisHotelDescription.updateShow();
    };

    thisHotelDescription.updateShow = function ()
    {
        var message = "";
        if (this.longDescription.length === 0 && this.detailsAvailable === true)
        {
            this.sendHotelDescriptionRequest();
        }
        else
        {
            if (this.longDescription.length > 0)
            {
                message = this.longDescription;
            }
            else
            {
                message = this.noDescriptionAvailableMessage;
            }

            if (message.length > 0)
            {
                this.updateElement(message);
            }

            parent.updateShow.call(this);
        }
        var uriAddress = 'GetHotelAddressAjax-resource.aspx';
        var address = this.addressDom.text();
        if (!address)
        {
            $.get(uriAddress + '?hotelKey=' + this.hotelKey, this.updateAddressHandler);
        }
        
    };

    thisHotelDescription.sendHotelDescriptionRequest = function ()
    {
        var uriDesc = 'GetHotelDescriptionAjax-resource.aspx';
        window.open(uriDesc + '?hotelKey=' + this.hotelKey, "mywindow", "status=1,resizable=1,scrollbars=1,location=1,width=500,height=500");
    };
    
    thisHotelDescription.updateAddressHandler = function (data)
    {
        thisHotelDescription.updateAddress(data);
    };
    
    thisHotelDescription.updateAddress = function (data)
    {
        this.addressDom.html(data);
    };

    thisHotelDescription.updateElement = function (message)
    {
        if (message.length > 0)
        {
            this.messageDiv.html(message);
        }
        else
        {
            this.messageDiv.html(thisHotelDescription.noDescriptionAvailableMessage);
        }
    };

    thisHotelDescription.getHotelDescriptionHandler = function (data)
    {
        if (data.length > 0)
        {
            data = SKYSALES.Util.decodeUriComponent(data);
            thisHotelDescription.longDescription = data;
        }
        thisHotelDescription.updateElement(data);
        parent.updateShow.call(thisHotelDescription);
    };

    return thisHotelDescription;
};

$(document).ready(SKYSALES.Util.ready);

function showStatus(message) {
    if (message == null)
        message = '';
    window.status = message;
    return true;
}

function changeDest(o, d, dVal) {
    if (!document.images) {
        return;
    }
    if (!d) {
        alert("There's no DropDownDest!");
        return;
    }

    var dLabel = d.options[0].text;
    var oIx = window.parseInt(o.selectedIndex, 10);
    var dIx = 0;
    var name = '';

    if (oIx > 0) {
        var oVal = o.options[oIx].value;

        // clear and begin new destList
        d.length = 1;
        d.options[0] = new Option(dLabel, '');
        if (d.requiredempty) {
            d.options[0].value = d.requiredempty;
        }

        for (var i = 0; i < SortedStations.length; i++) {
            for (j = 0; j < Stations[oVal].mkts.length; j++) {
                var stnCode = Stations[oVal].mkts[j];
                if (Stations[stnCode]) {
                    if ((SortedStations[i] == stnCode) && (Stations[stnCode].validDest == true)) {
                        if (stnCode == dVal) { dIx = d.length; }

                        d.length += 1;
                        if (showStationCodes) {
                            name = Stations[stnCode].name + ' (' + stnCode + ')';
                        }
                        else {
                            name = Stations[stnCode].name;
                        }
                        d.options[d.length - 1] = new Option(name);
                        d.options[d.length - 1].value = stnCode;
                        break;
                    }
                }
            }

            if (d.length - 1 == Stations[oVal].mkts.length) { break; }
        }

        d.selectedIndex = dIx;
    }
    else {
        fillList(d, dVal);
    }
} // end changeDest

function fillList(d, dVal) {
    if (!d) {
        alert("There's no DropDownDest!");
        return;
    }
    var dLabel = d.options[0].text;

    if ((dVal == '') && (d.selectedIndex > -1)) {
        dVal = d.options[d.selectedIndex].value;
    }
    var dIx = 0;

    d.length = 1;
    d.options[0] = new Option(dLabel, dVal);
    if (d.requiredempty) {
        d.options[0].value = d.requiredempty;
    }

    var name = '';
    var i = 0;
    for (i = 0; i < SortedStations.length; i++) {
        stnCode = SortedStations[i];
        var station = Stations[stnCode];
        if (!station) {
            continue;
        }

        if (Stations[stnCode].validDest == true) {
            if (dVal == stnCode) {
                dIx = d.length;
            }
            d.length += 1;
            if (showStationCodes) {
                name = Stations[stnCode].name + ' (' + stnCode + ')';
            }
            else {
                name = Stations[stnCode].name;
            }
            d.options[d.length - 1] = new Option(name);
            d.options[d.length - 1].value = stnCode;
        }
    }

    d.selectedIndex = dIx;

} // end fillList
