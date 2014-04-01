var http   = require( 'http' );

module.exports = function( config, callback ) {
	var host    = config.host || '127.0.0.1';
	var port    = config.port || 3000;
	var handler = require( './handle-request' )( config );

	config.server = http.createServer( handler ).listen( port, host );

	console.log( 'Server running at //:' + host + ':' + port + '/' );

	callback( null, config );
};
