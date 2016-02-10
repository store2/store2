* dom.js - create and find elements
* domform.js - create and send forms
* query.js - ajax request
* ndrscr.js - helper

example:
``` javascript
define( ['store2/domform'],function( dom ) {
  var create = function( user ){
    var el = dom( '#create' );
    var fields = {
      a: { type:'hidden',value:'create' },
      name: { label:'Username',
        desc:'for login',autocomplete:'off',autofocus:true },
      password: { label:'New Password',
        type:'password',desc:'min 8 letters incl specialchars' }};
    var values = user.data || { };
    if( values.r ){
      fields.r = { type:'hidden',value:values.r };
      fields.name = { type:'static',html:values.name }}
    if( !el ){
      el = dom.box({ id:'create' }, dom.byid( 'cmd' ));
      el.show( );
      el.html( dom.form({
          fields: fields,
          values: values,
          actions: { close:true },
          target: '/_save',
          success: function( d, form ){
            if( d['status'] === '201 Created' ){
              user.data = d.data;
              el.html('thank you') }},
          on: {
            click: function( ev ){
              var h = dom.attr( ev.target, 'data-act' );
              if( !h ){ return false }
              ev.preventDefault();
              if( h === 'close' ){
                el.rm( ) } }}},
        {autocomplete:'off'} )) }}
  return create;
});           
```

