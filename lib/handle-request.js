module.exports = function( config ) {
	return function( req, res ) {
		console.log( req.url );
		console.log( req.headers );

		res.writeHead( 200 );
		res.end();
	};
};
