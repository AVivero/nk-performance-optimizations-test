function footerStickyDefer(){if(window.jQuery){$banner=$("body > .banner");$footer=$("body > footer");$container=$("body > main.container, body > div.container");if($footer.length&&$container.length&&$banner.length){var e=parseInt($(window).outerHeight(true))-parseInt($footer.outerHeight(true));e=e-parseInt($banner.css("position")=="fixed"?0:$banner.outerHeight(true));if(e){$container.css("min-height",e)}}}else{setTimeout(function(){footerStickyDefer()},50)}}footerStickyDefer();