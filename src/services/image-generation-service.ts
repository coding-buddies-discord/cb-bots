
import puppeteer from "puppeteer";


const browser = await puppeteer
	.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

export const imgFromHtmlGenerator = (html = ""): Promise<string | Buffer> =>
	Promise.resolve()
		.then((_) => browser.newPage())
		.then((page) => [page.setContent(html), page] as const)
		.then((promises) => Promise.all(promises))
		.then(([_, page]) => [page.screenshot({ omitBackground: true }), page] as const)
		.then((promises) => Promise.all(promises))
		.then(([imageBuffer, page]) => [imageBuffer, page.close()] as const)
		.then((promises) => Promise.all(promises))
		.then(([imageBuffer, _]) => imageBuffer)
		.finally(() => page.close());
