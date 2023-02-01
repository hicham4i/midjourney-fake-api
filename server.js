// To use .env file for securely sharing secret key or other authentication secrets
import dotenv from 'dotenv';

import express, { urlencoded, json } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

// custom module imports
import userRoutes from './routes/user.routes.js';
import txt2imgRoutes from './routes/txt2img.routes.js';
import img2imgRoutes from './routes/img2img.routes.js';
import { page } from './lib/puppeteer.js';
import { client } from './lib/discord.js';
import { readAndSplit, sendImgToJourney, uploadImgToDiscord } from './lib/utils.js';

dotenv.config()
const token = process.env.DISCORD_TOKEN; //Token that you saved in step 5 of this tutorial

// create express instance
const app = express()

// set the port for devlopment and for heroku
const PORT = process.env.PORT || 4000;
await page.goto('https://discord.com/channels/1068479267018641468/1068479267480027186', {
    // waitUntil: "load",
    // timeout: 0
    waitUntil: "networkidle0",
});
await page.type('#uid_8', 'hicham@dopweb.com');
await page.type('#uid_11', 'jU5t!H$HYaDgrhV');
client.on("ready", async () =>{
    console.log("The AI bot is online"); //message when bot is online
    await page.click('button[type="submit"] > div', {delay: 10});
    await page.screenshot({path: `./img/discord-load.png` });
});
client.on("messageCreate", async (message) => {
    // console.log(`🚀 ~~~~~~~ client.on ~~~~~~~ message`, message.channelId);
    try {
        if (message.author.id === '936929561302675456' && message.attachments && message.attachments.first() && message.attachments.first().contentType === 'image/png') {
            const attachement = message.attachments.first();
            readAndSplit(attachement.url, attachement.name.split('.')[0], message);
            return;
        }
        if (message.content.substring(0, 1) === "*") {
            const imgUrl = 'https://media.discordapp.net/attachments/1069981948778385428/1070037510794793030/dophicham_ultradetailled_ultrarealistic_dog_3D_cartoon_magical__73657eac-ceb8-4640-877f-f124357fbdf8.png';
            readAndSplit(imgUrl, null, message);
            return;
            // uploadImgToDiscord()
        }
        if ( message.channelId === '1069953787235684382' && message.author.id !== '936929561302675456') {
            const attachement = message.attachments.first();
            sendImgToJourney(attachement.url, message.content);
            return;
        }
    } catch (error) {
        console.log(`🚀 ~~~~~~~ client.on ~~~~~~~ error`, error);
    }
});

// Use Express's in-built middleware to parse json and form functionality
app.use(urlencoded({extended:true}))
app.use(json())

// Use Helmet for cross-site attack protection
app.use(helmet())

// use morgan for logging functionality
app.use(morgan('dev'))

// use cors for cross origin accessing
app.use(cors())
app.use(express.static('img'));

// routes fo post and user
// app.use('/user', userRoutes)
app.use('/text2img', txt2imgRoutes)
app.use('/img2img', img2imgRoutes)

app.get('/',(req,res) => {
    res.send('Main URL Accessed')
})

// listen to port
app.listen(PORT,() => {
    console.log(`Server is running at port ${PORT}`);
    client.login(token);
})
export default app