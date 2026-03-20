const xml2js = require('xml2js');

async function testRSS() {
  const sources = [
    'https://www.adaderana.lk/rss.php',
    'https://colombogazette.com/feed',
    'https://www.newswire.lk/feed'
  ];

  for (let s of sources) {
     try {
       const resp = await fetch(s, { headers: { 'User-Agent': 'Mozilla/5.0' }});
       const text = await resp.text();
       console.log(`\n=== Source: ${s} ===`);
       let foundPubDate = false;
       // Quick regex to find pubDates
       const pubDates = text.match(/<pubDate>(.*?)<\/pubDate>/g);
       if (pubDates && pubDates.length > 0) {
           console.log("Found PubDates like: ", pubDates[0]);
       } else {
           console.log("No exact pubDate matches. Maybe different namespace?");
       }
       
       // Quick regex for enclosure or images
       const images = text.match(/<enclosure[^>]+url="([^"]+)"/g);
       if (images && images.length > 0) {
           console.log("Found Enclosures like: ", images[0]);
       }
       
       const media = text.match(/<media:content[^>]+url="([^"]+)"/g);
       if (media && media.length > 0) {
           console.log("Found Media Content like: ", media[0]);
       }

       const encoded = text.match(/<content:encoded><!\[CDATA\[(.*?)\]\]><\/content:encoded>/gi);
       if (encoded && encoded.length > 0) {
           console.log("Found Content Encoded");
           let firstSrc = encoded[0].match(/src="([^"]+)"/);
           console.log("Found image src in encoded? " + (firstSrc ? firstSrc[1] : "No"));
       }
       
     } catch (err) {
       console.log("Error on " + s + " -> " + err.message);
     }
  }
}

testRSS();
