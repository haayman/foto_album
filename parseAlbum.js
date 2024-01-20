onmessage = async ({ data: link }) => {
  let retries = 5;
  while (retries--) {
    try {
      const response = await fetch(
        `/wp-admin/admin-ajax.php?action=foto_album&link=${encodeURIComponent(
          link
        )}`
      ).then((res) => res.text());
      const regex = new RegExp('"(?<url>http[^"]+)",[0-9^,]+,[0-9^,]+', "gi");
      const urls = [];
      for (const match of response.matchAll(regex)) {
        urls.push(match.groups.url);
      }
      if(!urls.length) throw new Error("No urls found");
      postMessage(urls);
      return;
    } catch (e) {
      console.log(`retrying ${link}...(${retries} retries left)`);
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  postMessage([]);
};
