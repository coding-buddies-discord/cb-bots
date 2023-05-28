import { Message } from 'discord.js';
import beautify from 'js-beautify';
import jsFormatConfig from '../utils/jsFormatConfig.js';

const beautifiers = {
  '!js': beautify.js,
  '!css': beautify.css,
  '!html': beautify.html,
};

const formatCode = async (
  message: Message,
  lang: string,
  format = jsFormatConfig
) => {
  const cleanMessage = message.content.replace(/!\w+/, '');
  const beautifier = beautifiers[lang];
  const responseMessage = beautifier(cleanMessage, format);
  const string = '```js\n' + responseMessage + '```';
  message.reply(string);
};
export default formatCode;
