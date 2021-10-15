<?php
/**
* Plugin Name: Google Photo albums
* Plugin URI: https://plusleo.nl
* Description: carousel voor Google photo albums
* Version: 1.0
* Author: Arjen Haayman
**/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

require_once(  dirname(__FILE__) . '/short_code.php');
add_shortcode( 'foto_album', 'foto_album_shortcode' );  // Google Photos API, shortcode provides album id

