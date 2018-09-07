/*  
===============================================================================  
Metaobjects is a jQuery plugin for associating metadata to DOM elements
...............................................................................                                                 
											   Copyright 2008 / Andrea Ercolino  
-------------------------------------------------------------------------------  
LICENSE: http://www.opensource.org/licenses/mit-license.php 
MANUAL:  http://noteslog.com/metaobjects/ 
===============================================================================  
*/ 

// when upgrading this file to 2008 version modified _value to use escapeValue and escapeRegex like previous version (2007)

( function($) { 
/**
 * Implement deep object extension by replacing the line 599 of jQuery-1.2.3.js
 * (commented out in this function)
 */
$.extend_deep = function() {
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

	if ( target.constructor == Boolean ) {
		deep = target;
		target = arguments[1] || {};
		i = 2;
	}

	if ( typeof target != "object" && typeof target != "function" )
		target = {};

	if ( length == 1 ) {
		target = this;
		i = 0;
	}

	for ( ; i < length; i++ )
		if ( (options = arguments[ i ]) != null )
			for ( var name in options ) {
				if ( target === options[ name ] )
					continue;
				if ( deep && options[ name ] && typeof options[ name ] == "object" && target[ name ] && !options[ name ].nodeType )
//					target[ name ] = jQuery.extend( target[ name ], options[ name ] );
					target[ name ] = $.extend_deep( true, target[ name ], options[ name ] );
				else if ( options[ name ] != undefined )
					target[ name ] = options[ name ];
			}
	return target;
};

$.metaobjects = function( options ) {  
	options = $.extend( { 
		  context:  document 
		, clean:    true 
		, selector: 'object.metaobject' 
	}, options ); 
 
    function escapeValue( value ) {
        if (value.match(/^'.*'$/)) {
            value = value.replace(/'/g, "\\'");
            value = value.replace(/^\\\'/, "'");
            value = value.replace(/\\\'$/, "'");
        }
        return value;
    }
    
    function escapeRegex( value ) {
        if (value.match(/^'.*'$/)) {
            value = value.replace(/^'/, "/");
            value = value.replace(/'$/, "/");
        }
        return value;
    }
 
	function _value( value, name ) { 
		if (name == "regex") {
           value = escapeRegex(value); 
        } else {
            value = escapeValue(value);
        }
        eval( 'value = ' + value + ";" );
        return value; 
	}

	function _object( name, value ) {
		//_object( 'a.b.c', value ) === { a: { b: { c: value } } }
		var names = name.split( '.' );
		var result = {};
		var current = result;
		for( var i = 0, iLast = names.length - 1; i <= iLast; i++ ) {
			if( names[i] ) {
				current = current[ names[i] ] = i == iLast ? value : {};
			}
		}
		return result;
	}
 
	return $( options.selector, options.context ) 
	.each( function() {  
		var settings = { target: this.parentNode, cache: false }; 
		$( '> param[name=metaparam]', this ) 
		.each( function() {  
			$.extend( settings, _value( this.value ) ); 
		} ); 
 
		$( '> param', this ) 
		.not( '[name=metaparam]' ) 
		.each( function() { 
			var name  = this.name;
			var value = _value( this.value, name ); 
			if( settings.cache ) {
				var rest  = name.split( '.' );
				var first = rest.shift();
				rest = rest.join( '.' );
				var mixed = rest ? _object( rest, value ) : value;
				$( settings.target ) 
				.each( function() { 
					var data = $.data( this, first );
					if( ! data ) {
						$.data( this, first, mixed );
					}
					else {
						$.extend_deep( true, data, mixed );
					}
				} );
			}
			else {
				$( settings.target ) 
				.each( function() { 
					$.extend_deep( true, this, _object( name, value ) );
				} );
			}
		} );
		if( options.clean ) { 
			$( this ).remove(); 
		} 
	} ); 
} 
} ) ( jQuery );
