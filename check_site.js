import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
        page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

        console.log("Navigating to http://localhost:5000 ...");
        await page.goto('http://localhost:5000', { waitUntil: 'networkidle0' });
        
        console.log("Navigating to http://localhost:5000/school-documents ...");
        await page.goto('http://localhost:5000/school-documents', { waitUntil: 'networkidle0' });
        
        console.log("Done checking.");
        await browser.close();
    } catch (err) {
        console.error("Puppeteer Script Error:", err);
    }
})();
