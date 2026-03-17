import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";

admin.initializeApp();
const db = admin.firestore();

/**
 * Scheduled Cloud Function — runs every 15 minutes.
 * Fetches news from Sri Lankan RSS feeds and stores in Firestore.
 */
export const scrapeNews = functions.pubsub
  .schedule("every 15 minutes")
  .timeZone("Asia/Colombo")
  .onRun(async () => {
    const sources = [
      { name: "Ada Derana", url: "https://www.adaderana.lk/rss.php", siteUrl: "https://www.adaderana.lk" },
      { name: "Daily Mirror", url: "https://www.dailymirror.lk/rss", siteUrl: "https://www.dailymirror.lk" },
    ];

    let totalArticles = 0;

    for (const source of sources) {
      try {
        const res = await fetch(source.url, {
          headers: { "User-Agent": "Infora-NewsBot/1.0" },
          timeout: 10000,
        } as any);

        if (!res.ok) {
          functions.logger.warn(`Failed to fetch ${source.name}: HTTP ${res.status}`);
          continue;
        }

        const xml = await res.text();
        const articles = parseRssXml(xml, source.name, source.siteUrl);

        const batch = db.batch();
        for (const article of articles.slice(0, 20)) {
          const docRef = db.collection("newsCache").doc(article.id);
          batch.set(docRef, article, { merge: true });
        }
        await batch.commit();

        totalArticles += articles.length;
        functions.logger.info(`Scraped ${articles.length} articles from ${source.name}`);
      } catch (err: any) {
        functions.logger.error(`Scrape failed for ${source.name}:`, err.message);
      }
    }

    functions.logger.info(`News scrape complete. Total: ${totalArticles} articles.`);
    return null;
  });

/**
 * HTTP-triggered function to manually trigger a news scrape.
 */
export const triggerScrape = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  functions.logger.info("Manual scrape triggered");

  const sources = [
    { name: "Ada Derana", url: "https://www.adaderana.lk/rss.php", siteUrl: "https://www.adaderana.lk" },
  ];

  let count = 0;
  for (const source of sources) {
    try {
      const response = await fetch(source.url, {
        headers: { "User-Agent": "Infora-NewsBot/1.0" },
      } as any);
      const xml = await response.text();
      const articles = parseRssXml(xml, source.name, source.siteUrl);

      const batch = db.batch();
      for (const article of articles.slice(0, 10)) {
        batch.set(db.collection("newsCache").doc(article.id), article, { merge: true });
      }
      await batch.commit();
      count += articles.length;
    } catch (err: any) {
      functions.logger.error(`Manual scrape failed for ${source.name}:`, err.message);
    }
  }

  res.json({ success: true, message: `Scraped ${count} articles` });
});

/**
 * Basic XML parser for RSS feeds.
 * For production, use a proper XML parser library.
 */
function parseRssXml(xml: string, sourceName: string, sourceUrl: string): any[] {
  const articles: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = extractTag(itemXml, "title");
    let description = extractTag(itemXml, "description");
    const link = extractTag(itemXml, "link");

    if (!title) continue;

    // Clean HTML from description
    if (description) {
      description = description.replace(/<[^>]*>/g, "").trim();
      if (description.length > 300) {
        description = description.substring(0, 297) + "...";
      }
    }

    const id = `${sourceName.toLowerCase().replace(/\s/g, "-")}-${Math.abs(hashCode(title))}`;

    articles.push({
      id,
      title_en: title,
      summary_en: description || "",
      source: sourceName,
      sourceUrl: sourceUrl,
      url: link || sourceUrl,
      category: categorize(title),
      district: "Colombo",
      publishedAt: new Date().toISOString(),
      verified: true,
    });
  }

  return articles;
}

function extractTag(xml: string, tag: string): string | null {
  // Handle both regular tags and CDATA
  const cdataRegex = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, "i");
  const cdataMatch = cdataRegex.exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = regex.exec(xml);
  return match ? match[1].trim() : null;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

function categorize(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("parliament") || t.includes("minister") || t.includes("election")) return "politics";
  if (t.includes("economy") || t.includes("bank") || t.includes("export")) return "economy";
  if (t.includes("cricket") || t.includes("sport")) return "sports";
  if (t.includes("tech") || t.includes("digital") || t.includes("ai")) return "technology";
  if (t.includes("india") || t.includes("china") || t.includes("world")) return "international";
  return "local";
}
