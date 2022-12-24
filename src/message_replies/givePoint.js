import { getUserIdFromMention } from '../utils/getUserIdFromMention.js';
import { isUserValid } from '../utils/isUserValid.js';
import BuddiesModel from '../../models/BuddiesModel.js';

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

  const discordVerified = [];
  for (const idObj of validIDs) {
    const { validUser, username: name } = await isUserValid(
      interaction,
      idObj.id
    );
    if (validUser) {
      discordVerified.push({ ...idObj, name });
    }
  }
  console.log(discordVerified, BuddiesModel);
}

export default givePoint;
