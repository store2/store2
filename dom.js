define( ['./ndrscr'],function( _ ) {

	function Dom( el ) {
	}
	Dom.prototype = {
		apply: function( e ){ return dom.apply( this, e ); },
		attr: function( e ){ return dom.attr( this, e ); },
		append: function( e ){ return dom.append( this, e ); },
		html: function( e ){ return dom.html( this, e ); },
		on: function( a ){ return dom.on( this, a ); },
		q: function( s ){ return dom.q( s, this ); },
		x: function( s ){ return dom.x( s, this ); },
		rm: function( ){ return dom.rm( this ); },

		addclass: function( cn ){ return dom.addclass( this, cn ); },
		hasclass: function( cn ){ return dom.hasclass( this, cn ); },
		rmclass: function( cn ){ return dom.rmclass( this, cn ); },
		show: function( ){ return this.rmclass( 'hide' ); },
		hide: function( ){ return this.addclass( 'hide' ); },
		toggle: function( ){
			if( this.hasclass( 'hide' )){ return this.show( ); }
			else{ return this.hide( ); }}
	}

	var dom = function( el, a, r ) {
		if( !el ){ return false; }
		else if( typeof el === 'string' ){
			if( el.indexOf('#') !== -1 || el.indexOf('.') !== -1  ){
				el = dom.q( el, r );
				if( el.length < 1 ){
					return false; }
				else if( el.length === 1 ){
					el = el[0]; }}
			else{
				el = dom.c( el, a, r ); }}
		if( el.nodeType ){
			return _.extend( el, Dom.prototype ); }
		else if( _.isArray( el )){
			return _.extend( el, Dom.prototype ); } }
	dom.byid = function( id, r ){
		r = r || document.getElementsByTagName('body')[0];
		var el = dom.q( '#'+id );
		if( el.length == 1 ){ 
			el = el[0]; } 
		else{
			el = dom.c( 'div', {id:id} );
			document.body.appendChild( el ); }
		return el; }
	dom.q = document.querySelectorAll && function( s, r ){
		r = r || document;
		if( r ){
			return _.toArray( r.querySelectorAll( s )) }
		return new Array( ) }
	dom.x = function( x, el ){
		if (window.CustomEvent) {
			var ev = new CustomEvent( x );
			el.dispatchEvent(ev) }
		else if( document.createEvent ){
			var ev = document.createEvent( 'HTMLEvents' );
		  ev.initEvent( x, true, false );
			el.dispatchEvent( ev ) }
		else{
			element.fireEvent( x ) }}
	dom.c = function( el, a, r ){
		if( typeof el == 'string' ){
			el = document.createElement( el ); }
		if( _.isElement( r )){
			r.appendChild( el ); }
		if( a ){
			return dom.apply( el, a ); }
		return el; }
	dom.c_text = function( d ){
		if( typeof d === 'string' ){
			return document.createTextNode( d ); }}
	dom.c_ul = function( d ){
		if( typeof d.html === 'object' ){
			d.html = _.map( d.html, function( v, k ){
				var vv = [];
				if( typeof( v ) === 'object' ){
					vv.push( dom.c('span',{class:'k',html:k}) );
					if( _.isArray( v )){
						for( var i in v ){
							vv.push( dom.c_ul( { html: v[i] }) ) }}
					else{
						vv.push( dom.c_ul( { html: v }) ) }}
				else{
					vv = dom.c_text( k+': '+v ); }
				return dom.c( 'li', { html: vv } ); }); }
		else if( typeof d.html === 'string' ){
			d.html = dom.c( 'li',{ html: d.html }	); }
		return dom.c( 'ul', d ) }
	dom.c_dl = function( d ){
		var vv = [];
		if( _.isArray( d )){
			for( var i in d ){
				vv.push( dom.c('dd',{html:d[i]}) ) }}
		else if( typeof( d ) === 'object' ){
			_.map( d, function( v, k ){
				vv.push(dom.c('dt',{html:k}));
				if( typeof( v ) === 'object' ){
					vv.push( dom.c('dd',{html:dom.c_dl( v )}) ) }
				else{
					vv.push( dom.c('dd',{html:v}) ) }}) }
		else{
			vv.push( dom.c('dd',{html:d}) ) }
		return dom.c('dl',{html:vv}) } 
	dom.rm = function( el ){
		if( _.isArray( el )){ 
			for( var i in el ){ dom.rm( el[i] ); }
			return true; }
		if( el.parentNode ){
			el.parentNode.removeChild( el ); }}

	dom.apply = function( el, a ){
		if( typeof( a ) == "object" ){
			for( var k in a ){ 
				if( k == 'html' ){
					dom.html( el, a[k] ); }
				else if( k == 'data' ){
					dom.data( el, a[k] ); }
				else if( k == 'on' ){
					dom.on( el, a[k] ); }
				else if( k == 'className' ){
					dom.attr( el, 'class', a[k] ); }
				else {
					dom.attr( el, k, a[k] ); }
			}
		}
		else if( _.isArray( el )){
			for( var i in el ){ dom.apply( el[i], a ); }
		}
		return el; }
	dom.attr = function( el, k, v ){ 
		if( typeof v !== 'undefined' ){
			return el.setAttribute( k, v ); }
		if( _.isArray( el )){
			for( var i in el ){ dom.attr( el[i], k, v ); }}
		return el.getAttribute( k ); }
	dom.html = function( el, a ){
		if( typeof a === 'undefined' ){
			return el.innerHTML; }
		else if( typeof a === 'string' ){	
			return el.innerHTML = a; }
		else{
			el.innerHTML = '';
			return dom.append( el, a ); }}
	dom.append = function( el, a ){
		if( typeof a === 'string' ){
			el.appendChild( dom.c_text( a )); }
		else if( typeof( a ) == "object" ){
			if( a.nodeType ){ 
				el.appendChild( a ); }
			else{
				for( var k in a ){ dom.append( el, a[k] ); } }}
		return el; }
	dom.insertbefore = function( el, ref ){
		var prnt = ref.parentNode;
		prnt.insertBefore( el, ref ) }
	dom.insertafter = function( el, ref ){
		var prnt = ref.parentNode;
		prnt.insertBefore( el, ref.nextSibling ) }
	dom.on = function( el, a ){
		if( !_.isElement( el )){ return false; }
		for( var k in a ){
			el.addEventListener( k, function( ev ){
				if( typeof a[ev.type] === 'function' ){
					a[ev.type]( ev ); }}); }
		return el; }

	dom.hasclass = function( el, a ){
		var cl = ' '+el.className+' ';
		return cl.indexOf( ' '+a+' ' ) != -1; },
	dom.addclass = function( el, a ){
		if( _.isArray( el )){
			for( var k in el ){ dom.addclass( el[k], a ); }
			return }
		if( !dom.hasclass( el, a )){ 
		el.className+= ' '+a }
		return el }
	dom.rmclass = function( el, a ){
		if( _.isArray( el )){
			for( var k in el ){ dom.rmclass( el[k], a ); }
			return }
		var cl = ' '+el.className+' ';
		while( cl.indexOf( ' '+a+' ' ) != -1 ){
			 cl = cl.replace( ' '+a+' ', '' ) }
		el.className = cl; 
		return el }
	dom.toggle = function( el, a ){
		a = a || 'hide';
		if( dom.hasclass( el, a )){ dom.addclass( a ); }
		else{ dom.rmclass( a ); }
		return el }

	dom.cleanid = function( a ){
		if( typeof a === 'undefined' ){ return a; }
		v = a.replace(/[^A-Za-z0-9]+/g, '-').toLowerCase();
		return v.replace(/^-+/, ''); }

	dom.box = function( a, r ){
		var a = _.extend( a, { className: 'box' });
			el = dom( 'div', a, r );
		return el }


	return dom;
});
