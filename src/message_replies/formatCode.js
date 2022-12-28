import beautify from 'js-beautify';
import format from '../utils/jsFormatConfig.js';

const { js: jsBeautify, css: cssBeautify, html: htmlBeautify } = beautify;

const formatCode = (interaction, prefixCommand) => {
  if (prefixCommand === '!js') {
    const stripPrefix = interaction.content.replace(/!js/g, '');
    const message = jsBeautify(stripPrefix, format);
    const string = '```js\n' + message + '```';

    interaction.reply(string);
  }

  if (prefixCommand === '!css') {
    const stripPrefix = interaction.content.replace(/!css/g, '');
    const message = cssBeautify(stripPrefix, format);
    const string = '```css\n' + message + '```';

    interaction.reply(string);
  }

  if (prefixCommand === '!html') {
    const stripPrefix = interaction.content.replace(/!html/g, '');
    const message = htmlBeautify(stripPrefix, format);
    const string = '```html\n' + message + '```';

    interaction.reply(string);
  }
};
export default formatCode;
