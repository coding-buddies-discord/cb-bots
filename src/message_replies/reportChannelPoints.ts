//@ts-nocheck
import BuddiesModel from '../../models/BuddiesModel.js';
import { isUserValid } from '../utils/isUserValid.js';
import {
  imgFromHtmlGenerator,
  generateBody,
} from '../image_templates/imgFromHtmlGenerator.js';
import { leaderBoardBody, styles } from '../image_templates/points.js';
import { Message, TextChannel, User } from 'discord.js';

export type rankedUser = {
  username: string;
  points: number;
  user: User;
  rank: number;
};

const reportChannelPoints = async (message: Message) => {
  const { channelId, author } = message;
  const { id: callerId } = author;
  const topPointEarners = await BuddiesModel.channelPoints(channelId, 8);

  const arrOfValidUsers: rankedUser = [];
  for (const { _id, points, rank } of topPointEarners) {
    const { username, validUser, user } = await isUserValid(message, _id);
    if (validUser) {
      arrOfValidUsers.push({ username, points, user, rank });
    }
  }

  if (arrOfValidUsers.length === 0) {
    return message.reply(
      'There are no points in this channel yet, you should give someone one.😏'
    );
  }

  // if the caller is not in the top 8, go get their point data and append it to the end of the list
  if (!arrOfValidUsers.filter(({ user }) => user.id === callerId).length) {
    const { points, rank } = await BuddiesModel.getUserInfoOfChannel(
      callerId,
      channelId
    ).catch((err) => console.log(err));
    const { username, validUser, user } = await isUserValid(message, callerId);

    validUser
      ? arrOfValidUsers.push<rankedUser>({
          username,
          points,
          rank,
          user,
        })
      : null;
  }

  const caller = message.author.username;
  const channelName = (message.channel as TextChannel).name;
  const userListHTML = leaderBoardBody(channelName, caller, arrOfValidUsers);
  const body = generateBody(userListHTML, styles);

  try {
    const img = await imgFromHtmlGenerator(body);
    if (!(img instanceof Error)) {
      message.reply({ files: [{ attachment: img }] });
    }
  } catch (err) {
    console.log(err);
    message.reply(
      "Oof, sorry. I couldn't figure out who the leader is. Try again."
    );
  }
};

const reportGlobalPoints = async (message: Message) => {
  const { author } = message;
  const { id: callerId } = author;
  const topPointEarners = await BuddiesModel.globalPoints(8);

  if (topPointEarners.length === 0) {
    return message.reply(
      'There are no points in this server yet, you should give someone one.😏'
    );
  }

  const arrOfValidUsers: rankedUser = [];
  for (const { _id, points, rank } of topPointEarners) {
    if (points === 0) continue;
    const { username, validUser, user } = await isUserValid(message, _id);
    if (validUser) {
      arrOfValidUsers.push({ username, points, user, rank });
    }
  }

  // if the caller is not in the top 8, go get their point data and append it to the end of the list
  if (!arrOfValidUsers.filter(({ user }) => user.id === callerId).length) {
    const { points, rank } = await BuddiesModel.getUserGlobalPoints(
      callerId
    ).catch((err) => console.log(err));

    const { username, validUser, user } = await isUserValid(message, callerId);

    validUser &&
      arrOfValidUsers.push<rankedUser>({
        username,
        points,
        rank,
        user,
      });
  }

  const caller = message.author.username;
  const channelName = 'Global Score';
  const userListHTML = leaderBoardBody(channelName, caller, arrOfValidUsers);
  const body = generateBody(userListHTML, styles);

  try {
    const img = await imgFromHtmlGenerator(body, message);
    if (!(img instanceof Error)) {
      message.reply({ files: [{ attachment: img }] });
    }
  } catch (err) {
    console.log(err);
    message.reply(
      "Oof, sorry. I couldn't figure out who the leader is. Try again."
    );
  }
};

export { reportChannelPoints, reportGlobalPoints };
