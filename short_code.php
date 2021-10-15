<?php
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('foto_album', plugin_dir_url( __FILE__ )  . 'foto_album.css' );
    wp_enqueue_script('foto_album', plugin_dir_url( __FILE__ )  . 'slideshow.js', ['jquery'] );

});



// album_id
$albumId = 1;

function foto_album_shortcode( $atts ) {
	
    $options['id'] = isset($options['id']) ? $options['id'] : "";
    $args = shortcode_atts( array(
            'id'                => $options['id'],
            ), $atts );

    $album = $args['id'];

    return displayAlbum($album);
}

function displayAlbum($album) {
    static $albumId = 0;
    ob_start();?>
    <div class="bss-slides" id="foto_album_<?php echo ++$albumId?>">
	<i class="fas fa-spinner fa-spin" style="font-size: 4em; margin:1em;"></i>
    </div>
    <script>
    jQuery(document).ready(function($) {
        loadAlbum($,<?php echo "'{$album}', 'foto_album_{$albumId}'"?>);
    });
    </script>
    <?php
    $html = ob_get_contents();
	ob_end_clean();

	return $html;
}

$ajax = function() {
	try {
        $plugin         = new CWS_Google_Picasa_Pro();
        $plugin_admin   = new CWS_Google_Picasa_Pro_Admin( $plugin->get_plugin_name(), $plugin->get_version(), $plugin->get_isPro() );
        $google_photos = new CWS_Google_Photos_Pro();

        $mediaItems = [];
        $nextPageToken = null;

        if( $plugin_admin->isAuthenticated() == true  ) {
            // Grab the access token
            $AccessToken = get_option( 'cws_gpp_access_token' ); 
            // $options = get_option( 'cws_gpp_options' );

            do {
                $out = $google_photos->getAlbumImagesGooglePhotos($AccessToken,
                    null,
                    false,
                    null,
                    100,
                    $_GET['albumId'],
                    null,null,
                    $nextPageToken);
                $mediaItems = array_merge( $mediaItems, $out[0]['mediaItems']);
                $nextPageToken = $out[0]['nextPageToken'];
            } while( $nextPageToken );

    		wp_send_json( array_map( function( $mediaItem ) {
                //return $mediaItem;
                return [
                    'baseUrl' => $mediaItem['baseUrl'],
                    'description' => @$mediaItem['description']
                ];
            }, $mediaItems ));
        }

	}catch(Exception $e ) {
		header('',true,500);
		wp_send_json_error($e->getMessage());
	}
};

add_action('wp_ajax_plusleo_album', $ajax);
add_action('wp_ajax_nopriv_plusleo_album', $ajax);



// function src($baseURL, $width, $google_photos) {
// 	 return $baseURL . $google_photos->addDimensions($width, 0, 0);
// }


/*
function displayAlbum($fotos, $options, $google_photos) {
    ob_start();
    ?>
    <div class="bss-slides" >
    <?php foreach( $fotos as $index => $foto ) {
        $imgUrl = $foto['baseUrl'] . $google_photos->addDimensions( 0, $options['height'], 0 ); ?>
        <figure>
		<!-- https://addyosmani.com/blog/lazy-loading/ -->
            <img src="<?php echo $imgUrl?>" loading="auto"
	    srcset="<?php
	    echo src($foto['baseUrl'], 700, $google_photos). ' 700w,';
	    echo src($foto['baseUrl'], 340, $google_photos). ' 340w';
	    ?>
	    "
	    size="(min-width: 768px) 700px, calc(100vw - 36px)"
	     />
            <?php if( $foto['description']) { ?>
                <figcaption><?php echo $foto['description']?></figcaption>
            <?php }?>
        </figure>
    <?php } ?>
    </div>
    <?php
    $html = ob_get_contents();
	ob_end_clean();

	return $html;
}
*/
