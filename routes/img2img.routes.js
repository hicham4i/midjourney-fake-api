import bodyParser from 'body-parser';
import express from 'express';
import multiparty from 'multiparty';
import Queue from 'bull';
import { uploadImgToDiscord } from '../lib/utils.js';
import fs from 'fs';

const router = express.Router();
// const opts = {redis:{maxRetriesPerRequest:3}}
const imgQueue = new Queue('img-queue', {
    redis: {
      lazyConnect: false,
    },
});

await imgQueue.obliterate({ force: true });

imgQueue.process(async (job, done) => {
    const {ref, img} = job.data;
    const buffer = fs.readFileSync(img.path);
    await uploadImgToDiscord(ref, buffer);
    done(null, {done: job.data}); //we need this if we are not using promise
});
  
  
imgQueue.on('completed', (job, result) => {
    console.log(`Job completed with result ${job}`);
});

imgQueue.on('error', (error) => {
// An error occured.
    console.log(`🚀 ~~~~~~~ imgQueue.on ~~~~~~~ error`, error);
})

imgQueue.on('lock-extension-failed', function (job, err) {
    console.log(`🚀 ~~~~~~~ redis err`, err);
    // A job failed to extend lock. This will be useful to debug redis
    // connection issues and jobs getting restarted because workers
    // are not able to extend locks.
});

imgQueue.on('failed', function (job, err) {
    console.log(`🚀 ~~~~~~~ failed err`, err);
    // A job failed with reason `err`!
})
  
router.post('/', async (req,res, next) => {
    try {
        var form = new multiparty.Form();
        form.parse(req, async (err, fields, files) => {
            const ref = fields.ref[0];
            const img = files.img[0];
            await imgQueue.add({ref, img});
            res.send({ message: `User added to the queue successfully!, ref: ${ref}` });
            }); 
    } catch (error) {
        console.log(`🚀 ~~~~~~~ router.post ~~~~~~~ error`, error);
    }
});
export default router
