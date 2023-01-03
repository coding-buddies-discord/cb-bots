import client from '../index.js';
import {
  sendPing,
  reportChannelPoints,
  reportGlobalPoints,
  givePoint,
  helpCommand,
} from '../message_replies/index.js';
import BuddiesModel from '../../models/BuddiesModel.js';
import formatCode from '../message_replies/formatCode.js';
import { SIMPLE_MODELS } from '../../models/SIMPLE_MODELS.js';

const { LANGUAGE_FORMATS } = SIMPLE_MODELS;

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

    // TODO: let's refacotr this to a lookup table once !points becomes one function
    if (prefixCommand) {
      if (prefixCommand === '!ping') {
        sendPing(interaction, client);
        return;
      }
      if (prefixCommand === '!pong') {
        interaction.channel.send('ping');
        return;
      }
      if (prefixCommand === '!points') {
        if (/-[gG]$/.test(content)) {
          return await reportGlobalPoints(interaction);
        }
        return await reportChannelPoints(interaction);
      }
      if (prefixCommand === '!help') {
        helpCommand(interaction, client);
        return;
      }
      if (prefixCommand === '!goodbot') {
        interaction.reply('☺️');
        return;
      }
      if (LANGUAGE_FORMATS.includes(prefixCommand)) {
        formatCode(interaction, prefixCommand);
        return;
      }
      return;
    }

    if (findSuffix.length) {
      givePoint(findSuffix, interaction);
    }
  },
};
