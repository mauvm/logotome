module.exports = function( config, callback ) {
	// Configure Github API
	config.github.authenticate( {
			type: 'basic',
			username: config.username,
			password: config.password
	} );

	callback( null, config );
};
