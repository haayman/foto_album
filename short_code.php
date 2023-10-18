<?php
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('foto_album', plugin_dir_url(__FILE__)  . 'foto_album.css');
    wp_enqueue_script('foto_album', plugin_dir_url(__FILE__)  . 'slideshow.js', ['jquery']);
});


// album_id om unieke DOM id's te genereren zodat er meerdere albums op 1 pagina kunnen staan
$albumId = 1;

function foto_album_shortcode($atts) {

    $options['link'] = isset($options['link']) ? $options['link'] : "";
    $args = shortcode_atts(array(
        'link'                => $options['link'],
    ), $atts);

    $album = $args['link'];

    return displayAlbum($album);
}

function displayAlbum($album) {
    static $albumId = 0;
    ob_start(); ?>
<div class="bss-slides" id="foto_album_<?php echo ++$albumId ?>">
  <i class="fas fa-spinner fa-spin" style="font-size: 4em; margin:1em;"></i>
</div>
<script>
jQuery(document).ready(function($) {
  loadAlbum($, <?php echo "'{$album}', 'foto_album_{$albumId}'" ?>);
});
</script>
<?php
    $html = ob_get_contents();
    ob_end_clean();

    return $html;
}

function get_remote_contents($url) {
    $response = wp_remote_get($url);
    if (!is_wp_error($response)) {
        return wp_remote_retrieve_body($response);
    }
    return NULL;
}


// function parse_photos($contents) {
//     $m = NULL;
//     preg_match_all('~\"(http[^"]+)"\,[0-9^,]+\,[0-9^,]+~i', $contents, $m);
//     return array_unique($m[1]);
// }


$ajax = function () {
    try {
        if ($contents = get_remote_contents($_GET['link'])) {
            echo $contents;
        }
    } catch (Exception $e) {
        header('', true, 500);
        wp_send_json_error($e->getMessage());
    }
};

add_action('wp_ajax_plusleo_album', $ajax);
add_action('wp_ajax_nopriv_plusleo_album', $ajax);