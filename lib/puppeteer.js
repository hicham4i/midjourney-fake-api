import * as puppeteer from 'puppeteer';

const browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]});
const pages = await browser.pages();
const page = pages[0];

export { page }