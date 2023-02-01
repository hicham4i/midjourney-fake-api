
const token = 'MTA2ODQ1NjY4ODEzMjI5MjY0OA.GOykGc.bMTnh2M2MiOJW-FuTbVJOuGhnQtx7bYfbb-H70'; //Token that you saved in step 5 of this tutorial
import { Client, GatewayIntentBits } from "discord.js";
import * as puppeteer from 'puppeteer';
import fs from 'fs';import axios from 'axios';
import * as tf from '@tensorflow/tfjs-node';

// Get all the images in the folder
const write = async (blurred, i, x, name) => {
    const buffer = await tf.node.encodeJpeg(blurred);
    fs.writeFileSync(`./splited/` + `${name}_${x}_${i}.jpg`, buffer);
}
const readAndSplit = async (imgUrl, name, message) => {
    message.channel.send("loading img...");
    const image = await axios.get(imgUrl, { responseType: 'arraybuffer' });
    const b = Buffer.from(image.data).toString('base64');
    const imgB = b.replace(
        /^data:image\/(png|jpeg);base64,/,
        ""
    );
    const buffer = Buffer.from(imgB, "base64");
    const img = tf.node.decodeImage(buffer, 3);
    message.channel.send("spliting and saving the imgs...");
    const splitX = tf.split(img, 2, 0);
    console.log(`🚀 ~~~~~~~ readAndSplit ~~~~~~~ spliting the img`);
    // Iterate over the 4 images
    splitX.forEach((tensorX, x) => {
        const splitY = tf.split(tensorX, 2, 1);
        splitY.forEach((tensor, i) => {
            const resizedTensor = tf.image.resizeBilinear(tensor, [256, 256]);
            write(resizedTensor, i, x, name);
        });
    });
}
export const main = async () => {
    const browser = await puppeteer.launch({headless: false});
    const pages = await browser.pages();
    const page = pages[0];
    await page.goto('https://discord.com/channels/1068479267018641468/1068479267480027186');
    await page.type('#uid_8', 'hicham@dopweb.com');
    await page.type('#uid_11', 'jU5t!H$HYaDgrhV');
    const client = new Client({
        intents:[
            GatewayIntentBits.Guilds, 
            GatewayIntentBits.GuildMessages, 
            GatewayIntentBits.MessageContent,
        ]
    });
    console.log(`🚀 ~~~~~~~ client.isReady()`, client.isReady());

    client.on("ready", async () =>{
        console.log("The AI bot is online"); //message when bot is online
        await page.click('button[type="submit"] > div', {delay: 100});
    });
    
    client.on("messageCreate", async (message) => {
        console.log(`🚀 ~~~~~~~ client.on ~~~~~~~ message`, message.author.username);
        try {
            if (message.content.substring(0, 1) === "!") {
                message.channel.send("interacting...");
                
                await page.type('[role="textbox"]', '/imagine',  {delay: 100});
                // await page.type('[role="textbox"]', ' ', {delay: 1000});
                // await page.click('#autocomplete-0', {delay: 100});
                await page.keyboard.press('Enter', {delay: 100});
                await page.type('[role="textbox"]', 'ultradetailled ultrarealistic dog 3D cartoon avatar, magical, fantasy art');
                await page.keyboard.press('Enter', {delay: 100});
            }
            if (message.author.id === '936929561302675456' && message.attachments && message.attachments.first() && message.attachments.first().contentType === 'image/png') {
                const attachement = message.attachments.first();
                readAndSplit(attachement.url, attachement.name.split('.')[0], message);
            }
            if (message.content.substring(0, 1) === "*") {
                const imgUrl = 'https://media.discordapp.net/attachments/1068479267480027186/1068514943822991451/dophicham_ultradetailled_ultrarealistic_dog_3D_cartoon_avatar_75548141-c836-4b97-a8a5-1c22a220910a.png';
                readAndSplit(imgUrl, null, message);
            }
        } catch (error) {
            console.log(`🚀 ~~~~~~~ client.on ~~~~~~~ error`, error);
            
        }
    });
    client.on('messageUpdate', async (message) => {
        if (message.author.id === '936929561302675456' && message.attachments && message.attachments.first()) {
            console.log(`🚀 ~~~~~~~ messageUpdate ~~~~~~~ attachments`, message.attachments.first().url);
        }
        if (message.author.id === '936929561302675456' && message.attachments && message.attachments.first() && message.attachments.first().contentType === 'image/png') {
        
        }
    });
    client.login(token);
    console.log('AI hello');
}
main()