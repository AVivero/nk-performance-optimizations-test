$(function() {
	WindowInitialize();
	$('#top-nav > li:first a').cluetip({
		closeText: '<img src="images/cross.png" alt="Close" />',
		topOffset: 20,
		leftOffset: -110,
		dropShadow: false,
		mouseOutClose: true,
		positionBy: 'fixed',
		showTitle: false,
		sticky: true,
		width: 200
	});
});
