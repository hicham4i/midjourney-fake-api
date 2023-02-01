import fs from 'fs';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs-node';
import { client } from './discord.js';
import { page } from './puppeteer.js';
const channelImgId = '1069953787235684382';
const channelTxt2txtId = '1069981994714415135';
const channelImg2txtId = '1069981948778385428';

const sendImgToJourney = async (url, ref) => {
    await page.click('li[data-dnd-name="img2txt"]');
    await page.type('[role="textbox"]', '/imagine',  {delay: 100});
    // await page.type('[role="textbox"]', ' ', {delay: 1000});
    // await page.click('#autocomplete-0', {delay: 100});
    await page.keyboard.press('Enter', {delay: 100});
    await page.type('[role="textbox"]', url,  {delay: 10});
    await page.type('[role="textbox"]', ' ',  {delay: 100});
    await page.type('[role="textbox"]', `ultradetailled ultrarealistic 3D cartoon`);
    // await page.keyboard.press('Enter', {delay: 100});
}
const uploadImgToDiscord = async (ref, buffer) => {
    const channel = client.channels.cache.get(channelImgId);
    // channel.send('test');
    // channel.send({ files: [{ attachment: buffer, name: `${ref}.png` }]});
    // const file = fs.readFileSync('./img/1.jpg');
    // const files = fs.readdirSync('./img');
    // console.log(`🚀 ~~~~~~~ uploadImgToDiscord ~~~~~~~ files`, file);
    channel.send({ content: ref, files: [{ attachment: buffer , name: `${ref}.png` }]});
}
const write = async (blurred, i, x, name, project) => {
    const buffer = await tf.node.encodeJpeg(blurred);
    fs.writeFileSync(`./img/${project}/` + `${name}_${x}_${i}.jpg`, buffer);
}
const readAndSplit = async (imgUrl, name, message, project) => {
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
            write(resizedTensor, i, x, name, project);
        });
    });
}
export { readAndSplit, uploadImgToDiscord, sendImgToJourney }