define( ['./dom','./ndrscr'],function( dom, _ ) {
	dom.msg_xhrerr = function( d, r ){
		d = d || { };
		var el = dom( 'div', { 'class': 'err' }, r );
		el.append([
			dom.c( 'h4', { html: d.msg } ),
			dom.c( 'span', { class: 'estatus', html: d.status } ),
			dom.c_ul( { html:d.data } ),
			dom.c( 'div', {
				class: 'nav', 
				html: [
					dom.c( 'a', { 
					  autofocus: true,
						html: 'close', 
						on: { 'click': function( e, ev ){ el.rm( ); }}} )] }) 
		])
		return el; }
	dom.popup_xhrerr = function( a, d ){
		dom.msg_xhrerr( d, dom.byid( 'msg' )); }

	var jsontype = 'application/json';
	var query = function( target, data, opt ){
		data = data || {};
		opt = opt || {};
		var url = target,
			xhr = new XMLHttpRequest(),
			method = opt.method || 'get',
			accept = jsontype,
			ctype = jsontype;
		if( window.location.protocol === 'file:' ){
			url = 'http://localhost'+url; }
		xhr.open( method, url, true);
		if( typeof data === 'string' ){
			ctype = 'application/x-www-form-urlencoded' }
		xhr.setRequestHeader( 'Content-type', ctype );
		xhr.setRequestHeader( 'Accept', accept );
		if( opt.auth ){
			var authstr = 'Basic '+btoa( opt.auth.name+':'+opt.auth.password );
			xhr.setRequestHeader('Authorization', authstr) }
		xhr.onreadystatechange = function( ){
			if( _.isFunction( opt['statuscb'] )){
				opt['statuscb']( d ); }
			if( xhr.readyState == 4 ){
				var d = false, r = xhr.responseText || { };
				if( accept === jsontype ){
					d = JSON.parse( r ) }
				if( typeof xhr['status'] === 'undefined' ){
					var info = {status:'502',msg:'bad gateway',data:d};
					if( _.isFunction( opt['error'] )){ opt['error']( xhr ); }
					dom.popup_xhrerr( info )}
				else if( xhr['status'] === 200 ||
					xhr['status'] === '201' ){
					if( _.isFunction( opt['success'] )){ opt['success']( d ); }}
				else{
					var info = {'status':xhr['status'],msg:xhr.statusText,data:d};
					if( _.isFunction( opt['error'] )){ opt['error']( info ); }
					else{ dom.popup_xhrerr( info )} }} }
		xhr.send(data); }
	return query;
});
