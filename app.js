#!/usr/bin/env node

var async = require( 'async' );
var color = require( 'cli-color' );

async.waterfall( [
	function( callback ) {
		// Pass initial configuration down the stream
		callback( null, require( './config.json' ) );
	},
	function( config, callback ) {
		// Add Github API
		config.github = new ( require( 'github' ) )( {
			version: "3.0.0",
			timeout: 5000
		} );

		callback( null, config );
	},
	require( './lib/authenticate' ),
	require( './lib/server' )
], function( err, config ) {
	if( err ) {
		console.error( err );
		process.exit( 1 );
	}

	console.log( color.green( 'Logotome is now running.. ' ) );
} );
