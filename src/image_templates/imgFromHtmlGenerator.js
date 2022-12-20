import puppeteer from 'puppeteer';

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

let browser;

const imgFromHtmlGenerator = async (html = '') => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  let page;
  try {
    page = await browser.newPage();
    await page.setContent(html);
    const content = await page.$('body');
    const imageBuffer = await content.screenshot({ omitBackground: true });

    return imageBuffer;
  } finally {
    await page.close();
  }
};

export { generateBody, imgFromHtmlGenerator };
