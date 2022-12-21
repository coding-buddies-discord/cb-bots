import BuddiesModel from '../../models/BuddiesModel.js';
import { isUserValid } from '../utils/isUserValid.js';
import {
  imgFromHtmlGenerator,
  generateBody,
} from '../image_templates/imgFromHtmlGenerator.js';
import { leaderBoardBody, styles } from '../image_templates/points.js';

const reportChannelPoints = async (interaction) => {
  const { channelId, author } = interaction;
  const { id: callerId } = author;
  const topPointEarners = await BuddiesModel.channelPoints(channelId, 8);

  const arrOfValidUsers = [];
  for (const { _id, points, rank } of topPointEarners) {
    const { username, validUser, user } = await isUserValid(interaction, _id);
    if (validUser) {
      arrOfValidUsers.push({ username, points, user, rank });
    }
  }

  if (arrOfValidUsers.length === 0) {
    return interaction.reply(
      'There are no points in this channel yet, you should give someone one.😏'
    );
  }

  // if the caller is not in the top 8, go get their point data and append it to the end of the list
  if (!arrOfValidUsers.filter(({ user }) => user.id === callerId).length) {
    const { points, rank } = await BuddiesModel.getUserInfoOfChannel(
      callerId,
      channelId
    ).catch((err) => console.log(err));
    const { username, validUser, user } = await isUserValid(
      interaction,
      callerId
    );

    validUser
      ? arrOfValidUsers.push({
          username,
          points,
          rank,
          user,
        })
      : null;
  }

  const caller = interaction.author.username;
  const channelName = interaction.channel.name;
  const userListHTML = leaderBoardBody(channelName, caller, arrOfValidUsers);
  const body = generateBody(userListHTML, styles);

  try {
    const img = await imgFromHtmlGenerator(body, interaction);
    if (!(img instanceof Error)) {
      interaction.reply({ files: [{ attachment: img }] });
    }
  } catch (err) {
    console.log(err);
    interaction.reply(
      "Oof, sorry. I couldn't figure out who the leader is. Try again."
    );
  }
};

const reportGlobalPoints = async (interaction) => {
  const { author } = interaction;
  const { id: callerId } = author;
  const topPointEarners = await BuddiesModel.globalPoints(8);

  if (topPointEarners.length === 0) {
    return interaction.reply(
      'There are no points in this server yet, you should give someone one.😏'
    );
  }

  const arrOfValidUsers = [];
  for (const { userID, points } of topPointEarners) {
    if (points === 0) continue;
    const { username, validUser, user } = await isUserValid(
      interaction,
      userID
    );
    if (validUser) {
      arrOfValidUsers.push({ username, points, user });
    }
  }

  // if the caller is not in the top 8, go get their point data and append it to the end of the list
  if (!arrOfValidUsers.filter(({ user }) => user.id === callerId).length > 0) {
    const callerData = await BuddiesModel.getUser(callerId).catch((err) =>
      console.log(err)
    );

    const { username, validUser, user } = await isUserValid(
      interaction,
      callerId
    );

    validUser &&
      arrOfValidUsers.push({
        username,
        points: callerData.pointsReceived.length,
        user,
      });
  }

  const caller = interaction.author.username;
  const channelName = 'Global Score';
  const userListHTML = leaderBoardBody(channelName, caller, arrOfValidUsers);
  const body = generateBody(userListHTML, styles);

  try {
    const img = await imgFromHtmlGenerator(body, interaction);
    if (!(img instanceof Error)) {
      interaction.reply({ files: [{ attachment: img }] });
    }
  } catch (err) {
    console.log(err);
    interaction.reply(
      "Oof, sorry. I couldn't figure out who the leader is. Try again."
    );
  }
};

export { reportChannelPoints, reportGlobalPoints };
