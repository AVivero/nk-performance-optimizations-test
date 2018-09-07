function StationSearch(obj) {
    "use strict";

    // HTML elements
    var $target = $(obj),
        nameInput = $target.find('.station_name').first(),
        codeInput = $target.find('.station_code').first(),
        autoCompleteBox = $target.find('.station_auto_complete').first(),
        stationsBox = $target.find('.station_list').first(),
        macList = stationsBox.find('.macs').first(),
        stationList = stationsBox.find('.stations').first(),
        dependent = [];
    if ($target.attr('id') != "") {
        dependent = $('[childto="' + $target.attr('id') + '"]');
    }
    var isIE7 = $('html').hasClass('ie7');

    // State vars
    var defaultMac = "NA";
    var mode = "list"; // or "search"
    var visible = false;
    var active = false;
    var prevSearch = "";
    var currentMac = "";

    // Close function
    function closeStationsBox() {
        //console.log("closeStationsBox()");
        stationsBox.hide();
        if (isIE7) {
            $target.css('position', 'static');
        }
    };
    this.closeStationsBox = closeStationsBox;
    function closeAutoCompleteBox() {
        //console.log("closeAutoCompleteBox()");
        autoCompleteBox.hide();
        if (isIE7) {
            $target.css('position', 'static');
        }
    };
    this.closeAutoCompleteBox = closeAutoCompleteBox;
    function closeAll() {
        closeStationsBox();
        closeAutoCompleteBox();
        mode = "list";
        $('body').unbind('mouseup', closeAll);
    };
    this.closeAll = closeAll;

    function setMac(code) {
        //console.log("setMac called with Mac = " + code);
    }
    this.setMac = setMac;
    function setMacFromObj(event) {
        setMac($(this).prop('mac'));
    };
    this.setMacFromObj = setMacFromObj;
    function setStation(code) {
        //console.log("setStation() to " + code);
        closeAll();
        var stationObj = stations[code];
        nameInput.val(stationObj.Name + " - " + stationObj.Station);
        codeInput.val(stationObj.Station);

        //console.log('dependent check: ' + dependent.length);
        if (dependent.length > 0) {
            var currcode = codeInput.val();
            dependent.each(function () {
                var $this = $(this),
                    name = $this.find('.station_name').first(),
                    hiddenCode = $this.find('.station_code').first(),
                    hiddenVal = hiddenCode.val(),
                    isValid = false;
                if (currcode != "") {
                    //console.log("current code: " + currcode);
                    var stList = markets[currcode];
                    for (var i = 0, j = stList.length; i < j; i++) {
                        var itmCode = stList[i];
                        //console.log("compare codes: " + itmCode + " - " + hiddenVal);
                        if (itmCode === hiddenVal) {
                            //console.log('valid child station');
                            isValid = true;
                            break;
                        }
                    }
                }
                if (!isValid) {
                    //console.log('invalid child station');
                    name.val("").trigger("blur");
                    hiddenCode.val("");
                }
            });
        }
        AdjustPaxNumbers();
    };
    this.setStation = setStation;
    function setStationFromObj(event) {
        var target = event.target;
        if (target.nodeName !== "LI") {
            target = target.parentNode;
        }
        setStation($(this).attr('station'));
    };
    this.setStationFromObj = setStationFromObj;

    function populateListMode(obj) {
        populateStationList(obj);
    };
    function populateSearchMode(obj) {
        populateAutoComplete(obj);
    };

    function showStationList() {
        //console.log("showStationList()");
        mode = "list";
        stationsBox.show();
        if (isIE7) {
            $target.css('position', 'relative');
        }
    };
    function showSearchBox() {
        //console.log("showSearchBox()");
        mode = "search";
        autoCompleteBox.show();
        if (isIE7) {
            $target.css('position', 'relative');
        }
    };

    function showMoreInfo() {
        $('body').unbind('mouseup', closeAll);
        if (mode == "list") {
            closeAutoCompleteBox();
            populateListMode(nameInput[0]);
            showStationList();
        } else {
            closeStationsBox();
            populateSearchMode(nameInput[0]);
            showSearchBox();
        }
        prevSearch = nameInput.val();
    };
    this.showMoreInfo = showMoreInfo;

    function setStationFocus(obj) {
        var $target = $(obj);
        autoCompleteBox.find('li').not(obj).removeClass("selected");
        $target.addClass("selected");
        //console.log($target.text());
    };
    this.setStationFocus = setStationFocus;
    function setStationFocusEvent(event) {
        setStationFocus(this);
    };
    function getFocusedStation() {
        var selectedItm = autoCompleteBox.find('li.selected').first();
        //console.log("Current selected station: " + selectedItm.prop('station'));
        return selectedItm;
    };

    function init() {
        macList.delegate('li', 'click', setMacFromObj);
        stationList.delegate('li', 'click', setStationFromObj);
        autoCompleteBox.delegate('li', 'click', setStationFromObj);
        autoCompleteBox.delegate('li', 'hover', setStationFocusEvent);

        nameInput.bind({
            blur: function () {
                if (!active) {
                    if (mode === "search") {
                        setStation(getFocusedStation().attr('station'));
                        //alert('tab is hit');
                    }
                    closeAll();
                }
                if ($.trim(this.value) === "") { codeInput.val(''); }
            },
            focus: function () {
                mode = (this.value.length > 1 ? "search" : "list");
                showMoreInfo();
                autoCompleteBox.scrollTop(0);
            },
            keydown: function (e) {
                if (this.value.length > 1 && prevSearch == this.value && mode === 'search') {
                    var key = e.keyCode;
                    if (key === 38 || key === 40 || key === 13) {
                        e.preventDefault();
                    }
                    if (key === 38) {// pressing up
                        var focus = getFocusedStation();
                        if (focus.index() != 0) {
                            focus = focus.prev();
                        }
                        setStationFocus(focus);
                        var scrollHeight = focus.position().top;
                        autoCompleteBox.scrollTop(scrollHeight);
                        return false;
                    } else if (key === 40) {// press down
                        var focus = getFocusedStation();
                        if (!focus.is(":last-child")) {
                            focus = focus.next();
                        }
                        setStationFocus(focus);
                        //focus[0].scrollIntoView(false);
                        var scrollHeight = focus.position().top + focus.outerHeight();
                        if (scrollHeight > autoCompleteBox.outerHeight()) {
                            //console.log("height" + scrollHeight);
                            autoCompleteBox.scrollTop(autoCompleteBox.find('ul').first().outerHeight());
                        }
                        return false;
                    } else if (key === 13) {// pressing enter
                        e.stopPropagation();
                        setStation(getFocusedStation().attr('station'));
                        closeAll();
                        return false;
                    } else if (key === 9) {// pressing tab
                        e.stopPropagation();
                        setStation(getFocusedStation().attr('station'));
                        closeAll();
                    }
                }
            },
            keyup: function (e) {
                if ((mode === "list" || this.value.length < 2 || prevSearch != this.value) && e.keyCode != 13) {
                    mode = (this.value.length > 1 ? "search" : "list");
                    //console.log("mode: " + mode);
                    showMoreInfo();
                }
            }
        });

        stationsBox.hover(function () {
            //console.log("hover on");
            active = true;
            $('body').unbind('mouseup', closeAll);
        }, function () {
            //console.log("hover off");
            active = false;
            $('body').unbind('mouseup', closeAll);
            $('body').bind('mouseup', closeAll);
        });
        autoCompleteBox.hover(function () {
            //console.log("hover on");
            active = true;
            $('body').unbind('mouseup', closeAll);
        }, function () {
            //console.log("hover off");
            active = false;
            $('body').unbind('mouseup', closeAll);
            $('body').bind('mouseup', closeAll);
        });
    };

    init();
};

var defaultMac = "NA";
var currMac = "";
var filteredStations = {};
var filteredMarket = "";
function filterStationList(stationCode) {
    var filterCodes = markets[stationCode];
    //console.log(filterCodes);
    filteredMarket = stationCode;
    filteredStations = {};
    for (var i = 0, j = filterCodes.length; i < j; i++) {
        var market = filterCodes[i];
        if (stations[market]) {
            filteredStations[market] = stations[market];
        }
    }
    return filteredStations;
};
function buildStationList(stationObj) {
    var stationData = stationObj;
    var stationsFrag = document.createDocumentFragment();
    var count = 0;
    for (itm in stationData) {
        var itmInfo = stationData[itm];
        if (itmInfo.MAC == currMac) {
            var obj = document.createElement('li');
            obj.innerHTML = "<span class='name'>" + $.trim(itmInfo.Name) + " <span class='sep'>-</span></span> " + itmInfo.Station;
            $(obj).attr('station', itmInfo.Station);
            $(obj).attr('mac', itmInfo.MAC);
            //obj.station = itmInfo.Station;
            //obj.mac = itmInfo.MAC;
            stationsFrag.appendChild(obj);
            count++;
        }
    }
    var stationList = document.createElement('ul');
    stationList.appendChild(stationsFrag);

    if (!Modernizr.csscolumns) {
        var columnFrag = document.createElement('div');
        var colsize = Math.ceil(count / 3);  // (count <= 6 ? count : Math.ceil(count / 3));
        var colcount = 3; // (count <= 6 ? 1 : 3);
        for (var i = 0, j = colcount; i < j; i++) {
            var stationCol = document.createElement('ul');
            for (var k = 0, l = colsize; k < l; k++) {
                if (stationList.hasChildNodes()) {
                    var node = stationList.firstChild;
                    stationCol.appendChild(node.cloneNode(true));
                    stationList.removeChild(node);
                }
            }
            columnFrag.appendChild(stationCol);
        }
        return columnFrag;
    }
    return stationList;
};
function populateStationList(obj) {
    //clearStationLists(true);
    var $this = $(obj);
    var $listParent = $this.closest('li').find('.station_list').first(),
        $tabs = $listParent.children().first(),
        $stations = $listParent.children().last();
    $tabs.html("");
    $stations.html("");
    var macsFrag = document.createDocumentFragment();
    var cnt = 0;
    var macOrder = ['NA', 'CA', 'SA'];
    for (var i = 0, j = macOrder.length; i < j; i++) {
        var itmInfo = macs[macOrder[i]];
        var macCode = itmInfo.Code;
        var obj = document.createElement('li');
        obj.innerHTML = itmInfo.Name;
        obj.mac = macCode;
        if ((currMac === "" && defaultMac === macCode) || currMac === macCode) {
            obj.className = "active";
            currMac = macCode;
        }
        macsFrag.appendChild(obj);
    }
    $tabs.append(macsFrag);
    var stationData = stations;
    var filterby = $listParent.attr('filterby');
    if (filterby && filterby != "") {
        if ($('#' + filterby).val() != "") {
            //console.log(filterby + ": " + $('#' + filterby).val());
            stationData = filterStationList($('#' + filterby).val());
        }
    } else {
        stationData = filteredStations = stations;
    }
    $stations.append(buildStationList(stationData));
    $listParent.show();
    //$stations.find('li').not('[mac="' + currMac + '"]').hide();
    if ($('html').hasClass('ie7')) {
        $listParent.closest('li').css('position', 'relative');
    }
};
function hideStationList(obj) {
    //console.log("hideStationList called");
    var $this = $(obj);
    var $listParent = $this.closest('li').find('.station_list').first();
    if ($listParent.prop('activeuse') != "true") {
        $listParent.hide();
        $(this).unbind('mouseup', clearStationLists);
        if ($('html').hasClass('ie7')) {
            $this.closest('li').css('position', 'static');
        }
    }
};
function clearStationLists(boolClearAll) {
    //console.log("clearStationLists called");
    var forceClear = (boolClearAll != null ? boolClearAll : false);
    $('.station_list:visible').each(function () {
        var $this = $(this);
        if ($this.prop('activeuse') != 'true' || forceClear) {
            $this.hide();
            if ($('html').hasClass('ie7')) {
                $this.closest('li').css('position', 'static');
            }
        }
    });
    $(this).unbind('mouseup', clearStationLists);
};
function clearAutoStationLists(obj) {
    $('.station_auto_complete:visible').not(obj).each(function () {
        var $this = $(this);
        $this.hide();
    });
};
function populateAutoComplete(obj) {
    var val = obj.value.toLowerCase();
    while (val.indexOf("  ") > -1) {
        val = val.replace("  ", " ");
    }
    val = $.trim(val);
    var $autoComplete = $(obj).closest('li').find('.station_auto_complete').first();
    $autoComplete.html("");
    var stationsFrag = document.createDocumentFragment();
    var fragCnt = 0;

    var stationData = stations;
    var filterby = $autoComplete.attr('filterby');
    if (filterby && filterby != "") {
        if ($('#' + filterby).val() != "") {
            //console.log(filterby + ": " + $('#' + filterby).val());
            stationData = filterStationList($('#' + filterby).val());
        }
    }

    for (itm in stationData) {
        var itmInfo = stationData[itm];
        var itmStation = itmInfo.Station;
        var itmName = itmInfo.Name;
        var itmLabel = $.trim(itmName) + " - " + itmStation;
        if (itmStation.toLowerCase().indexOf(val) == 0 || itmName.toLowerCase().indexOf(val) > -1 || itmLabel.toLowerCase().indexOf(val) > -1) {
            var obj = document.createElement('li');
            obj.innerHTML = "<span class='name'>" + itmName + "</span> <span class='sep'>-</span> " + itmStation;
            $(obj).attr("station", itmStation);
            $(obj).attr("mac", itmInfo.MAC);
            if (fragCnt === 0) { obj.className = "selected"; }
            stationsFrag.appendChild(obj);
            fragCnt++;
        }
    }
    if (fragCnt === 0) {
        var obj = document.createElement('li');
        obj.innerHTML = "No matches found";
        obj.classname = "selected";
        stationsFrag.appendChild(obj);
        $autoComplete.addClass('no_stations');
    } else {
        $autoComplete.removeClass('no_stations');
    }
    var stationList = document.createElement('ul');
    stationList.appendChild(stationsFrag);
    $autoComplete.append(stationList);
};

$('.station_list').on('click', '.macs li', function (event) {
	var $this = $(this),
		$parent = $this.closest('.macs').first();
	currMac = this.mac;
	$parent.children().removeClass('active');
	this.className = 'active';
	$parent.siblings('.stations').html('');
	var stationData = filteredStations;
	var filterby = $this.closest('.station_list').attr('filterby');
	if (filterby && filterby != "") {
		if ($('#' + filterby).val() != "") {
			//console.log(filterby + ": " + $('#' + filterby).val());
			stationData = filterStationList($('#' + filterby).val());
		}
	} else {
		stationData = filteredStations = stations;
	}
	$parent.siblings('.stations').append(buildStationList(stationData));
})

// Station Search Logic using a Select 
function StationSearchBySelect(fromObj, toObj, typeObj/* optional */) {
    // variables
    var from, $from, to, $to, $type, hasType;
    if (fromObj instanceof jQuery) {
        from = fromObj[0];
        $from = fromObj;
    } else {
        from = fromObj;
        $from = $(fromObj);
    }
    if (toObj instanceof jQuery) {
        to = toObj[0];
        $to = toObj;
    } else {
        to = toObj;
        $to = $(toObj);
    }
    if (typeObj) {
        $type = (typeObj instanceof jQuery) ? typeObj : $(typeObj);
        hasType = true;
    } else {
        hasType = false;
    }

    function createStationOption(code, label) {
        var option = document.createElement("option");
        option.value = code;
        var txt = label + " (" + code + ")";
        option.appendChild(document.createTextNode(txt));

        return option;
    }
    function getBookingType() {
        return hasType ? $type.val() : "F";
    }
    function populateStation(obj, filterArray/*= optional */) {
        var frag = document.createDocumentFragment();
        var $obj = $(obj);
        var prevVal = obj.value;
        var prevIndex = obj.selectedIndex;
        var bookingType = getBookingType();
        var stationsList = stations;

        // Flight Status widget displays stations without aliases or AREA part
        if ($obj.attr("id") == "statusDepartCitySelect" || $obj.attr("id") == "statusDestCitySelect")
        {
            stationsList = stationsNoAreas;
        }
        
        var isTo = false;
        if (obj!=null && $obj.attr("name")=="to" ) {
            isTo = true;
        }

        // remove existing options
		var areThereStations = $obj.children().not(':first-child');
		if (areThereStations.length > 0) {
			$obj.children().not(':first-child').remove();
		}

        // create updated options
        if (filterArray) {
            for (var i = 0, j = filterArray.length; i < j; i++) {
                var itm = filterArray[i];
                frag.appendChild(createStationOption(itm.Station, itm.Name));
            }
        } else {
            for (key in stationsList) {
                var itm = stationsList[key];
                if (!(typeof (enableFPOSale) === 'undefined') && (enableFPOSale == true && (bookingType === "FH" || bookingType === "FHC"))) {
                    frag.appendChild(createStationOption(itm.Station, itm.Name));
                }
                else if (bookingType === "F" || bookingType === "FC" || (isTo || itm.IsInternational === false) || domesticStationExceptionList.indexOf(itm.Station) >= 0 ) { // only sell packages from domestic excluding Flight and Flight + Car
                    frag.appendChild(createStationOption(itm.Station, itm.Name));
                }
            }
        }
        // apply updated options
        obj.appendChild(frag);
        if (prevIndex != 0) {
            $obj.val(prevVal);
        } else {
            obj.selectedIndex = 0;
        }
    }
    function updateToStations(obj, code) {
        var filterArray;
        if (code != "") {
            var $obj = $(obj);
            var marketList = markets[code];
            var bookingType = getBookingType();
            var bookingTypes = (bookingType === undefined) ? "F" : getBookingType();
            filterArray = [];
            var fpoMarketList = null;
            if (!(typeof (enableFPOSale) === 'undefined') && (enableFPOSale == true) && (bookingTypes === "FHC" || bookingTypes === "FH") && stations[code].IsInternational == true) {
                fpoMarketList = foreignPointOriginStationList.split(",");
            }
            if (fpoMarketList != null) {
                if (marketList!=null) {
                    marketList=_.intersection(marketList, fpoMarketList);
                }
            }
            for (var i = 0, j = marketList.length; i < j; i++) {
                var stationCode = marketList[i];
                var stationObj = stations[stationCode];
                if ($obj.attr("id") == "statusDepartCitySelect" || $obj.attr("id") == "statusDestCitySelect") {
                    stationObj = stationsNoAreas[stationCode];
                }
                if ((bookingTypes === "F") 
                || (bookingTypes !== "FC" && stationObj.HasHotel)
                || (bookingTypes === "FC" && !stationObj.IsInternational) ) { // only sell package if there is a hotel at destination
                    //In case of FHC or FC flow: don't add station if no cars available
                	if ((bookingTypes === "FHC" || bookingTypes === "FC") && !stationObj.HasCar)
                        continue;

                    filterArray.push(stationObj);
                    if (stationObj.Aliases != null && stationObj.Aliases.length > 0) {

                        for (var k = 0; k < stationObj.Aliases.length; k++) {
                            var aliasStationObj = stations[stationObj.Aliases[k]];
                            filterArray.push(aliasStationObj);
                        }
                    }
                }
            }
        }

        if (filterArray)
            filterArray = filterArray.sort(stationNameSort);

        populateStation(to, filterArray);
    }
    function stationNameSort(a, b) {
        if (a.Name > b.Name) {
            return 1;
        } else {
            return -1;
        } 
    }

    function setFromStation(code) {
        $from.val(code);
        updateToStations($from, code);
    }
    this.setFromStation = setFromStation;

    function setToStation(code) {
        $to.val(code);
    }
    this.setToStation = setToStation;

    function init() {
        // fill in selects
        populateStation(from);
        populateStation(to);
        
        // event bindings here
        $from.bind({
            change: function () {
                updateToStations($from, this.value);
            }
        });
        $to.bind({
            change: function () {
                // do i need this?
            }
        });
    }
    this.init = init;
    init();
}

