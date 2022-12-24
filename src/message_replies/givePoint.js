import { getUserIdFromMention } from '../utils/getUserIdFromMention.js';
import { isUserValid } from '../utils/isUserValid.js';
import BuddiesModel from '../../models/BuddiesModel.js';

const ARRAY_OF_POINTS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

async function givePoint(commandArr, interaction) {
  const caller = interaction.author.id;

  let mentionIDs = commandArr.map((command) => getUserIdFromMention(command));
  mentionIDs = mentionIDs.reduce((acc, IDObj) => {
    const filteredLength = acc.filter(({ id }) => id !== IDObj.id).length;
    if (acc.length === filteredLength) {
      acc.push(IDObj);
      return acc;
    }
    return acc;
  }, []);

  if (mentionIDs.length > 9) {
    mentionIDs = mentionIDs.slice(0, 9);

    await interaction.reply(
      `Sorry <@!${caller}>, You can only give points to 9 people per message.
Points will be given ONLY for the first 9 people mentioned`
    );
  }

  const validIDs = mentionIDs.filter((mentionID) => mentionID.isPossibleID);

  let discordVerified = [];
  for (const idObj of validIDs) {
    const { validUser, username: name } = await isUserValid(
      interaction,
      idObj.id
    );
    if (validUser) {
      discordVerified.push({ ...idObj, name });
    }
  }
  // finding if is someone has the same id than the caller. if it is it will get the length
  const hasCallerMention = discordVerified.filter(
    ({ id }) => caller === id
  ).length;

  if (hasCallerMention) {
    discordVerified = discordVerified.filter(({ id }) => id !== caller);
    interaction.reply(`Lmao <@!${caller}>, you can't give yourself a point.`);
  }

  let givenPoints = 0;
  const notGivenPoints = [];

  for (const { id, name } of discordVerified) {
    await BuddiesModel.addUserToPoints(id);
    const canAddPoint = await BuddiesModel.testDates(id, interaction);
    if (!canAddPoint) {
      notGivenPoints.push(name);
      continue;
    }
    await BuddiesModel.giveUserAPoint(id, interaction);
    givenPoints++;
  }

  if (notGivenPoints.length) {
    const str = notGivenPoints.reduce((curr, acc) => curr + `${acc}, `, '');
    interaction.reply(
      `Yo **${interaction.author.username}**, you have to wait **at least** a minute to give **${str}** another point.😅`
    );
  }
  if (givenPoints) {
    try {
      const stonks = interaction.guild.emojis.cache.find(
        (emoji) => emoji.name === 'stonks'
      );
      await interaction.react('🤖');
      await interaction.react(stonks || '🔥');
      await interaction.react(ARRAY_OF_POINTS[givenPoints - 1]);
    } catch (err) {
      console.error(err);
    }
  }
}

export default givePoint;
