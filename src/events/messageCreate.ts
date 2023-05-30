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
import { Message } from 'discord.js';

const { LANGUAGE_FORMATS } = SIMPLE_MODELS;

function matchSuffix(str: string): string[] {
  const myExp = /<@!?\d+> ?\+{2}/g;
  // it will always return an array, in case there's no match, the array will be empty
  const matches = [...str.matchAll(myExp)];
  // matches return an array with various details, from which we only need those in index 0;
  return matches.map((match) => match[0]);
}

export default {
  name: 'messageCreate',
  async execute(message: Message) {
    // Avoid an iteration
    if (message.author.bot) return;

    // try to add the user to the points DB, if they are already there
    // db function will reject this
    await BuddiesModel.addUserToPoints(message.author.id);

    // Prefix and message content
    const { content } = message;

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
        sendPing(message, client);
        return;
      }
      if (prefixCommand === '!pong') {
        message.channel.send('ping');
        return;
      }
      if (prefixCommand === '!points') {
        if (/-[gG]$/.test(content)) {
          return await reportGlobalPoints(message);
        }
        return await reportChannelPoints(message);
      }
      if (prefixCommand === '!help') {
        helpCommand(message);
        return;
      }
      if (prefixCommand === '!goodbot') {
        message.reply('☺️');
        return;
      }
      if (LANGUAGE_FORMATS.includes(prefixCommand)) {
        formatCode(message, prefixCommand);
        return;
      }
      return;
    }

    givePoint(findSuffix, message);
  },
};
