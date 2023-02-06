import express from 'express';
import fs from 'fs';

const router = express.Router();
const getFiles = (fparent, fname) => {
    console.log(`🚀 ~~~~~~~ getFiles ~~~~~~~ fparent, fname`, fparent, fname);
    return fs.readdirSync(`./img/${fparent}/${fname}`, { recursive: true });
}
const getHtml = (dir, fparent) => {
if (dir.includes('.')) 
    return `<li>
          <a target="_blank" href="./${fparent}/${dir}"></i>${dir}</a>
      </li>`
else return `<li>
    <i class="fa fa-folder-open"></i> ${dir}
    <ul>
    ${getFiles(fparent, dir).map(element => `<li>
            <a target="_blank" href="./${fparent}/${dir}/${element}"></i>${element}</a>
        </li>`)}
    </ul>
</li>`
}
// `
// <ul>
//     ${furrytags.map(element => `
//     <li>
//         <a target="_blank" href="./furrytag/${element}"></i>${element}</a>
//     </li>
//     `)}
// </ul>
// `
router.get('/', async (req,res) => {
    const screens = fs.readdirSync('./img/screens');
    const furrytags = fs.readdirSync('./img/furrytag');
    // const files = fs.readdirSync('./img/screens');
    res.send(`
    <html> 
    <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <style>
        body {
            font-size: 1rem;
            background: #f5f5f5;
          }
          
          .tree {
            position: relative;
            background: white;
            margin-top: 20px;
            padding: 30px;
            font-family: "Roboto Mono", monospace;
            font-size: 0.85rem;
            font-weight: 400;
            line-height: 1.5;
            color: #212529;
          }
          .tree span {
            font-size: 13px;
            font-style: italic;
            letter-spacing: 0.4px;
            color: #a8a8a8;
          }
          .tree .fa-folder-open, .tree .fa-folder {
            color: #007bff;
          }
          .tree .fa-html5 {
            color: #f21f10;
          }
          .tree ul {
            padding-left: 5px;
            list-style: none;
          }
          .tree ul li {
            position: relative;
            padding-top: 5px;
            padding-bottom: 5px;
            padding-left: 15px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
          }
          .tree ul li:before {
            position: absolute;
            top: 15px;
            left: 0;
            width: 10px;
            height: 1px;
            margin: auto;
            content: "";
            background-color: #666;
          }
          .tree ul li:after {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: 1px;
            height: 100%;
            content: "";
            background-color: #666;
          }
          .tree ul li:last-child:after {
            height: 15px;
          }
          .tree ul a {
            cursor: pointer;
          }
          .tree ul a:hover {
            text-decoration: none;
          }
        </style>
    </head>
    <body>
    <div class="tree">
  <ul>
    <li>
      <i class="fa fa-folder-open"></i> Project
      <ul>
        <li>
          <i class="fa fa-folder-open"></i> img
          <ul>
            <li>
              <i class="fa fa-folder-open"></i> screens
              <ul>
                ${screens.map(element => getHtml(element, 'screens')).join('').replace(/,/g, '')}
              </ul>
            </li>
            <li>
                <i class="fa fa-folder-open"></i> furrytag
                <ul>
                ${furrytags.map(element => getHtml(element, 'furrytag')).join('').replace(/,/g, '')}
                </ul>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</div>
        </body>
    </html>
    `);

});
export default router
