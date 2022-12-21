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

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const imgFromHtmlGenerator = async (html = '') => {
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
