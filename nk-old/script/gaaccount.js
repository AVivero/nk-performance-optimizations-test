var strURL = window.location.hostname;
var gaLocalHostEnabled = false;
if (strURL.search(/local/i) >= 0) {
    window.gaccount = "UA-206943-4";
    gaLocalHostEnabled = true;
    window.gtagaccount = 'GTM-588HNM2';
}
else if (strURL.search(/dev.spirit.com/i) >= 0 || strURL == 'localhost' || strURL.search(/miadweb01/i) >= 0 || strURL.search(/dev/i) >= 0 || strURL.search(/local/i) >= 0) {
    window.gaccount = "UA-206943-4";
    gaLocalHostEnabled = true;
    //window.gtagaccount = "GTM-KCQSS3";
    window.gtagaccount = 'GTM-588HNM2';
}
else if (strURL.search(/qa.spirit.com/i) >= 0) {
    //window.gaccount = "UA-206943-5";
    //window.gtagaccount = "GTM-KCQSS3";
    window.gaccount = "UA-206943-4";
    window.gtagaccount = 'GTM-588HNM2';
}
else if (strURL.search(/staging.spirit.com/i) >= 0) {
    //window.gaccount = "UA-206943-6";
    //window.gtagaccount = "GTM-KCQSS3";
    window.gaccount = "UA-206943-4";
    window.gtagaccount = 'GTM-588HNM2';
}
else {
    window.gaccount = "UA-206943-1";
    window.gtagaccount = "GTM-KLL8ZL";
}
//UA-206943-1 = www.spirit.com
//UA-206943-4 = dev.spirit.com
//UA-206943-5 = qa.spirit.com