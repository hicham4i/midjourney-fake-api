import express from 'express';
import { page } from '../lib/puppeteer.js';

const router = express.Router();

router.get('/', async (req,res) => {
    res.send('Good')                 
});
export default router
