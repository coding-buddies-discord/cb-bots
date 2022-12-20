import client from '../index.js';
import {
  sendPing,
  reportChannelPoints,
  reportGlobalPoints,
  givePoint,
  helpCommand,
} from '../message_replies/index.js';
import BuddiesModel from '../../models/BuddiesModel.js';

function matchSuffix(str) {
  const myExp = /<@!?\d+> ?\+{2}/g;
  // it will always return an array, in case there's no match, the array will be empty
  const matches = [...str.matchAll(myExp)];
  // matches return an array with various details, from which we only need those in index 0;
  return matches.map((match) => match[0]);
}

export default {
  name: 'messageCreate',
  async execute(interaction) {
    // Avoid an iteration
    if (interaction.author.bot) return;

    // try to add the user to the points DB, if they are already there
    // db function will reject this
    await BuddiesModel.addUserToPoints(interaction.author.id);
    // NOTE: THIS IS COMPLETE
    // if (isNewUser) {
    //  sendBotIntro(interaction);
    // }

    // Prefix and message content
    const { content } = interaction;

    // finds prefix at the beginning
    const findPrefix = content.match(/^!\w+/);
    // if there's a match, tries to grab the first value of the array or undefined;
    const prefixCommand = findPrefix?.[0];
    const findSuffix = matchSuffix(content);

    if (!findSuffix.length && !prefixCommand) {
      return;
    }

    if (prefixCommand) {
      switch (prefixCommand.toLowerCase()) {
        case '!ping':
          sendPing(interaction, client);
          break;
        case '!pong':
          interaction.channel.send('ping');
          break;
        case '!points':
          if (/-g$/.test(content)) {
            return await reportGlobalPoints(interaction);
          }
          return await reportChannelPoints(interaction);

        case '!help':
          helpCommand(interaction, client);
          break;
        case '!goodbot':
          interaction.reply('☺️');
          break;
        default:
          return;
      }
    }

    if (findSuffix.length) {
      const isMessage = /--m$/.test(content);

      new Set(findSuffix).forEach((command) =>
        givePoint(command, interaction, isMessage)
      );
    }
  },
};
