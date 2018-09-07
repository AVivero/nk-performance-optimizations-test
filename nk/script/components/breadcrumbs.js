$(document).ready(function () {
	$('.progress-bar').each(function () {
		var min = $(this).attr('aria-valuemin');
		var max = $(this).attr('aria-valuemax');
		var now = $(this).attr('aria-valuenow');
		var siz = (now - min) * 100 / (max - min);
		$(this).css('width', siz + '%');

		//update the circles
		$('.circle-sm').each(
			function (index,element) {
				if (index < now) {
					$(element).addClass("circle-sm-selected");
				}
			}
		);
	});
})
