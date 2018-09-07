window['adrum-start-time'] = new Date().getTime();
(function(config){
    config.appKey = 'AD-AAB-AAD-DRM';
    config.adrumExtUrlHttp = 'http://cdn.appdynamics.com';
    config.adrumExtUrlHttps = 'https://cdn.appdynamics.com';
    config.beaconUrlHttp = 'http://col.eum-appdynamics.com';
    config.beaconUrlHttps = 'https://col.eum-appdynamics.com';
    config.xd = {enable : false};
})(window['adrum-config'] || (window['adrum-config'] = {}));
if ('https:' === document.location.protocol) {
    document.write(unescape('%3Cscript')
 + " src='https://cdn.appdynamics.com/adrum/adrum-4.3.3.0.js' "
 + " type='text/javascript' charset='UTF-8'" 
 + unescape('%3E%3C/script%3E'));
} else {
    document.write(unescape('%3Cscript')
 + " src='http://cdn.appdynamics.com/adrum/adrum-4.3.3.0.js' "
 + " type='text/javascript' charset='UTF-8'" 
 + unescape('%3E%3C/script%3E'));
}