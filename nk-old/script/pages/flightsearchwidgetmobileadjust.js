$(document).ready(function () {

	function movePromoCodeToContainer(container) {
		if (EnablePackagePromoCode) {
			var promo = $('#promoCodeCollapsible').detach();
			container.append(promo);
		}
	}

	$('.book-flight-tab a[href="#book-travel-tab"]').click(function () {
		movePromoCodeToContainer($('#onewayPromoContainer'));
		$('#promoCodeCollapsible').show();
	});

	$('.book-vacation-tab a[href="#book-travel-tab"]').click(function () {
		movePromoCodeToContainer($('#onewayPromoContainer'));
		$('#promoCodeCollapsible').show();
	});

	$('.book-car-tab a[href="#book-travel-tab"]').click(function () {
		$('#promoCodeCollapsible').hide();
	});

	$('.book-hotel-tab a[href="#book-travel-tab"]').click(function () {
		movePromoCodeToContainer($('#hotelAdultChildPromo'));
		$('#promoCodeCollapsible').show();
	});

	$('body').on('click', 'input[name="tripType"]', function () {
		switch (this.value) {
			case 'roundTrip':

				$('#departdateli').removeClass('col-xs-12').addClass('col-xs-6');
				movePromoCodeToContainer($('#onewayPromoContainer'));

				break;
			case 'oneWay':

				$('#departdateli').removeClass('col-xs-6').addClass('col-xs-12');
				movePromoCodeToContainer($('#onewayPromoContainer'));

				break;
			case 'multiCity':

				$('#departdateli').removeClass(['col-xs-6', 'col-xs-12']);
				movePromoCodeToContainer($('#multiPromoContainer'));

				break;
			default:
		}
	});

})