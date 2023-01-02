import { styles, createStaticHtml } from '../image_templates/help.js';
import {
  imgFromHtmlGenerator,
  generateBody,
} from '../image_templates/imgFromHtmlGenerator.js';

const helpCommand = async (interaction) => {
  const staticHtml = createStaticHtml();
  const body = generateBody(staticHtml, styles);
  try {
    const image = await imgFromHtmlGenerator(body);
    if (!(image instanceof Error)) {
      interaction.reply({ files: [{ attachment: image }] });
    }
  } catch (error) {
    interaction.reply('Unable to send help at this time. ¯\\_(ツ)_/¯');
    console.log(error);
  }
};

export default helpCommand;
