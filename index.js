const { Actor } = require('apify');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

// simple sleep helper
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

Actor.main(async () => {
    const input = await Actor.getInput();
    const {
        searchQuery,
        startDate,
        endDate,
        maxResults = 50,
        sortBy = 'recent',
        li_at
    } = input;

    if (!searchQuery || !li_at) {
        throw new Error('Missing required fields: searchQuery and li_at');
    }

    console.log('Launching browser…');
    const browser = await puppeteer.launch({
        headless: false,    // visible browser window for debugging
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);

    console.log('Setting session cookie…');
    await page.setCookie({ name: 'li_at', value: li_at, domain: '.linkedin.com' });

    const searchUrl = `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(searchQuery)}&sortBy=${sortBy}`;
    console.log('Navigating to', searchUrl);
    await page.goto(searchUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
    });
    console.log('Page loaded, starting to scroll & scrape…');

    let results = [];
    let previousHeight = 0;
    let iteration = 0;
    const MAX_SCROLLS = 30;  // ← maximum number of scroll iterations

    while (results.length < maxResults && iteration < MAX_SCROLLS) {
        iteration++;
        console.log(`— iteration ${iteration}, have ${results.length} posts so far —`);

        // Extract posts using updated selector
        const newPosts = await page.evaluate(() => {
            const posts = [];
            const postElements = document.querySelectorAll(
                'div.feed-shared-update-v2, div.occludable-update'
            );
            for (const el of postElements) {
                const content = el.innerText.trim();
                const link = el.querySelector('a.app-aware-link');
                posts.push({
                    content: content || null,
                    url: link?.href || null,
                    timestamp: new Date().toISOString()
                });
            }
            return posts;
        });
        console.log(`  → found ${newPosts.length} new raw posts on page`);

        // Deduplicate by URL
        const map = new Map(results.map(p => [p.url, p]));
        for (const p of newPosts) map.set(p.url, p);
        results = Array.from(map.values());

        // Scroll down
        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await sleep(2000);
        const newHeight = await page.evaluate('document.body.scrollHeight');

        if (newHeight === previousHeight) {
            console.log('📣 No more new content, breaking out.');
            break;
        }
    }

    if (iteration >= MAX_SCROLLS) {
        console.log(`⚠️ Reached max scroll limit (${MAX_SCROLLS}), stopping anyway.`);
    }

    // Filter by startDate/endDate
    const filtered = results.filter(p => {
        const d = new Date(p.timestamp);
        if (startDate && new Date(startDate) > d) return false;
        if (endDate && new Date(endDate) < d) return false;
        return true;
    });
    const finalResults = filtered.slice(0, maxResults);

    console.log(`🔍 Scraped ${finalResults.length} posts, pushing to dataset…`);
    await Actor.pushData(finalResults);

    await browser.close();
    console.log('✅ Done.');
});