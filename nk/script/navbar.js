(function(){

	function centerLogo(qry){
		if(!qry.matches){
			var $nav = $('#navLogo');
			$nav.offset({left:0});
			$nav.css('position', 'static');
			return;
		}

		var $tog = $('#navToggle');
		var $nav = $('#navBar');
		var $logo = $('#navLogo');

		var $link = $('#loginlink');
		if ($link.length == 0)
			$link = $('li.visible-xs.mobile-account i.fa.fa-user').parent();

		var wNav = $nav.width();
		var wTog = $tog.width();
		var wLogo = $logo.width();
		var wLink = $link.width();

		var elements = [$tog, $nav, $logo, $link];
		var values = [wTog, wNav, wLogo, wLink];

		for (var i = 0; i < 4; i++) {
			if (elements[i].length != 1 || !(values[i] > 0))
				return;
		}

		var offset = ((wNav + wTog - wLink - wLogo) / 2) + $tog.offset().left;
				
		$logo.offset({left: offset});
	}
			
	var mobileQry = window.matchMedia('(max-width: 767px)');
				
	$(document).ready(function(){
		centerLogo(mobileQry);
		$('#navLogo > img').removeClass('logo-mobile-invisible');
	});
				
	mobileQry.addListener(centerLogo);

})();	