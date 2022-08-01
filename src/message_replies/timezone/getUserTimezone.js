import { DateTime } from 'luxon';
import { getUserIdFromMention } from '../../utils/getUserIdFromMention.js';
import { isUserValid } from '../../utils/isUserValid.js';
import { findTimezone } from '../../../db.js';

const getUserTimezone = async (interaction, value) => {
  const currentDate = DateTime.now();
  const id = getUserIdFromMention(value);

  try {
    const { username, validUser } = await isUserValid(interaction, id);
    if (!validUser) {
      return interaction.reply(`**${id || value}** is not a valid user`);
    }

    const { timezone } = await findTimezone(id);

    if (!timezone) {
      return interaction.reply(
        `the user **${username}** is not subscribed to the !timezone command`
      );
    }

    const baseStr = `**${username}**'s local time is `;
    const date = currentDate
      .setZone(timezone)
      .toFormat("'**'HH':'mm'** on **'LLL dd'**");

    await interaction.reply(baseStr + date);
    await interaction.delete();
  } catch (err) {
    console.error('error at: getUserTimezone.js', err);
  }
};

export default getUserTimezone;
