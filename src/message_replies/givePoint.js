import { getUserIdFromMention } from '../utils/getUserIdFromMention.js';
import { isUserValid } from '../utils/isUserValid.js';
import {
  addUserToPoints,
  giveUserAPoint,
  countGivenPoint,
  testDates,
} from '../../db.js';

async function givePoint(command, interaction, isMessage) {
  const mentionId = getUserIdFromMention(command);
  const caller = interaction.author.id;

  if (!mentionId) {
    return interaction.reply(
      `Sorry <@!${caller}>, can't find ${command}.\n(╯°□°）╯︵ ┻━┻`
    );
  }

  const { validUser, username } = await isUserValid(interaction, mentionId);

  // <@123456789012345678> will be an id but not a valid one,
  // therefore will need to be checked, and will need this message;
  if (!validUser) {
    interaction.reply(
      // eslint-disable-next-line no-useless-escape
      `Sorry <@!${caller}>, idk who ${command} is. ¯\\_(ツ)_/¯`
    );
  } else if (caller === mentionId) {
    interaction.reply(`Lmao <@!${caller}>, you can't give yourself a point.`);
  } else {
    // try to add the user to the DB, if they are already there
    // db function will reject this
    addUserToPoints(mentionId);

    const canAddPoint = await testDates(mentionId, interaction);
    if (!canAddPoint) {
      interaction.reply(
        `Yo **${interaction.author.username}**, you have to wait **at least** a minute to give **${username}** another point.😅`
      );
    }
    if (canAddPoint) {
      await giveUserAPoint(mentionId, interaction);

      if (!isMessage) {
        try {
          const stonks = interaction.guild.emojis.cache.find(
            (emoji) => emoji.name === 'stonks'
          );
          await interaction.react('🤖');
          await interaction.react(stonks || '🔥');
        } catch (err) {
          console.error(err);
        }
      }

      if (isMessage) {
        const emojis = ['🔥', '💯', '💃🏾', '💪🏾'];
        const randomNumber = Math.floor(Math.random() * 3);
        const { score, scoreTotal } = await countGivenPoint(
          mentionId,
          interaction.channelId
        );
        interaction.reply(
          `Woo! **${username}** has **${score} points** in <#${interaction.channelId}> and **${scoreTotal}** points in total. ${emojis[randomNumber]}`
        );
      }
    }
  }
}

export default givePoint;
