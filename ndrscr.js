/* underscore shim 
 */
define( function( ){
	return {
		extend: function( ){
			var o = arguments[0] || { },
				l = arguments.length
			for( i=1; i < l ;i++ ){
				var obj = arguments[i]
				for( var k in obj){
				  if( obj.hasOwnProperty( k )){
				     o[k] = obj[k]
				  }
				}
			}
			return o
		},
		map: function( v, cb ){
			if( typeof v === 'object' ){
 				return Object.keys(v).map( function( k, vv ){
					return cb( v[k], k ); }) }},
		random: function( min, max ){
			if( max == null ){ max = min; min = 0; }
			return min + Math.floor( Math.random() * ( max - min + 1 )) },
		toArray: function( o ){ return  [].slice.call( o, 0 ) },
		isArray: function( o ){ return o instanceof Array },
		isFunction: function( o ){ 
			var g = {};
			return o&&g.toString.call(o)==='[object Function]' },
		isElement: function( o ){ return !!( o && o.nodeType === 1 ) },
 		isObject: function( o ){ 
			var type = typeof o; 
			return type === 'function' || type === 'object' && !!o }
	}
});
