/************************************************
* jQuery spirit_popup
* 
* @author Anthony Carcelli
* Construction is simply $(<selector>).spirit_popup
* Options: parent, selector, left, bottom, width, classname
*************************************************/
jQuery.fn.spirit_popup = function (data) {


    contentWidth = $('#content').width();
    contentOffset = $('#content').offset();
    contentOffset = contentOffset.left;

    fiftyPercent = contentOffset + contentWidth / 2;

    $(this).hover(

		function (e) {

		    var $this = $(this);
		    thisOffset = $this.offset();
		    thisOffset = thisOffset.left;

		    $this.css({
		        position: 'relative',
		        overflow: 'visible',
		        zIndex: 100
		    });

		    if (data.parent) $this = $this.parents(data.parent);

		    var $selector = (data.selector) ? data.selector : '.popup_content';
		    $left = (data.left) ? data.left : '-25px';
		    $height = $this.height();
		    $bottom = (data.bottom) ? data.bottom : $height + 'px';
		    $width = (data.width) ? data.width : '374px';
		    $class = (data.classname) ? ' ' + data.classname : '';

		    if (fiftyPercent < (thisOffset + 100)) {
		        if ($this.parents("section").hasClass("logos")) {
		            $class += ' logo_arrow_right';
		        } else {
		            $class += ' arrow_right';
		        }
		    }

		    //alert($(this).find(data.selector).html());

		    var popup_html = '<div class="popup' + $class + '">' +
			                 '	<div class="downarrow border"></div>' +
											 '	<div class="downarrow"></div>' +
											 '	<div class="popup_container">' +
											 '		<a class="close">X</a>' +
											 			$this.children($selector).html() +
											 '	</div>' +
											 '</div>';

		    $this.append(popup_html);

		    $('.popup').css({
		        left: $left,
		        bottom: $bottom,
		        width: $width
		    })
								 .fadeIn(100);
		},
		function (e) {

		    $('.popup').hide().remove();
		    $(this).css({ zIndex: '' });

		}
	);

}