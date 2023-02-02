import express from 'express';
import fs from 'fs';

const router = express.Router();

router.get('/', async (req,res) => {
    const files = fs.readdirSync('./img/screens');
    res.send(`
    <html> 
    <head>server Response</head>
        <body>
        <h1> This page was render direcly from the server </h1>
        <p>Hello there welcome to my website</p>
        <div style="display:flex;flex-direction:column;">
            ${files.map(element => `<a target="_blank" href="./screens/${element}">${element}</a>`)}
        </div>
        </body>
    </html>
    `);

});
export default router
