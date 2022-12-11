import BuddiesModel from '../../../models/BuddiesModel.js';

const unsubToTimezone = async (interaction) => {
  const author = interaction.author.id;
  try {
    await BuddiesModel.insertTimezone(author);
    interaction.reply("You're now Unsubscribed from the `!timezone` command");
  } catch (err) {
    console.log(err);
  }
};

export default unsubToTimezone;
