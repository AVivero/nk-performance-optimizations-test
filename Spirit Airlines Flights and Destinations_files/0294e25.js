$(document).ready(function(){
    $('#accordion').accordion({
      active: false,
      collapsible: true,
      heightStyle: "content"
    });

    // Set spacing to avoid widow countries
    $('.city+.country').prev('.city').css('margin-bottom', '1rem');
});
