import BuddiesModel from '../../models/BuddiesModel.js';
import _ from 'lodash';
import { exit } from 'process';

// list of users to create points for
const devUsers = [
  '870622678329983056',
  '1045395050252734575',
  '302320182066544651',
  '986336005982416936',
  '617759522190131210',
  '825201636691279932',
  '197979859773947906',
  '804548489727442985',
];

const devChannels = [
  '940069955230109696',
  '939629913537929239',
  '941167349854248961',
  '941873926244560896',
  '994570011366662145',
  '995761623883055125',
];

// creates args for fake points
const giveMockPoint = () => {
  const users = [...devUsers];
  const userId = _.sample(users);
  users.splice(users.indexOf(userId), 1);
  const interaction = {
    author: {
      id: _.sample(users),
    },
    channelId: _.sample(devChannels),
  };

  return [userId, interaction];
};

const seedPoints = async () => {
  // let's clear he db first
  const db = await BuddiesModel.connectDb();
  db.deleteMany();

  // loop through and create 100 points in the server
  for (let i = 0; i < 100; i += 1) {
    const [userId, interaction] = giveMockPoint();
    await BuddiesModel.giveUserAPoint(userId, interaction);
  }
};

seedPoints();
console.log('Data was seeded to the points collection, happy developing 🥳');
// quit the terminal process
exit();
