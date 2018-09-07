var ccCountry = new Array();
var ccState = new Array();
var ccStateTB = new Array();
var divStateDDL = new Array();
var divStateTXT = new Array();
var selectedCountry = new Array();
var selectedState = new Array();
var selectedPostalZipCode = new Array();

var initializeCountriesInit = false;
function initializeCountries() {
    //gps optimize dont recall
    if (initializeCountriesInit) {
        return;
    }
    initializeCountriesInit = true;
    for (var i = 0, j = ccCountry.length; i < j; i++) {
        var ccCountryItem = $(ccCountry[i]);
        //console.log(ccCountryItem.prop('name') + "<-- this guy");
        ccCountryItem.attr("stateDDL", ccState[i]);
        ccCountryItem.attr("stateTXT", ccStateTB[i]);
        //console.log(ccCountryItem.prop('stateTXT') + "<-- this guy");
        ccCountryItem.attr("divStateDDL", divStateDDL[i]);
        ccCountryItem.attr("divStateTXT", divStateTXT[i]);
        ccCountryItem.prop("selectedItem", trim(selectedCountry[i]));
        ccCountryItem.attr("selectedState", trim(selectedState[i]));
        ccCountryItem.attr("selectedPostalZipCode", selectedPostalZipCode[i]);

        //initialize both the NKCountries and states DDLs
        loadCountriesWith(ccCountry[i]);
        updateStateWith(ccCountry[i]);

        ccCountryItem.change(function () {
            updateStateWith($(this));
        });

        if (navigator.userAgent.indexOf('Safari') != -1) {
            $(".passenger-info .main-info select").css("width", "165px");
            $(".passenger-info .main-info select").css("margin", "0px 0px 0px;");
        }
    }
}

function loadCountriesWith(targetCountry) {

    var jTargetCountry = $(targetCountry);
    //populate NKCountries DDL using <<NKCountries>>, which is a variable 
    //containing the list of NKCountries obtained from the ResourcesCache
    
    for (country in NKCountries) {        
        jTargetCountry.addOption(country, NKCountries[country].name, false);
    }

    // Bug # 10687
    var selItem = jTargetCountry.prop("selectedItem");    

    if (selItem == undefined || selItem == null || selItem == "") {
        //jTargetCountry.prop("selectedItem", 'US');
        //jTargetCountry.val('US');
        var inputTextsAddress = $(":input[id*='TextBoxAddressLine1']");
        var inputTextsCity = $(":input[id*='TextBoxCity']");
        var inputTextsPostalCode = $(":input[id*='TextBoxPostalCode']");
        var inputTextsPhone = $(":input[id*='TextBoxHomePhone']");
        if (inputTextsAddress.val() == "" && inputTextsCity.val() == "" && inputTextsPostalCode.val() == "" && inputTextsPhone.val() == "") {
            jTargetCountry.prop("selectedItem", 'US');
            jTargetCountry.val('US');
        }
        // Bug # 10359
        var OptionDefaultText = currentCulture == 'es-PR' ? '-Seleccione-' : '-Select-';
        // Bug # 10687
        jTargetCountry.addOption('', OptionDefaultText, false);
        // Bug # 10687 Ends
    }
    else {
        jTargetCountry.val(jTargetCountry.prop("selectedItem"));        
        }

    // Bug # 10687 Ends
  
    var inputTextsCountries = $(":input[id*='TextBoxCountry']");
    if (inputTextsCountries.length > 0) inputTextsCountries.val(jTargetCountry.val());
    
}

function updateStateWith(sourceCountry) {
    //debugger;
    var $sourceCountry = $(sourceCountry);
    var targetState = $sourceCountry.attr("stateDDL"),
        $targetState = $(targetState);
    var txtState = $sourceCountry.attr("stateTXT");

    //clear all options from states DDL
    $targetState.each(function () {       
        this.innerHTML = "";
    });

    //populate states DDL only with the states corresponding to the country already selected
    //use <<NKStateProvince>>, which contains the list of states obtained from the ResourcesCache
    var country2 = $sourceCountry.val();
    // Bug # 10687
    if (country2 == "") {
        country2 = "US";
    }
    // Bug # 10687 Ends
    if (country2 == null) {
        return;
    }
    if (country2.length > 0) {
        var country = NKCountries[country2];
        if (country != null) {
            //add first element as blank value to opt user input
            var OptionDefaultText = currentCulture == 'es-PR' ? '-Seleccione-' : '-Select-';
            $targetState.addOption('', OptionDefaultText, false);
            for (var i = 0, j = NKCountries[country2].states.length; i < j; i++) {
                var tmp = NKCountries[country2].states[i];
                var state = NKStateProvince[tmp];
                if (state.country == country2) {
                    $targetState.addOption(tmp, state.name, false);
                }
            }
        }
    }

    var divStateDDL = $sourceCountry.attr("divStateDDL"),
        divStateReqStar = divStateDDL + "_req";
    var divStateTXT = $sourceCountry.attr("divStateTXT");
    var zipControl = $sourceCountry.attr("selectedPostalZipCode"),
        zipReqStar = zipControl + "_req";
    var targetsStates = $targetState;

    //only if States DDL is empty (no option elements were added except blank as '-select-'), display textbox for State
    //hide/show divs accordingly
    if (targetsStates.length == 0 || targetsStates[0].options.length == 1) {
        $(divStateDDL).hide();
        $(divStateTXT).show();
        $(divStateReqStar).css('visibility', 'hidden');
        $(zipReqStar).css('visibility', 'hidden');
        $targetState.prop("required", false);
        $(zipControl).prop("required", false);
        //$(zipControl).removeProp("required");
        $(txtState).val($sourceCountry.attr("selectedState"));

        //gps update for new look
        $("#state_req_icon, #zip_req_icon").css('visibility', 'hidden');
        //$("Select[id*='_DropDownListState']").css("display", "none");
       // $("select#LoginAgentAgentTabGroup_LoginAgentRegisterAgencyGroup_LoginAgentAgencyInput_DropDownListState").css("display", "none");
        //$("div#foreignProvince").css("display", "block").children("input").val("");

    }
    else {
        $targetState.show();
        $(divStateDDL).show();
        $(divStateReqStar).css('visibility', 'visible');
        $(zipReqStar).css('visibility', 'visible');        
        $targetState.prop("required", true);
        $(zipControl).prop("required", true);
        $targetState.val($sourceCountry.attr("selectedState"));
        $(txtState).val('');
        $(divStateTXT+',.bubble').hide();

        $("#state_req_icon, #zip_req_icon").css('visibility', 'visible');
        //$("select#LoginAgentAgentTabGroup_LoginAgentRegisterAgencyGroup_LoginAgentAgencyInput_DropDownListState").show();
    }
};

function trim(text) {
    if (String.prototype['trim']) { // some browsers natively have a trim function
        return text.trim();
    }
    return text.replace(/^\s+|\s+$/g, "");
};

function primarydropdown_ie7() {
    if ($.browser.msie && $.browser.version === "7.0") {
        $("select.primarydriver_class")
        .bind('focus mouseover', function () {
            var exceedcharlength = false;
            $("select.primarydriver_class option").each(function () {
                var optiontext = $(this).text();                
                if (optiontext.length > 40) {
                    exceedcharlength = true;
                }
            });
            if (exceedcharlength == true) {
                $(this).addClass('expand').removeClass('clicked');
            }
        })
        .bind('click', function () { $(this).toggleClass('clicked'); })
        .bind('mouseout', function () { if (!$(this).hasClass('clicked')) { $(this).removeClass('expand'); } })
        .bind('blur', function () { $(this).removeClass('expand clicked'); });        
    }
};