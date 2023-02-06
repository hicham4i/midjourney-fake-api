import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin())

const browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]});
const pages = await browser.pages();
const page = pages[0];

export { page }