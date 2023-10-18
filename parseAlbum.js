onmessage = async ({data:link}) => {

    const response = await fetch(`/wp-admin/admin-ajax.php?action=plusleo_album&link=${encodeURIComponent(link)}`).then(res => res.text());
    const regex = new RegExp('"(?<url>http[^"]+)",[0-9^,]+,[0-9^,]+', 'gi');
    const urls = [];
    for( const match of response.matchAll(regex) ) {
        urls.push(match.groups.url);
    }
    postMessage(urls);
}