/*
*
*   Requires:
*           <<NKCountries>>, which contains the list of countries obtained from the ResourcesCache
*           <<NKStateProvince>>, which contains the list of states obtained from the ResourcesCache
*
*/

/**
* CountryState Class
* For grouping country, state, and zip controls
* Creates a new instance of CountryState. 
*/
function CountryStateZip() {

    var stateTBKey = "stateTB";
    this.getStateTBKey = function () { return stateTBKey; };
    var stateDDKey = "stateDD";
    this.getStateDDKey = function () { return stateDDKey; };
    var countryKey = "country";
    this.getCountryKey = function () { return countryKey; };
    var zipKey = "zip";
    this.getZipKey = function () { return zipKey; };
    var zipTBKey = "TextBoxAvs__PostalCode";
    this.getZipTBKey = function () { return zipTBKey; };

    var fieldIDQueue = {};
    var requiredIDQueue = {};
    var initialValueQueue = {};

    function addField(key, fieldID, requiredID, initialValue) {
        fieldIDQueue[key] = fieldID;
        requiredIDQueue[key] = requiredID;
        initialValueQueue[key] = initialValue;
    };
    this.addField = addField;

    function getFieldID(key) {
        if (fieldIDQueue[key]) {
            return fieldIDQueue[key];
        }
        return "";
    };

    function getField(key) {
        var ID = getFieldID(key);
        if (ID != "") {
            return $("#" + ID);
        }
        return null;
    };

    function getRequiredID(key) {
        if (requiredIDQueue[key]) {
            return requiredIDQueue[key];
        }
        return "";
    };

    function getRequired(key) {
        var ID = getRequiredID(key);
        if (ID != "") {
            return $("#" + ID);
        }
        return null;
    };

    function getInitialValue(key) {
        if (initialValueQueue[key]) {
            return initialValueQueue[key];
        }
        return "";
    };

    function getFieldValue(key) {
        if (getField(key) != null) {
            return getField(key).val();
        }
        return "";
    };

    function setFieldValue(key, value) {
        if (getField(key) != null) {
            getField(key).val(value);
        }
        return "";
    };

    function useStateDD() {
        var country2 = getFieldValue(countryKey);
        if (country2 != undefined && country2 != null && country2 != "") {
            var country = NKCountries[country2];
            if (country != null) {
                if (NKCountries[country2].states.length > 0) {
                    return true;
                }
            }
        }
        return false;
    };

    function isRequired(key) {
        var boolReturn = false;
        switch (key) {
            case countryKey:
                boolReturn = true;
                break;
            case stateDDKey:
                if (useStateDD())
                    boolReturn = true;
                break;
            case stateTBKey:
                if (!useStateDD())
                    boolReturn = true;
                break;
            case zipKey:
                if (useStateDD())
                    boolReturn = true;
                break;
        }

        return boolReturn;
    };
    this.isRequired = isRequired;

    function loadCountries() {

        var jTargetCountry = getField(countryKey);
        //populate NKCountries DDL using <<NKCountries>>, which is a variable 
        //containing the list of NKCountries obtained from the ResourcesCache
        
        for (country in NKCountries) {
            jTargetCountry.addOption(country, NKCountries[country].name, false);
        }

        
        var selItem = getInitialValue(countryKey);

        if (selItem == undefined || selItem == null || selItem == "") {
            //jTargetCountry.val('US');
            // Bug # 10359
            var OptionDefaultText = currentCulture == 'es-PR' ? '-Seleccione-' : '-Select-';
            // Bug # 10687
            jTargetCountry.addOption('', OptionDefaultText, true);
            // Bug # 10687 Ends
        }
        else {
			if (selItem == "United States of America") {
				selItem = "US";
			}
            jTargetCountry.val(selItem);
            jTargetCountry.children("option[text=" + "'"+selItem + "'"+  "]").attr("selected", true);
              }
        
        //DecorateFields.populateSelectMask(jTargetCountry.closest(".field_select"));
    };

    function updateStates() {
        var targetState = getField(stateDDKey);
        var txtState = getField(stateTBKey);
        //clear all options from states DDL
        targetState.each(function () {
            this.innerHTML = "";
        });

        //populate states DDL only with the states corresponding to the country already selected
        //use <<NKStateProvince>>, which contains the list of states obtained from the ResourcesCache
        var country2 = getFieldValue(countryKey);

        if (country2 == "") {
            country2 = "US";
        }

        if (country2 == undefined || country2 == null || country2 == "") {
        //if (country2 == "") {
            return;
        }
        if (country2.length > 0) {

            var country = NKCountries[country2];
            if (country != null) {
                //add first element as balnk to opt the user's input 
                var OptionDefaultText = currentCulture == 'es-PR' ? '-Seleccione-' : '-Select-';
                targetState.addOption('', OptionDefaultText, false);
                for (var i = 0, j = NKCountries[country2].states.length; i < j; i++) {
                    var tmp = NKCountries[country2].states[i];
                    var state = NKStateProvince[tmp];
                    if (state.country == country2) {
                        targetState.addOption(tmp, state.name, false);
                    }
                }
            }
        }
    };

    function updateRequireds() {
        var stateRequired = getRequired(stateDDKey);
        var zipRequired = getRequired(zipKey);
        var stateDD = getField(stateDDKey);
        var stateTB = getField(stateTBKey);
        var zipTB = getField(zipTBKey);
        if (useStateDD()) {
            if (stateRequired != null)
                stateRequired.show();
            if (zipRequired != null)
                zipRequired.show();
            if (stateDD != null)
                stateDD.show();
            if (stateTB != null)
                stateTB.hide();
        }
        else {
            if (stateRequired != null)
                stateRequired.hide();
            if (zipRequired != null) {
                zipRequired.hide();
            }
            if (zipTB != null) {
                zipTB.val("");
            }
           if (stateDD != null)
                stateDD.hide();
            if (stateTB != null) {
                stateTB.show();
                stateTB.val("");
            }
        }
    };

    function init() {

        //initialize both the NKCountries and states DDLs
        loadCountries();
        updateStates();

        var selItem = getInitialValue(stateDDKey);
        var stateField = getField(stateDDKey);
        if (selItem != undefined && selItem != null && selItem != "" && stateField != null) {
            stateField.val(selItem);
            //DecorateFields.populateSelectMask(stateField.closest(".field_select"));

        }

        updateRequireds();

        var countryObject = getField(countryKey);
        countryObject.on('change', null,function () {
            updateStates();
            updateRequireds();
        });
    }

    $(document).ready(init);

};
