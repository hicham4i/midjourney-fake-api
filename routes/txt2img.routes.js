import express from 'express';
import { page } from '../lib/puppeteer.js';

const router = express.Router();

router.post('/', async (req,res) => {
    // console.log(req);
    const { prompt, ref } = req.body;
    console.log(`🚀 ~~~~~~~ router.get ~~~~~~~ prompt`, prompt);
    await page.click('li[data-dnd-name="txt2txt"]');
    await page.type('[role="textbox"]', '/imagine',  {delay: 100});
    // await page.type('[role="textbox"]', ' ', {delay: 1000});
    // await page.click('#autocomplete-0', {delay: 100});
    await page.keyboard.press('Enter', {delay: 100});
    await page.type('[role="textbox"]', `${prompt} --ref-${ref}`);
    // await page.keyboard.press('Enter', {delay: 100});
    res.send('Good');
});
export default router
