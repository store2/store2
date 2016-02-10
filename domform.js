define( ['./dom','./ndrscr','./query'],function( dom,_,query) {

	function Form( ){
	}
	Form.prototype = {
		fd: false,
		load: function( fd ){
			fd = fd || {};
			var form = dom( this );

			form.on({
				submit: function( ev ){
					ev.preventDefault();
					if( _.isFunction(fd.submit)){
						fd.submit( form ) }
					else{
						form.send( ) }} })
			form.html([
				dom.c( 'div', { className: 'desc', html: fd['desc'] })]);

			if( fd.fields ){
				form.append([
					dom.c( 'fieldset', { html: dom.mkfields( fd ) }),
					dom.c( 'input', { type:'submit',name:'act',value:'send' })]) }
			if( fd.actions ){
				form.append([
					dom.c('nav',{ html: dom.mkactions( fd.actions ) }) ]) }
			if( fd.on ){
				form.on( fd.on ) }
			this.fd = fd;
			this.form = form },
		send: function( data ){
			var form = this.form,
				target = this.fd.target || '',
				method = this.fd.method || 'post',
				ctype = this.fd.ctype || false,
				data = data || { },
				param = { };
			dom.rm( form.q( '.ferr' ));
			form.state( 'sending ...' );
			for( var k in form.fd.fields ){
				var fn = form.fd.fields[k].name || k;
					ft = form.fd.fields[k].type || 'text';
				if( typeof form.elements[fn] !== 'undefined' ){
					data[k] = form[fn].value }}

			if( method === 'get' ){
				target+= '?'+ dom.encodedata( data ) 
				data = false }
			else if( method === 'post' ){
				ctype = 'application/x-www-form-urlencoded';
				data = dom.encodedata( data ) }
			else {
				data = JSON.stringify( data ) }

			query( target, data,{
				ctype: ctype,
				method: method,
				success: function( d ){ form.successcb( d ) },
				error: function( d ){ form.errorcb( d ) }}) },
		successcb: function( d ){
			this.form.state( );
			if( d['error'] ){
				if( _.isFunction( this.fd.error )){
					this.fd.error( d, this ); } 
				else{
					this.error( d ) }}
			else {
				if( _.isFunction( this.fd.success )){
					this.fd.success( d, this ); }} },
		errorcb: function( d ){
			if( _.isFunction( this.fd.error )){
				return this.fd.error( d, this ) }
			return this.error( d ) },
		error: function( d ){
			if( d['status'] && [200,201,202].indexOf(d['status']) == -1 ){
				return this.state( d['msg'], 'err' ) }
			else if( d['error'] ){
				var focused = false;
				for( var k in d['error'] ){
					var field = this.form[k],
						msg = dom.c( 'p',{className:'ferr',html:d['error'][k]});
					dom.insertafter( msg, field );
					if( !focused ){
						focused = true;
						field.focus( ) }}}},
		state: function( d, c ){
			d = d || ''
			var form = this.form,
				msg = form.q( '.state' );
			if( !msg.length ){
				msg = dom.c( 'div',{className:'state'})
				this.insertBefore( msg, form.q( 'fieldset' )[0] ) 
				msg.focus }
			else{
				msg = msg[0] 
				dom.apply(msg,{className:'state'}) }
			if( c ){ dom.addclass(msg,c) }
			dom.html( msg, d ) },
	}

	dom.form = function( a, f, r ){
		a = a || {};
    var el = dom.c( 'form', f, r );
    el = _.extend( el, Form.prototype );
		if( a ){ el.load( a ); }
		el.show( );
		return el; }

	dom.encodedata = function( data ){
		return _.map( data, function( v, k ){
			return k+'='+encodeURIComponent( v ) }).join( '&' ) }

	dom.mkfields = function( a ){
		var k, f = [],
			values = a.values || { };
		for( k in a.fields ){
			var v = a.fields[k],
				ft = a.fields[k].type || 'text';
			if( values[k] ){
				v['value'] = values[k] }
			f.push( dom.c_field( k, v )) }
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
		if( a.type === 'hidden' ){
			return dom.c( 'input', a ) }
		var	html = [];
			label = a['label'] || k,
		html.push(dom.c('span',{html:label}));
		if( a['label'] ){ delete a.label }
		if( a['desc'] ){
			html.push(dom.c('span',{className:'desc',html:' - '+a.desc}));
			delete a.desc }
		if( _.isFunction( dom['c_field_'+a['type']] )){
			html.push(dom['c_field_'+a['type']]( k, a, r )) }
		else {
		 	html.push(dom.c( 'input', a )) }
		return dom.c( 'label', { html: html }, r ); }
	dom.c_field_static = function( k, a, r ){
		delete a.type;
		var f = dom.c( 'span', a );
		dom.addclass( f, 'inputstatic' );
		return dom.c( 'label', { html: f }, r ); }
	dom.c_field_textarea = function( k, a, r ){
		delete a.type;
		if( a['value'] ){
			a['html'] = a['value'];
			delete a['value'] }
		var f = dom.c( 'textarea', a );
		return dom.c( 'label', { html: f }, r ); }
	dom.c_field_datalist = function( k, a, r ){
		var f = [],
			opt = [];
		if( 'options' in a ){
			for( var o in a.options ){
				var oo = a.options[o];
				if( typeof oo == 'string' ){
					oo = {value:oo,html:oo} }
				else {
					oo['value'] = oo['value'] || '';
					oo['html'] = oo['html'] || oo['value'] }
				opt.push(dom.c('option',oo)) }
			a.type = 'text';
			a.list = a.list || a['name']+'_opt';
			f.push(dom.c('datalist',{id:a.list,html:opt}))
			delete a.options }
		f.push(dom.c( 'input', a ));
		return dom.c( 'label', { html: f }, r ); }

	dom.c_act = function( k, a, r ){
		if( typeof a !== 'object' ){ a = { }}
		if( !a['href'] ){ a['href'] = '#'+k; }
		if( !a['data-act'] ){ a['data-act'] = k; }
		if( !a['html'] ){ a['html'] = k; }
		return dom.c( 'a', a, r ) }
	dom.msg_dberr = function( d, r ){
		d = d || { };
		var el = dom( 'div', { 'class': 'err' }, r );
		el.append([
			dom.c( 'h4', { html: d.msg } ),
			dom.c( 'span', { class: 'estatus', html: d.status } ),
			dom.c_ul( { html:d.data } ),
		])
		return el; }

	return dom
});
