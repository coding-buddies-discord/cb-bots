import puppeteer from "puppeteer";

const generateBody = (body, styles) => {
  return `
<html>
    <head>
      <style>
        ${styles}
      </style>
    </head>
    <body>
      ${body}
    </body>
</html>
  `;
};

const browser = await puppeteer.launch();

const imgFromHtmlGenerator = async (html = "") => {
  const page = await browser.newPage();
  await page.setContent(html);

  const content = await page.$("body");
  const imageBuffer = await content.screenshot({ omitBackground: true });

  await page.close();

  return imageBuffer;
};

export { generateBody, imgFromHtmlGenerator };
