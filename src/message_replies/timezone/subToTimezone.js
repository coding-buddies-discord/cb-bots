import ct from 'countries-and-timezones';
import { MessageActionRow, MessageSelectMenu } from 'discord.js';
import { insertTimezone } from '../../../db.js';

const subOrUpdateToTimezone = async (value, interaction, flag) => {
  const countryInfo = ct.getCountry(value.toUpperCase());
  if (!countryInfo) {
    return interaction.reply(
      `**${value}** is not a valid country abreviation. try again with a proper one`
    );
  }

  const { timezones, name } = countryInfo;

  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('select')
      .setPlaceholder('Nothing selected')
      .addOptions(
        timezones.slice(0, 25).map((zone) => ({ label: zone, value: zone }))
      )
  );

  const reply = await interaction.reply({
    content: `Timezones for ${name}`,
    components: [row],
  });

  const author = interaction.author.id;
  const filter = (m) => m.user.id === author;
  const collector = interaction.channel.createMessageComponentCollector({
    filter,
    max: 1,
    time: 15000,
  });

  collector.on('collect', async (m) => {
    const timezone = m.values[0];
    const subOrUp = flag === '--sub' ? 'subscribed to' : 'updated your info on';
    try {
      await insertTimezone(author, timezone);
      interaction.reply(`You've now ${subOrUp} the \`!timezone\` command!`);
    } catch (err) {
      console.log(err);
    }
  });

  collector.on('end', async () => {
    try {
      await reply.delete();
    } catch (err) {
      console.log(err);
    }
  });
};

export default subOrUpdateToTimezone;
