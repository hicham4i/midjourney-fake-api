import bodyParser from 'body-parser';
import express from 'express';
import multiparty from 'multiparty';
import { uploadImgToDiscord } from '../lib/utils.js';
import fs from 'fs';

const router = express.Router();

router.post('/', async (req,res) => {
    // console.log(req);
    var form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
        const ref = fields.ref[0];
        const img = files.img[0];
        const buffer = fs.readFileSync(img.path);
        uploadImgToDiscord(ref, buffer);
    });
    // await page.keyboard.press('Enter', {delay: 100});
    res.send('Good');
});
export default router
