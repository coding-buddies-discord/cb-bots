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

const imgFromHtmlGenerator = async (html = '') => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html);
    const content = await page.$('body');
    const imageBuffer = await content.screenshot({ omitBackground: true });

    return imageBuffer;
  } finally {
    await browser.close();
  }
};

export { generateBody, imgFromHtmlGenerator };
