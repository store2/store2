define( ['./ndrscr','./dom'],function( _, dom ) {

	var debug = function( a, d ) { console.log([a,d]) };
	var register = { }, history = [ ], history_i = 0;

	dom.cmd = function( ){
		var el = dom.c( 'input', { 
			type: 'text',
			maxlength: 255,
			className: 'cmd hide',
			on:{
				'keyup':function( e ){
					if( !e ){ e = window.event; }
					//debug( 'keydown', e.which );
					if( e.which == 13 ){
						e.preventDefault();
						ex( el.value );
						el.value = ''; }
					else if( e.which == 0 ){
						compl( el.value ); }
					else if( e.which == 40 ){
						el.value = hist( +1 ); }
					else if( e.which == 38 ){
						el.value = hist( ); }
					else if( e.which == 27 ){
						ctrl.hide( ); 
					}}
			},
		}, dom.byid( 'cmd' ));
		return dom( el ) }

	function hist( i ){
		var i = i || -1, 
				ii = history_i + i;
		if( ii >= history.length ){
			return ''; }
		else if( ii < 0 ){
			return history[0]; }
		else{
			history_i = history_i +i;
			return history[history_i]; }}
	function reg( cmd ){ _.extend( register, cmd ); }
	function compl( cmd ){ }
	function ex( cmd ){
		p = cmd.split(' ');
		history.push( cmd );
		history_i = history.length;
		if( _.isFunction( register[p[0]] )){ 
			if( typeof ctrl === 'object' ){ ctrl.hide( ); }
			register[p[0]]( p ); }}

	var main = dom.q('main'), 
			ctrl = false;

	var noscript = dom.q('.noscript');
	for( var k in noscript ){
		var el = noscript[k];
		dom.rm( el );
	}

	if( main.length > 0 ){
		main[0].addEventListener( 'dblclick', function( e ){
			var x = e.offsetX - 100, 
					y = e.offsetY - 50;
			if( !ctrl ){ ctrl = dom.cmd( ); }
			ctrl.show( ); 
			if( !ctrl.hasclass( 'hide' )){
				ctrl.apply({style:'left:'+x+'px;top:'+y+'px;'});
				ctrl.focus( ); }}) }

	return {
		reg: function( x ){ return reg( x ); },
		ex: function( x ){ ex( x ); },
		style: function( x ){ 
			if( !x ){ return; }
			var link = dom.q( 'head > link' );
			for( var i in link ){
			if( link[i].rel === 'stylesheet' ){
				dom.apply( link[i], {
					rel:  "stylesheet",
					type: "text/css",
					href: x+'.css' }); }}},
		hide: function( ){
			ctrl.hide( ); }
	}
});

