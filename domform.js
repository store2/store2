define( ['./dom','./ndrscr','./query'],function( dom, _, query) {
	function Form( ){
	}
	Form.prototype = {
		fd: false,
		load: function( fd ){
			fd = fd || {};
			form = dom( this );
			form.html([
				dom.c( 'div', { className: 'desc', html: fd['desc'] })]);
			if( fd.fields ){
				form.append([
					dom.c( 'fieldset', { html: dom.mkfields( fd.fields ) }),
					dom.c( 'input', { type:'submit',name:'act',value:'send' })]);
				form.on({
					submit: function( ev ){
						ev.preventDefault();
						if( _.isFunction( fd.submit )){
							fd.submit( form ); } 
						else{
							form.send( ) }} }) }
			if( fd.actions ){
				form.append([
					dom.c('nav',{ html: dom.mkactions( fd.actions ) }) ]) }
			this.fd = fd;
			this.form = form },
		send: function( ){
			var form = this.form,
				target = this.fd.target || '',
				method = this.fd.method || 'post',
				data = { };
			var msgs = form.q( '.msg' );
			for( var i in msgs ){
				dom.rm( msgs[i] ); }
			form.state( 'sending ...' );
			var param = _.map( form.fd.fields, function( v, k ){
				return k+'='+encodeURIComponent( form[k].value ) }).join( '&' );
			if( method === 'get' ){ target+= '?'+param }
			else{ var data = param }
			query( target, data,{
				method: method,
				success: function( d ){ form.success( d ) },
				error: function( d ){ form.err( d ) }}) },
		success: function( d ){
			form.state( );
			if( d['error'] ){
				if( _.isFunction( this.fd.error )){
					return this.fd.error( this ); } 
				else{
					return this.err( d ) }}
			else {
				if( _.isFunction( this.fd.success )){
					this.fd.success( d, this ); }} },
		err: function( d ){
			if( _.isFunction( this.fd.error )){
				return this.fd.error( this ); } 
		  if( d['status'] && d['status'] !== '200' && d['status'] !== '201' ){
				return this.state( d['msg'] ); }
			for( var k in d['error'] ){
				var field = this.form[k],
					msg = dom.c( 'p',{className:'msg',html:d['error'][k]}),
					prnt = field.parentNode;
					prnt.insertBefore( msg, field ); }},
		state: function( d ){
			d = d || ''
			var form = this.form,
				msg = form.q( '.state' );
			if( !msg.length ){
				msg = dom.c( 'span',{className:'state'})
				this.insertBefore( msg, form.q( 'fieldset' )[0] ) }
			else{
				msg = msg[0] }
			dom.html( msg, d ) },
	}

	dom.form = function( a, r ){
		a = a || {};
		var el = dom.c( 'form', a['f'], r );
		el = _.extend( el, Form.prototype );
		if( a ){ el.load( a ); }
		el.show( );
		return el; }
	dom.mkfields = function( a ){
		var k, f = [];
		for( k in a ){
			f.push( dom.c_field( k, a[k] )); }
		return f }
	dom.mkactions = function( a ){
		var k, f = [];
		for( k in a ){
			f.push( dom.c_act( k, a[k] )); }
		return f }
	dom.c_field = function( k, a, r ){
		a = a || {};
		if( !a['type'] ){ a['type'] = 'text'; }
		if( !a['name'] ){ a['name'] = k; }
		var f = dom.c( 'input', a );
		return dom.c( 'label', { html: f }, r ); }
	dom.c_act = function( k, a, r ){
		if( typeof a !== 'object' ){ a = { }}
		if( !a['href'] ){ a['href'] = '#'+k; }
		if( !a['data-act'] ){ a['data-act'] = k; }
		if( !a['html'] ){ a['html'] = k; }
		return dom.c( 'a', a, r ) }

	return dom
});
